'use strict';
const {roles} = require('../../api/Utils/constants');
const bcrypt = require('bcrypt')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    const user = await queryInterface.bulkInsert('Users',[{
      name:'admin',
      email:'daniel.kaminski1998@gmail.com',
      userType:'ADMIN',      
      password:hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    }],{ returning: ['id'] })
    let data = [];
    roles.forEach((role)=>{
      data.push({
        role_name:role,
        createdAt: new Date(),
       updatedAt: new Date()
      })
    })

    const rolesQuery = await queryInterface.bulkInsert('Roles',data,{ returning: ['id'] }) 
    const userRolesQuery =  await queryInterface.bulkInsert('UserRoles',[{
      userId:user[0].id,roleId:rolesQuery[0].id,      
       createdAt: new Date(),
       updatedAt: new Date()
     },{
       userId:user[0].id,roleId:rolesQuery[1].id,      
        createdAt: new Date(),
        updatedAt: new Date()
      },{
       userId:user[0].id,roleId:rolesQuery[2].id,      
        createdAt: new Date(),
        updatedAt: new Date()
      },{
        userId:user[0].id,roleId:rolesQuery[3].id,      
         createdAt: new Date(),
         updatedAt: new Date()
       }])
      return await queryInterface.bulkInsert('Employees',[{
        userId:user[0].id,
        createdAt: new Date(),
        updatedAt: new Date()
      }])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users',null,{})
    await  queryInterface.bulkDelete('Roles',null,{})
    await  queryInterface.bulkDelete('Employees',null,{})
    return await queryInterface.bulkDelete('UserRoles',null,{})
  }
};