const EventsEmiiter = require("events")
//classess
const events = new EventsEmiiter()
//we waint theis 
//register an evene listern 
events.on("messageloged", ()=>{
    console.log("messgaed")
})

events.emit("messageloged")
//raise an events 
//raise an events 
//logs (messagedloged)



const paths = require("path")
const os = require("os")
console.log(os.version())
console.log(os.userInfo())
const joisn = paths.join("./homesdsd","sdssd","sdsd.txt")
