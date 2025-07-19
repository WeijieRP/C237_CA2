const authroized=(req , res, next)=>{
    const {user}= req.query
    if(user==="john"){
        req.user = {name:"john", age:"20"}
        next()
    }else{
        res.status(401).send("authorized access")
    }
    
    //midle 
}
module.exports= authroized