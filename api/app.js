const express = require( 'express');
const db = require( '../database/models/index')
const https = require('https');
const fs = require('fs');
const labRouter = require( './Routes/lab')
const machineRouter = require( './Routes/machine')
const workshopRouter = require( './Routes/workshop')
const departmentRouter = require( './Routes/department')
const employeeRouter = require( './Routes/employee')
const rentalRouter = require( './Routes/reservation')
const authRouter = require( './Routes/auth')
const userRouter = require( './Routes/user')
const utilsRouter = require( './Routes/utils')
const guestRouter = require( './Routes/guest')
const degreeRouter = require('./Routes/degree')
const CASRouter = require('./Routes/cas')
const workshopTypeRouter = require( './Routes/workshopType')
const cron = require( 'node-cron')
const {cronSetup} = require( './Utils/emailConfig')
const {dbConnect} = require( './Config/dbConnect')
const {configExpress} = require( './Config/config')
const session = require('express-session');

dbConnect(db.sequelize);
const app = express();
configExpress(app,express,session);

//ssl setup
const options = {
  key: fs.readFileSync('./certs/localhost-key.pem'), // Replace with the path to your key
  cert: fs.readFileSync('./certs/localhost.pem') // Replace with the path to your certificate
}

cronSetup(cron,db);
app.get('/',function(req,res) {
  res.send('Hello from Platforma Wynajmu Urządzeń Laboratoryjnych API');
})


//routes
app.use('/uploads',express.static('uploads'));
app.use('/auth', authRouter);
app.use('/api/departments',departmentRouter);
app.use('/api/machines',machineRouter);
app.use('/api/workshops',workshopRouter);
app.use('/api/workshopTypes',workshopTypeRouter)
app.use('/api/labs',labRouter);
app.use('/api/rental',rentalRouter);
app.use('/api/employees',employeeRouter);
app.use('/api/user',userRouter)
app.use('/api/guests',guestRouter)
app.use('/api/utils',utilsRouter)
app.use('/api/degrees',degreeRouter)
app.use('/api/cas',CASRouter)



const port = process.env.PORT || 5000;


https.createServer(options, app).listen(port,() => {
  console.log('Server listening on port ' + port);
});