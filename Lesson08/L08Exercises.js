//Arrow functions
const triple=(num)=>{
    return num *3
}
console.log("Answer:" + triple(2))

//Spread Operator
const fruits = ['apricot', "orange"];
const vegetables = ['cucumber', "potato"];
const new_array =[...fruits, ...vegetables]
console.log(new_array)

//classes

class Book{
    constructor(title , author , publicationYear){
        this.title = title,
        this.author = author,
        this.publicationYear= publicationYear
    }
    getDetails(){
        console.log(`Title: ${this.title}`)
        console.log(`Author:${this.author}`)
        console.log(`Publication Year: ${this.publicationYear}`)
    }
}

//Inheritance 

class Magzine extends Book{
    constructor(title , author , publicationYear, issueNumber){
        super(title , author , publicationYear)
        this.issueNumber = issueNumber

    }
    getDetails(){
        super.getDetails()
        console.log(`Issue Number : ${this.issueNumber}`)
    }
}
const myBook = new Book("Intro to JavaScript", "R.M. Salinzer",2023)
myBook.getDetails();

const myMagazine = new Magzine("National Geographic ", "Various", 2022,123)
myMagazine.getDetails()