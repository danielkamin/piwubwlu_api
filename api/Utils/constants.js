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
  ENDED:'ZAKOŃCZONA',
  PENDING:'OCZEKUJĄCA',
  ACCEPTED:'ZAAKCEPTOWANA',
  DECLINED:'ODRZUCONA',
  VERIFICATION:'WERYFIKACJA',
  EVALUATION:'EWALUACJA',
  APPROVAL:'ZATWIERDZENIE'
}

exports.ReservationSugestedState = {
  ACCEPTED:'Do akceptacji',
  DECLINED:'Do odrzucenia',
  CORRECT:'Do poprawek'
}

exports.WEB_URL = 'https://localhost:3000';
exports.WEB_URL_NOPORT = 'https://localhost';
exports.RentInterval = Object.freeze({
  15:'15',30:'30',45:'45',60:'60'
  })

