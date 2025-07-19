const requestproduct =(req, res) => {
    const { userId, id, title, body } = req.body;

    const json = {
        userId: userId,
        id: id,
        title: title,
        body: body
    };

    console.log(json);
    res.status(201).json(json);
}
const getproducts = (req , res)=>{
    const {Id}= req.params
    let sortedproduct= [...products]
    sortedproduct=sortedproduct.find((product)=>product.userId===Number(Id))
    if(sortedproduct){
        
        return res.status(200).json(sortedproduct)
    }//number 
    return res.status(404).json({
            sucess:true,
            data:[]
    })
    //swa
    //expres oruter
}

module.exports={requestproduct , getproducts}