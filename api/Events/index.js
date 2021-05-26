const events = require('events');
const eventEmitter = new events.EventEmitter();

eventEmitter.on('reservationEnd',()=>{
    console.log('reservation ended')
})

module.exports = eventEmitter