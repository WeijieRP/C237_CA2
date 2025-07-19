const http = require("http");
const url = require("url");
const fs = require("fs");

const routeHandlers = {
  "/": homeHandler,
  "/about": aboutHandler,
  "/contact":contactHandler,
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const handler = routeHandlers[path] || notFoundHandler;
  handler(req, res);
});

function contactHandler(req ,res){
  res.writeHead(200 , {"Content-Type":"text/html"})
  fs.createReadStream("Contact.html").pipe(res)
}
function homeHandler(req, res) {
  res.writeHead(200, { "Content-Type": "text/html" });
  fs.createReadStream("index.html").pipe(res);
}

function aboutHandler(req, res) {
  res.writeHead(200, { "Content-Type": "text/html" });
  fs.createReadStream("about.html").pipe(res);
}

function notFoundHandler(req, res) {
  res.writeHead(404, { "Content-Type": "text/html" });
  res.end("Not Found");
}

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});