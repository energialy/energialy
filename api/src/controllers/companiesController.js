const { Companies, Locations, Categories, Subcategories } = require("../db");
const { Op } = require("sequelize");

const cleanCompanies = (companies) => {
  if (Array.isArray(companies)) {
    const cleanCompaniesArray = companies.map((company) => ({
      id: company.id,
      name: company.name,
      categories: company.Categories,
      subcategories: company.Subcategories,
      profilePicture: company.profilePicture,
      bannerPicture: company.bannerPicture,
      locations: company.Locations,
      foundationYear: company.foundationYear,
      annualRevenue: company.annualRevenue,
      employeeCount: company.employeeCount,
      isActive: company.isActive,
    }));
    return cleanCompaniesArray;
  } else {
    const cleanCompanyDetail = {
      id: companies.id,
      name: companies.name,
      description: companies.description,
      categories: companies.Categories,
      subcategories: companies.Subcategories,
      profilePicture: companies.profilePicture,
      bannerPicture: companies.bannerPicture,
      locations: companies.Locations,
      foundationYear: companies.foundationYear,
      annualRevenue: companies.annualRevenue,
      employeeCount: companies.employeeCount,
      cuit: companies.cuit,
      website: companies.website,
      compreNeuquino: companies.compreNeuquino,
      multimedia: companies.multimedia,
      experience: companies.experience,
      services: companies.services,
      certifications: companies.certifications,
      homologations: companies.homologations,
      isActive: companies.isActive,
      createdAt: companies.createdAt,
      updatedAt: companies.updatedAt
    };
    return cleanCompanyDetail;
  }
};

const getAllCompanies = async () => {
  const allCompanies = await Companies.findAll({
    attributes: ["id", "name", "profilePicture", "bannerPicture", "foundationYear", "annualRevenue", "employeeCount", "isActive"],
    include: [
      {
        model: Categories,
        attributes: ["id", "name", "isActive"],
        through: { attributes: [] },
      },
      {
        model: Subcategories,
        attributes: ["id", "name", "CategoryId", "isActive"],
        through: { attributes: [] },
      },
      {
        model: Locations,
        attributes: ["id", "name", "isActive"],
        through: { attributes: [] },
      },
    ],
  });
  return cleanCompanies(allCompanies);
};

const filterCompaniesByName = async (name) => {
  const filteredCompanies = await Companies.findAll({
    where: {
      name: {
        [Op.iLike]: `%${name}%`,
      },
    },
    include: [
      {
        model: Categories,
        attributes: ["id", "name", "isActive"],
        through: { attributes: [] },
      },
      {
        model: Subcategories,
        attributes: ["id", "name", "CategoryId", "isActive"],
        through: { attributes: [] },
      },
      {
        model: Locations,
        attributes: ["id", "name", "isActive"],
        through: { attributes: [] },
      },
    ],
  });
  return cleanCompanies(filteredCompanies);
};

const getCompanyByID = async (id) => {
  const foundCompany = await Companies.findByPk(id, {
    include: [
      {
        model: Categories,
        attributes: ["id", "name", "isActive"],
        through: { attributes: [] },
      },
      {
        model: Subcategories,
        attributes: ["id", "name", "CategoryId", "isActive"],
        through: { attributes: [] },
      },
      {
        model: Locations,
        attributes: ["id", "name", "isActive"],
        through: { attributes: [] },
      },
    ],
  });
  if (!foundCompany) {
    const error = new Error(`Company with id ${id} not found.`);
    error.status = 404;
    throw error;
  }
  return cleanCompanies(foundCompany);
};

const createCompany = async (body) => {
  const { name, description, locations, subcategories, profilePicture, bannerPicture, foundationYear, annualRevenue, employeeCount, cuit, website, compreNeuquino, multimedia, experience, services, certifications, homologations } = body;
  if ( !name || !description || !locations || !subcategories || !profilePicture || !bannerPicture || !foundationYear || !annualRevenue || !employeeCount || !cuit ) {
    const error = new Error("Missing required attributes.");
    error.status = 400;
    throw error;
  }
  for (const locationID of locations) {
    const foundLocation = await Locations.findByPk(locationID);
    if (!foundLocation) {
      const error = new Error(`Location with id ${locationID} not found.`);
      error.status = 404;
      throw error;
    }
  }
  for (const subcategoryID of subcategories) {
    const foundSubcategory = await Subcategories.findByPk(subcategoryID);
    if (!foundSubcategory) {
      const error = new Error(`Subcategory with id ${subcategoryID} not found.`);
      error.status = 404;
      throw error;
    }
  }
  const newCompany = await Companies.create(body);
  for (const locationID of locations) {
    const foundLocation = await Locations.findByPk(locationID);
    await newCompany.addLocation(foundLocation);
  }
  for (const subcategoryID of subcategories) {
    const foundSubcategory = await Subcategories.findByPk(subcategoryID);
    const foundParentCategory = await Categories.findByPk(
      foundSubcategory.CategoryId
    );
    await newCompany.addSubcategory(foundSubcategory);
    await newCompany.addCategory(foundParentCategory);
  }
  const createdCompany = await Companies.findByPk(newCompany.id, {
    include: [
      {
        model: Categories,
        attributes: ["id", "name", "isActive"],
        through: { attributes: [] },
      },
      {
        model: Subcategories,
        attributes: ["id", "name", "CategoryId", "isActive"],
        through: { attributes: [] },
      },
      {
        model: Locations,
        attributes: ["id", "name", "isActive"],
        through: { attributes: [] },
      },
    ],
  });
  return cleanCompanies(createdCompany);
};

const updateCompany = async (id, body) => {
  const foundCompany = await Companies.findByPk(id, {
    include: [
      { model: Categories },
      { model: Subcategories },
      { model: Locations },
    ],
  });
  if (!foundCompany) {
    const error = new Error(`Company with id ${id} not found.`);
    error.status = 404;
    throw error;
  }
  const { locations, subcategories } = body;
  if (locations) {
    for (const locationID of locations) {
      const foundLocation = await Locations.findByPk(locationID);
      if (!foundLocation) {
        const error = new Error(`Location with id ${locationID} not found.`);
        error.status = 404;
        throw error;
      }
    }
  }
  if (subcategories) {
    for (const subcategoryID of subcategories) {
      const foundSubcategory = await Subcategories.findByPk(subcategoryID);
      if (!foundSubcategory) {
        const error = new Error(`Subcategory with id ${subcategoryID} not found.`);
        error.status = 404;
        throw error;
      }
    }
  }
  await foundCompany.update(body);
  if (locations) {
    if (foundCompany.Locations) {
      for (const location of foundCompany.Locations) {
        const foundLocation = await Locations.findByPk(location.id);
        await foundCompany.removeLocation(foundLocation);
      }
    }
    for (const locationID of locations) {
      const foundLocation = await Locations.findByPk(locationID);
      await foundCompany.addLocation(foundLocation);
    }
  }
  if (subcategories) {
    if (foundCompany.Subcategories) {
      for (const subcategory of foundCompany.Subcategories) {
        const foundSubcategory = await Subcategories.findByPk(subcategory.id);
        const foundParentCategory = await Categories.findByPk(foundSubcategory.CategoryId);
        await foundCompany.removeSubcategory(foundSubcategory);
        await foundCompany.removeCategory(foundParentCategory);
      }
    }
    for (const subcategoryID of subcategories) {
      const foundSubcategory = await Subcategories.findByPk(subcategoryID);
      const foundParentCategory = await Categories.findByPk(foundSubcategory.CategoryId);
      await foundCompany.addSubcategory(foundSubcategory);
      await foundCompany.addCategory(foundParentCategory);
    }
  }
  const updatedCompany = await Companies.findByPk(id, {
    include: [
      {
        model: Categories,
        attributes: ["id", "name", "isActive"],
        through: { attributes: [] },
      },
      {
        model: Subcategories,
        attributes: ["id", "name", "CategoryId", "isActive"],
        through: { attributes: [] },
      },
      {
        model: Locations,
        attributes: ["id", "name", "isActive"],
        through: { attributes: [] },
      },
    ],
  });
  return cleanCompanies(updatedCompany);
};

module.exports = {
  getAllCompanies,
  filterCompaniesByName,
  getCompanyByID,
  createCompany,
  updateCompany,
};
