exports.UserRoles = {
    ADMIN:'ADMIN', 
    DEPUTYFACULTYHEAD:'DEPUTYFACULTYHEAD',
    FACULTYHEAD:'FACULTYHEAD',
    DEPARTMENTHEAD:'DEPARTMENTHEAD',
   SUPERVISOR:'SUPERVISOR',
   EMPLOYEE:'EMPLOYEE',
    REGULAR:'REGULAR', 
}; 

exports.guestTypes = {
    admin:"ADMIN",
    guest:"GUEST",
    employee:"EMPLOYEE",
}
exports.ReservationState = {
  FINISHED:'FINISHED',
  PENDING:'PENDING',
  ACCEPTED:'ACCEPTED',
  DECLINED:'DECLINED',
  REVIEW:'REVIEW'
}

exports.ReservationSugestedState = {
  CORRECT:'CORRECT',
  ACCEPTED:'ACCEPTED',
  DECLINED:'DECLINED'
}

exports.WEB_URL = 'https://localhost:3000';
exports.WEB_URL_NOPORT = 'https://localhost';
exports.RentInterval = Object.freeze({
  15:'15',30:'30',45:'45',60:'60'
  })

