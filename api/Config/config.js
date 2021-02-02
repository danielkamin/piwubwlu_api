const cors = require( 'cors')
const cookieParser = require( 'cookie-parser');
const {verifyTransport } = require( '../Utils/emailConfig')
const {WEB_URL} = require( '../Utils/constants')
exports.configExpress = (app,express)=>{
    app.use(cors({ credentials: true, origin: WEB_URL }));
    app.use(express.json());
    app.use(cookieParser());
    app.use(express.urlencoded({ extended: true }));
    verifyTransport();
}