const {promisify} =require('util')
const fs =require('fs')

const unlinkAsync = promisify(fs.unlink)

module.exports = function uploadImage (model){
    return async (req,res,next)=>{
        console.log(req.file)
        console.log(req.body.id)
        const tempModel = await model.findByPk(req.body.id)
          if(tempModel.imagePath !== null){
            await unlinkAsync(tempModel.imagePath)
          }
          await model.update({imagePath:req.file.path},{where:{id:tempModel.id}})
          res.send({ok:true})
    }  
  }