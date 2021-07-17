const db = require('../../database/models')
const logger = require('../Config/loggerConfig')
const Op = db.Sequelize.Op
const fs = require('fs')
const {ReservationState} = require('../Utils/constants')
const {getMachineReservationsByDepartmentId,getReservationsByMachine,groupAndReduceReservations} = require('../Utils/statsHelpers')
const Printer = require('../Config/PDF/config')
const {tableObject} = require('../Config/PDF/helpers')
const {sendMessage} = require('../EmailService/config')
/* ROCZNE - 12 MIESIĘCY ZESTAWIONE */

const getYearlyStatistics = async (req, res) => {
  const reservations = await db.Reservation.findAll({ where: { machineId: req.query.id } });
  const groups = reservations.reduce((groups, reservation) => {
    const date = reservation.start_date.getMonth();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push((reservation.end_date.getTime()-reservation.start_date.getTime())/60000);
    return groups;
  }, {});

  const groupArrays = Object.keys(groups).map((date) => {
    let amountOfMinutes = 0;
    groups[date].forEach(minutes=>{
      amountOfMinutes+=minutes
    })
    return {
      date,
      time: amountOfMinutes
    };
  });

  res.send(groupArrays)
}

/* END ROCZNE */



/* MIESIĘCZNE - STATYSTYKI Z POJEDYNCZEGO MIESIĄCA */

const getMonthlyMachineStatistics = async (req, res) => {
  const currentYear = new Date().getFullYear()
  const month = req.query.month
  const machineId = req.query.id
  if(!month || !machineId) 
    return res.status(400).send({ok:false,message:'Podano złe parametry zapytania'})
  const startDate = new Date(currentYear,month)
  const endDate = new Date(currentYear,+month+1)

  try{
    const response = await getReservationsByMachine(+machineId,startDate,endDate)
    res.send(response)
  }catch(err){
    res.send(err);
    logger.error({message: err, method: 'getMonthlyMachineStatisticsByPurpose'})
  }

}

/* END MIESIĘCZNE */



/* DLA POJEDYNCZEGO PRACOWNIKA ROCZNE I MIESIĘCZNE */

const getPersonalStatisticsByMonth = async (req, res) => {
  const currentYear = new Date().getFullYear()
  const month = req.query.month
  const machineId = req.query.id
  const employeeId = req.query.employee
  if(!month || !machineId || !employeeId) 
    return res.status(400).send({ok:false,message:'Podano złe parametry zapytania'})
  const startDate = new Date(currentYear,month)
  const endDate = new Date(currentYear,+month+1)

  try{
    const reservations = await db.Reservation.findAll({ 
      where: { machineId: +machineId,
        employeeId:employeeId,
        state:ReservationState.ENDED,
        start_date:{
          [Op.lt]:endDate,
          [Op.gte]:startDate
        } 
      }});
    const response = groupAndReduceReservations(reservations)
    res.send(response)
  }catch(err){
    res.send(err);
    logger.error({message: err, method: 'getMonthlyMachineStatisticsByPurpose'})
  }
}

const getPersonalStatisticsByYear= async (req, res) => {
  const reservations = await db.Reservation.findAll({ 
    where: { machineId: req.query.id },
    include:{model:db.Employee,
      include:{model:db.User,attributes:['id','firstName','lastName']},} });
  const groups = reservations.reduce((groups,reservation)=>{
    const user = JSON.stringify(reservation.Employee.User);
    if(!groups[user]){
      groups[user] = [];
    }
    groups[user].push((reservation.end_date.getTime()-reservation.start_date.getTime())/60000)
    return groups;
  },[])
  const groupArrays = Object.keys(groups).map((user) => {
    let amountOfMinutes = 0;
    groups[user].forEach(minutes=>{
      amountOfMinutes+=minutes
    })
    return {
      user,
      time: amountOfMinutes
    };
  });
  res.send(groupArrays)
}

const getDepartmentStatistics = async (req, res) => {
  const currentYear = new Date().getFullYear()
  const month = req.query.month
  const departmentId = req.query.id
  if(!month || !departmentId) 
    return res.status(400).send({ok:false,message:'Podano złe parametry zapytania'})
  const startDate = new Date(currentYear,month)
  const endDate = new Date(currentYear,+month+1)
  try{
    const response = await getMachineReservationsByDepartmentId(req.query.id,startDate,endDate)
    res.send(response)
  }catch(err){
    res.send(err);
    logger.error({message: err, method: 'getDepartmentStatistics'})
  }
}

const exportDepartmentStatisticsPDF = async (req, res) => {
  const departmentId = req.query.id
  if(!departmentId) 
    return res.status(400).send({ok:false,message:'Podano złe parametry zapytania'})
    const departmentName = await db.Department.findByPk(departmentId,{attributes:['name','english_name']})
  const pdfDoc = await departmentStatistics(departmentId)
  const pdfFileName = `statystyki_${new Date().toLocaleDateString('default', { month: 'long' })}_${departmentName.name}.pdf`

  try{
    res.set('Content-Type', 'application/pdf');
    res.set('Content-Disposition', `attachment; filename=${pdfFileName}`);
    res.set('Content-Description: File Transfer');
    res.set('Cache-Control: no-cache');
    pdfDoc.pipe(res)
    pdfDoc.end()
  }catch(err){
    res.send(err);
    logger.error({message: err, method: 'getDepartmentStatistics'})
  }
} 

const departmentStatistics = async (depId)=>{
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const departmentId = depId
  
  const startDate = new Date(currentYear,month)
  const endDate = new Date(currentYear,+month+1)
  try{
    const response = await getMachineReservationsByDepartmentId(departmentId,startDate,endDate)
    const departmentName = await db.Department.findByPk(departmentId,{attributes:['name','english_name']})

    let docDefinition = {
      content:[
        {image:'api/Assets/images/wm_logo_black.png',style:'logo',alignment: 'center'},
        { text:`statystyki z miesiąca ${currentDate.toLocaleDateString('default', { month: 'long' })} dla departamentu:`, style: 'header',alignment: 'center' },
        { text: departmentName.name, style: 'subheader' },
        { text: departmentName.english_name, style: 'subheader' },
      ],
      styles: {
        logo:{
          margin: [0, 0, 0, 10],
          alignment: 'justify'
        },
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
          alignment: 'justify'
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 5, 0, 5]
        },
        tableExample: {
          margin: [0,10,0,10]
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black'
        }

      },
    }
    Object.keys(response).forEach(labName=>{
      if(Object.keys(response[labName]).length!==0){
        docDefinition.content.push(labName)
        docDefinition.content.push(tableObject(response[labName]))
      }   
    })
    const pdfDoc = Printer.createPdfKitDocument(docDefinition)
    return pdfDoc
  }catch(err){
    logger.error({message: err, method: 'getDepartmentStatistics'})
  }
}

const sendDepartmentStatisticsToEmail = async (req,res)=>{

  const departmentIDs = await db.Department.findAll({attributes:['id','name']})
  if(!departmentIDs){
    logger.error({message: 'Problem ze znalezieniem departamentów', method: 'setMonthlyStatisticsNewsLetter'})
    return res.status(400).send('Brak podanego emaila')
  }

  const email = req.query.email 
  if(!email){
    logger.error({message: 'email param error', method: 'sendDepartmentStatisticsToEmail'})
    return res.status(400).send('Brak podanego emaila')
  }

  const departmentIDsLength = departmentIDs.length
  const currentMonthName = new Date().toLocaleDateString('default', { month: 'long' })
  let attachments = []
  let docs = []
  for(let i =0 ; i<departmentIDsLength;i++){
    docs.push(await departmentStatistics(departmentIDs[i].id))
    const fileName = `statystyki_${currentMonthName}_${departmentIDs[i].name}.pdf`
    docs[i].pipe(fs.createWriteStream(`files/${fileName}`))
    docs[i].on('end',()=>{
      attachments.push({
        fileName:fileName,
        contentType: 'application/pdf',
        path:`files/${fileName}`
      })
      if(i===departmentIDsLength-1){
        sendMessage(
          email,
          'Miesięczne statystyki użycia aparatury',
          'w załączniku są zawartestastyki w postaci plików pdf',
          null,
          attachments)
      }
    })
    docs[i].end()
  }
  res.send({status:true})
}

module.exports = {
  departmentStatistics,exportDepartmentStatisticsPDF,
  getPersonalStatisticsByMonth,getDepartmentStatistics,
  getMonthlyMachineStatistics,sendDepartmentStatisticsToEmail
}