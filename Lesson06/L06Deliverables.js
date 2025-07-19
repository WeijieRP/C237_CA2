//Question1 

const studentInfo = ["RP", 2025 ,true]

//adding C237 end of the array 

studentInfo.push("C237")
console.log("Adding C237 into StudentInfo array :", studentInfo)

//Remove last item from the studentInfo array 
studentInfo.pop()
console.log("Removing last items from StudentInfo array :", studentInfo)

//Add "School of Infocomm" to the front of the array 

studentInfo.unshift("School of Infocomm")
console.log("Adding School of Infocomm into the front of the array :", studentInfo)

//Final array result 

console.log(studentInfo)

//Question 2 
const FavoriteSnacks = ['Chips', "Chocolate", "Cookies"]
//orginal array 
console.log("Orginal Array:"+FavoriteSnacks)
//pop to remove last snacks and print 

FavoriteSnacks.pop()

console.log("Updated Array " +FavoriteSnacks)


//Question 3

const colors = ["Red", "Green ","Blue"]
const[color1 , color2 , color3] = colors
console.log("Color 1:"+ color1)
console.log("Color 2 : " + color2)
console.log("Color 3 : "+ color3)

//Question 4
function square(num){
    return num * num
}
console.log("Answer is :"+ square(6))

//Question 5
function greetUser(name){
    return name
}
console.log("Hello, " + greetUser("Weijie" + "Welcome to C237"))


//Question 6 

const laptop={
    brand: "HP",
    model:"Spectre",
    year:2023,
    touchscreen:true
}
console.log("Brand"+ laptop.brand)
console.log("Model" + laptop.model)
console.log("Year"+ laptop.year)
console.log("Touchscreen"+ laptop.touchscreen)

//Question 7
//assign new property color with value of silver to my laptop objects 
laptop["color"]="silver"
//print the updated object
console.log(laptop)


//Question 8 :

function printStudentProfile(name , age , course){
    console.log("Student Name : " + name +" | " +"Age :" + age+  "| " + "Course:" + course)
}
printStudentProfile("Weijie", 22 , "C237")