// https://blog.gtwang.org/programming/socket-io-node-js-realtime-app/
var http = require("http");
var url = require("url");
var fs = require("fs");
// var io = require("socket.io"); // 加入 Socket.IO

console.log("/api/index.js is started!");

//create a server object:
var server = http.createServer(function (req, res) {
  var path = url.parse(req.url).pathname;
  switch (path) {
    case "/":
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write("Hello, World.");
      res.end();
      break;
    case "/socket.html":
      fs.readFile(__dirname + path, function (error, data) {
        if (error) {
          res.writeHead(404);
          res.write("opps this doesn't exist - 404");
        } else {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.write(data, "utf8");
        }
        res.end();
      });
      break;
    default:
      res.writeHead(404);
      res.write("opps this doesn't exist - 404");
      res.end();
      break;
  }

  // res.writeHead(200, { "Content-Type": "text/html" });
  // res.write("Hello World!"); //write a response to the client
  // res.end(); //end the response
});
server.listen(8080); //the server object listens on port 8080
console.log("Server is running on port 8080!");
// const socketIo = new io(server);

const io = require("socket.io")(server);

// io.on("connection", (socket) => {
//   console.log("Socket IO is on connection!");
// });

// io.set("log level", 1); // 關閉 debug 訊息
io.on("connection", (socket) => {
  console.log("Socket IO is on connection!");
  socket.emit("message", { message: "hello world" });
  setInterval(function () {
    socket.emit("date", { date: new Date() });
  }, 1000);

  // 接收來自於瀏覽器的資料
  socket.on("client_data", function (data) {
    process.stdout.write(data.letter);
  });
});
