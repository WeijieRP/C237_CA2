const authorize=(req , res , next)=>{
    console.log(req.body)
    const {name , password}= req.body
    console.log(req.body)
   
    if(name!=="john" && password!==1234){
        return res.status(401).send("unauthorized access")
    }
    req.name = name
    req.password = password
    next()
}
module.exports= {authorize}