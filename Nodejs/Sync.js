const {readFile , writeFile} = require("fs")
const getText=(pathName)=>{
    new Promise((resolve , rejects)=>{
       readFile(pathName , (error , result)=>{
        if(error){
            console.log(error)
        }else{
            console.log(result)
        }
       })
    })
}
//asynzaition await patterns 
const start =async()=>{
    try{
 const first = await getText("./hello.txt")
    const seconds = await getText("./helloworld.txt")
    console.log(first)
    console.log(seconds)
    }catch(error){
        console.log(error)
        
    }
   
}
start()