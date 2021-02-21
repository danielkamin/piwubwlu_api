/**
 * Middleware function takes two arguments: model - data model we are searching for and Op - sequelize search operator
 * @param {model} model 
 * @param {Operator} Op 
 */
module.exports = function paginatedSortedResults(model,Op){
    return async (req,res,next)=>{
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)
        const startIndex = (page -1)*limit
        const endIndex = page*limit
        const results = {}
        if(endIndex <model.length){
            results.next = {
                page:page + 1,
                limit:limit
            };
        }
        if(startIndex>0){
            results.previous ={
                page: page - 1,
                limit: limit
            }
        }
        const name = (req.query.q===undefined)?'':(req.query.q)
        switch(req.query.sort){
            case 'asc':
                results.results= await model.findAll({
                offset: startIndex, limit: limit ,
                attributes: ['id', 'name','english_name','imagePath'],
                order:[['name','ASC']],
                where:{name:{[Op.iLike]:'%'+name+'%'}}
            });
            break;
            case 'desc':
                results.results= await model.findAll({
                offset: startIndex, limit: limit ,
                attributes: ['id', 'name','english_name','imagePath'],
                order:[['name','DESC']],
                where:{name:{[Op.iLike]:'%'+name+'%'}}
            });
            break;
            default:
                results.results= await model.findAll({
                offset: startIndex, limit: limit ,
                attributes: ['id', 'name','english_name','imagePath'],
                where:{name:{[Op.iLike]:'%'+name+'%'}}
            });
            break;
        }
        res.paginatedResults = results;
        next();
    }
}