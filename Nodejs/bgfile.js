const fs = require("fs");

const stream = fs.createWriteStream("./helloworldbigfile.txt", { flags: "a" });

for (let i = 0; i <= 1000; i++) {
  stream.write(`helloworld${i}\n`);
}

