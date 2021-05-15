/**
 * Middleware function for searching and sorting.
 * @param {model} model - sequelize model
 * @param {Operator} Op - sequelize Op object
 */
module.exports = function seachAndSortData(model,Op){
    let results = []
    return async (req,res,next)=>{
        const name = (req.query.q===undefined)?'':(req.query.q)
        switch(req.query.sort){
            case 'asc':
                results= await model.findAll({
                attributes: ['id', 'name','english_name','imagePath'],
                order:[['name','ASC']],
                where:{name:{[Op.iLike]:'%'+name+'%'}}
            });
            break;
            case 'desc':
                results= await model.findAll({
                attributes: ['id', 'name','english_name','imagePath'],
                order:[['name','DESC']],
                where:{name:{[Op.iLike]:'%'+name+'%'}}
            });
            break;
            default:
                results= await model.findAll({
                attributes: ['id', 'name','english_name','imagePath'],
                where:{name:{[Op.iLike]:'%'+name+'%'}}
            });
            break;
        }
        res.filteredResults = results;
        next();
    } 
}