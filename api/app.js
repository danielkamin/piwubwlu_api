const express = require( 'express');
const db = require( '../database/models/index')
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
const workshopTypeRouter = require( './Routes/workshopType')
const cron = require( 'node-cron')
const {cronSetup} = require( './Utils/emailConfig')
const {dbConnect} = require( './Config/dbConnect')
const {configExpress} = require( './Config/config')
dbConnect(db.sequelize);
const app = express();
configExpress(app,express);
cronSetup(cron,db);

app.get('/',function(req,res){
  res.send('Hello World')
})

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
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Resource Server is running on port ${port}`);
});
