const {promisify} =require('util')
const fs =require('fs')

const unlinkAsync = promisify(fs.unlink)

function uploadImage(model){
    return async (req,res,next)=>{
        const tempModel = await model.findByPk(req.body.id)
        console.log(req.body.id)
          if(tempModel.imagePath !== null){
            await unlinkAsync(tempModel.imagePath)
          }
          await model.update({imagePath:req.file.path},{where:{id:tempModel.id}})
          res.send({ok:true})
    }  
  }
function deleteImage(model){
  return async (req,res,next)=>{
    const tempModel = await model.findByPk(req.body.id)
      if(tempModel.imagePath !== null){
        await unlinkAsync(tempModel.imagePath)
      }
      await model.update({imagePath:null},{where:{id:tempModel.id}})
      res.send({ok:true})
}  
}
module.exports = {
  uploadImage,deleteImage
}