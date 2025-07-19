//Manipulating Arrays

const myArr = ['Republic Poly ', 10 , true]

myArr.push(15)
console.log("After adding number 15:"+ myArr)

myArr.pop()
console.log("After removing last element:"+ myArr)

myArr.unshift("C237")
console.log("After adding C237" + myArr)

//Destructing Arrays

const animalArr= ['Lion', "Tiger", "Leopard"];

const [animal1 , animal2 , animal3]= animalArr

console.log(animal1)
console.log(animal2)
console.log(animal3)

//Functions
function multiplyTen(num){
    return num *10
}
console.log("Answer is :" + multiplyTen(5))

//JavaScript objects 

const person={
    givenName:"John",
    surname :"Lim",
    age:19,
    graduated:false
}
console.log("Given Name:" + person.givenName)
console.log("Surname:" + person.surname)

console.log("Age:" + person.age)
console.log("Graduated:" + person.graduated)
