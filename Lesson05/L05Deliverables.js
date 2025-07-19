//Question 1

let studentName = "Weijie";
let StudentAge = 22;
console.log("Hi, my name is" + studentName+ "and I am " + StudentAge, "years old.")

//Question 2 

let moduleCode = "C237";
console.log("I am learning module "+ moduleCode + "this semester.")

//Question 3
for(let i =1;i<6 ; i++){
    console.log(i)
}

//Question 4

for(let i =1 ; i<=10 ;i++){
    if(i%2==0){
        console.log(i)
    }
}

//Question 5
// const favThings = ['Coding', "Music" , "Cats"]

// console.log(favThings[0])
// console.log(favThings[1])

// console.log(favThings[2])

//Question 6

// const favThings = ['Coding', "Music" , "Cats"]

// for (let i =0; i<favThings.length;i++){
//     console.log(favThings[i])
// }


//Question 7 
for(let i =1;i<21;i++){
    if(i%3==0){
        console.log("Fizz")
    }else if(i%5==0){
        console.log("Buzz")
    }else if(i%5==0 && i%3==0){
        console.log("FizzBuzz")
    }else{
        console.log(i)
    }
}