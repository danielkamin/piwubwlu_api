const nodemailer = require('nodemailer');

const {ReservationTypes} = require('../Utils/constants')
Array.prototype.move = function (from,to) {
  this.splice(to, 0, this.splice(from, 1)[0]);
}
const emailSettings = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  secure:true,
  requireTLS: true,
  port: 465,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  }
});

const FormatTextToHtml = (text)=>{
  return `<p>${text}</p>`
}
exports.verifyTransport = ()=>{
  emailSettings.verify(function(error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
    }
  });
}
/**
 * Returns x raised to the n-th power.
 *
 * @param {string} email Recipient address.
 * @param {string} subject Subject of the message.
 * @param {string} messageBody Text included in message's body.
 * @param {html} html Additional HTML format message
 * @return asynchronusly sends email message.
 */
exports.sendMessage = (email, subject, messageBody,html)=>{  
    const message = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Testy platformy!! "+subject,
      html:FormatTextToHtml(messageBody)
    };
    if(html)
      message.html = messageBody +'<br/>' + html;
    else 
      message.text =messageBody;
    
    emailSettings.sendMail(message,(error,info)=>{
      if(error){
        console.log(error)
      }else{      
        console.log('Email sent to: '+info.response)
      }
    });
}

