const express = require( 'express');
const db = require( './database/models/index')
const https = require('https');
const fs = require('fs');
const logger = require('./api/Config/loggerConfig');
const Routes = require('./api/Routes')
const {cronSetup} = require( './api/EmailService/cron')
const {dbConnect} = require( './api/Config/dbConnect')
const {configExpress} = require( './api/Config/config')
const session = require('express-session');
const helmet = require("helmet");
//root path to application
global.__basedir = __dirname;
dbConnect(db.sequelize);
const app = express();
configExpress(app,express,session);
cronSetup(db);

//ssl setup
const options = {
  key: fs.readFileSync('./certs/localhost-key.pem'), // Replace with the path to your key
  cert: fs.readFileSync('./certs/localhost.pem') // Replace with the path to your certificate
}
app.get('/',function(req,res) {
  res.send('Hello from Platforma Wynajmu Urządzeń Laboratoryjnych API');
})

//helmet
app.use(helmet());
//routes
app.use('/uploads',express.static('uploads'));
app.use('/auth', Routes.authRouter);
app.use('/api/departments',Routes.departmentRouter);
app.use('/api/machines',Routes.machineRouter);
app.use('/api/workshops',Routes.workshopRouter);
app.use('/api/workshopTypes',Routes.workshopTypeRouter)
app.use('/api/labs',Routes.labRouter);
app.use('/api/rental',Routes.rentalRouter);
app.use('/api/employees',Routes.employeeRouter);
app.use('/api/user',Routes.userRouter)
app.use('/api/guests',Routes.guestRouter)
app.use('/api/utils',Routes.utilsRouter)
app.use('/api/degrees',Routes.degreeRouter)
app.use('/api/stats',Routes.statsRouter)
app.use('/api/maintenance',Routes.maintenanceRouter)
app.use(Routes.CASRouter)


const port = process.env.PORT || 5000;

logger.log({
  level: 'info',
  message: 'Re-start of the app'});

app.listen(port, () => {
  console.log(`Resource Server is running on port ${port}`);
});

// https.createServer(options, app).listen(port,() => {
//   console.log('Server listening on port ' + port);
// });