const os = require("os")
console.log(os.version())
const path = require("path")
console.log(path.join("/helloworld", "hdhsdsd","hssdsd.text"))
const {readFileSync, writeFileSync}= require("fs")
const first =readFileSync("./hi.txt", "utf8")

writeFileSync(
    "./hello.txt",
    `hellowordl ${first}`
)