'use strict';
const bcrypt = require('bcrypt')

const UserRoles = [
  {role_name:'ADMIN',description:'Administrator Platformy'}, 
  {role_name:'FACULTYHEAD',description:'Dziekan'},
  {role_name:'DEPUTYFACULTYHEAD',description:'Prodziekan'},
  {role_name:'DEPARTMENTHEAD',description:'Kierownik Katedry'},
  {role_name:'SUPERVISOR',description:'Nadzorca Pracowni'},
  {role_name:'EMPLOYEE',description:'Pracownik'},
  {role_name:'REGULAR',description:'Standardowy Użytkownik'},
]; 

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    const user = await queryInterface.bulkInsert('Users',[{
      email:'daniel.kaminski1998@gmail.com',
      firstName:'ADMIN',
      lastName:'ADMIN',
      userType:'ADMIN',      
      password:hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    }],{ returning: ['id'] })
    let data = [];

    UserRoles.forEach(role=>{
      data.push({
        role_name:role.role_name,
        description:role.description,
        createdAt: new Date(),
       updatedAt: new Date()
      })
    })

    const rolesQuery = await queryInterface.bulkInsert('Roles',data,{ returning: ['id'] })
    await queryInterface.bulkInsert('UserRoles',[{
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
       },
       {
        userId:user[0].id,roleId:rolesQuery[3].id,      
         createdAt: new Date(),
         updatedAt: new Date()
       },{
       userId:user[0].id,roleId:rolesQuery[4].id,      
        createdAt: new Date(),
        updatedAt: new Date()
      },{
        userId:user[0].id,roleId:rolesQuery[5].id,      
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
