const { Router } = require('express');
const {
  getUsersHandler,
   getUserByIDHandler,
   updateUserProfileHandler,
  // createUserHandler,
  // deleteUserHandler,
} = require('../../handlers/usersHandler');

const usersRouter = Router();

usersRouter.get('/', getUsersHandler);
usersRouter.get('/:id', getUserByIDHandler);
usersRouter.put('/:id', updateUserProfileHandler);
// usersRouter.delete('/:id', deleteUserHandler);

module.exports = usersRouter;