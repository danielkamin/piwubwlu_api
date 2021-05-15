const cors = require( 'cors')
const cookieParser = require( 'cookie-parser');
const {verifyTransport } = require( '../EmailService/config')
const {WEB_URL} = require( '../Utils/constants')
const whiteList = ['https://casserver.herokuapp.com/cas/login','http://77.46.45.243:3000','http://77.46.45.243:5000','https://localhost:3000','http://localhost:58848']
exports.configExpress = (app,express,session)=>{
    app.use(cors({credentials:true,origin:function (origin, callback) {
      if (whiteList.indexOf(origin) !== -1 || !origin) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    }}));
    app.use(express.json());
    app.use(cookieParser());
    app.use(express.urlencoded({ extended: true }));
    app.use( session({
        secret            : 'asdasd12312asd12dasd12312dasasd',
        resave            : false,
        saveUninitialized : true
      }));
    verifyTransport();
}