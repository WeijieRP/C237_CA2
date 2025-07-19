const express= require("express")
const app = express();
const port =3000;
app.use(express.urlencoded({extended:true}));
app.use(express.json());
//usng tempalef enehine to display content html 
app.set("view", "ejs")
let books=[
    {
        id:1 , title:"Book A", author:"Peter Tan"
    },
    {
        id:2 , title:"Book B", author:"Mary Lee"
    },
    {
        id:3 , title:"Book C", author:"Same Ho"
    },
]
app.post("/addBook",(req ,res)=>{
    const newID = books.length+1;
    books.push({id:newID , title : req.body.title , author:req.body.author});
    res.redirect("/books");
})
app.get("/books", (req , res)=>{
    let list = "";
    for(let i=0;i<books.length;i++){
        list+=`
        <li>
        ${books[i].title}(Author:${books[i].author})
        <a href="/editBook/${books[i].id}">Edit</a>
        <li>${books[i].id}</li>
        <form action="/deleteBook/${books[i].id}" method="POST">
            <button type="submit">Delete</button>
        </form>
        </li>`;

    }
    res.send(`<h1>Book List</h1><ul>${list}</ul>`);
})
app.post("/deleteBook/:id", (req , res)=>{
    
    const id = parseInt(req.params.id);
    console.log(id)
    books = books.filter(b=>b.id!==id);
    res.redirect("/books");
})

//get all books
app.get("/editBook/:id", (req , res)=>{
    const id = parseInt(req.params.id);
    let book = null;
    for(let i =0;i<books.length;i++){
        if(books[i].id===id){
        book= books[i];
        break;
        }
    }
    if(!book){
        return res.send('<p>Book not found.</p><a href="/books">Back to List</a>');
    }
    res.send(
        `
        <h1>Edit Book</h1>
        <form action="/editBook/${book.id}" method="POST">
            Book Title : <input name="title" value="${book.title}" required/><br><br>
            Author : <input name="author" value="${book.author}" required/><br><br>
            <button type="submit">Update Book</button>
        </form>
        <a href="/books">Back to List</a>
        `
    )
})
//create books and edit
app.post("/editBook/:id", (req , res)=>{
    const id = parseInt(req.params.id);
    console.log(id)
    
    for(let i=0;i<books.length;i++){
        if(books[i].id===id){
            books[i].title=req.body.title;
            books[i].author= req.body.author;
            break;
        }
    }
    res.redirect("/books");
})
//app get all books
app.get("/addBook", (req , res)=>{
    res.send(`
        <h1>Add a Book</h1>
        <form action="/addBook" method ="POST">
            Book Title :<input name ="title" placeholder = "Book title"/><br><br>
            Author : <input name="author" placeholder="Author"/><br><br>
            <button type="submit">Add Book</button>
            </form>
        `)
})
app.listen(port, ()=>{
    console.log(`Server is running at http://localhost:${port}`);
})