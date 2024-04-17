// CompanyList.js
import React from 'react';
import { List, Datagrid, TextField } from 'react-admin';

const CompanyList = (props) => (
    <List {...props}>
        <Datagrid>
            <TextField source="name" />
            {/* No agregamos la columna "id" */}
        </Datagrid>
    </List>
);

export default CompanyList;