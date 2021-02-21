exports.roles = [
    'ADMIN', 
   'SUPERVISOR',
   'EMPLOYEE',
    'REGULAR', 
  ]; 
exports.guestTypes = {
    admin:"ADMIN",
    guest:"GUEST",
    employee:"EMPLOYEE"
  }
exports.ReservationTypes = Object.freeze({PENDING:'PENDING',ACCEPTED:'ACCEPTED',DECLINED:'DECLINED',FINISHED:'FINISHED'})
exports.WEB_URL = 'http://localhost:3000';
exports.WEB_URL_NOPORT = 'http://localhost';
exports.RentInterval = Object.freeze({
  15:'15',30:'30',45:'45',60:'60'
  })
exports.EmployeeTitles = Object.freeze({ENGINEER:'inż.',MASTER:'mgr',DOCTOR:'dr',PROFESSOR:'prof.',HABILITATOR:'hab.'})
