//Questons 1

const firstName = "Hooi";
const lastName="Weijie";
console.log("Welcome", + firstName+lastName+"!")

//Question 2
function getAgeInMonths(years){
return years *12
}
console.log("18 years is " + (getAgeInMonths(18)) + "months");

//Question 3
const favSubjects = ["Math","Programming", "Science"];
for(let i =0;i<favSubjects.length;i++){
    console.log("I enjoy learning " + favSubjects[i])
}
//Question 4

for(let i=1;i<21 ; i++){
    if(i%4==0){
        console.log("Wow!")
    }else{
        console.log(i)
    }
}

//Question 5 
const todoList = ["Do laundry", "Finish homework", "Buying groceries"]
//push to the end of the array
todoList.push("Submit assignment")

//remove the first items 
todoList.splice(0,1)
console.log(todoList)

//Add "Drink Water" to first array 
todoList.unshift("Drink Water")

//print final array 

console.log(todoList)

//Question 6 
const [ firstTask , SecondTask ] = todoList
console.log("First Task :" + firstTask)
console.log("Second Task :"  + SecondTask)

//Question 7 
const movie={
    title:"Thunderbolts",
    year : 2025,
    rating : 9,
    isWatched :true
}

function printMovieDetails(movie){
    console.log(`You watched '${movie.title}'(${movie.year}), rated ${movie.rating}/10`)
}
printMovieDetails(movie)


//Question 8 
movie["genre"] = "action"
console.log(movie)

//Question 9 

function findLargestNumber(array){
    let biggestNumber = array[0]
    for(let i =0;i<array.length;i++){
        if(array[i]>biggestNumber){
            biggestNumber=array[i]
        }
    }
    return  biggestNumber
}
console.log("The largest number is :" +findLargestNumber([23,89,16,45,91,67]))