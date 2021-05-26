const CASAuthentication = require('cas-authentication');
const CAS = new CASAuthentication({
  cas_url         : 'https://casserver.herokuapp.com/cas',
  service_url     : 'http://77.46.45.243:5000'
})

module.exports = CAS;