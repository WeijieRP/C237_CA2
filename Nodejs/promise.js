const { readFile, writeFile } = require("fs");

const getText = (pathName) => {
    return new Promise((resolve, reject) => {
        readFile(pathName, "utf8", (error, data) => {
            if (error) {
                reject(error);
            } else {
                resolve(data);
            }
        });
    });
};

// Using async/await properly
const start = async () => {
    try {
        const first = await getText("./helloworld.txt");
        console.log(first);
    } catch (error) {
        console.log(error);
    }
};
fetch().then(()=>{}).catch(()=>{})
//promise when fecthig daaat a, rewir ejansjkjasnk

start(); // Call the async function to execute

// OR you can use .then() style like this:
getText("./helloworld.txt")
    .then((data) => {
        console.log(data);
    })
    .catch((error) => {
        console.log(error);
    });
