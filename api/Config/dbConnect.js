
exports.dbConnect = async (sequelize)=>{
    let retries = 5;
    while(retries){
      try{
        await sequelize.authenticate();
        break;
      }catch(err)
      {
        console.log(err)
        retries--;
        console.log(`Retries left ${retries}`)
        await new Promise(res=>setTimeout(res,5000))
      }
    }
}