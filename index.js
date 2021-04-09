// const server = require('http').createServer();
// const options={
//   cors:true,
//   origins:["http://127.0.0.1:5000"],
//  };


const express = require('express');
const app = express();
const server = require('http').createServer(app);
const options={
  cors:true,
  origins:["http://127.0.0.1:5000"],
 };

const io = require('socket.io')(server, options);

// keep track of the calculation log so the clients can get it when they connect
// also need to track it so it can live through the various client sessions
let calculationLog = [];
const MAX_SIZE_OF_CALC_LOG = 10; //set the max size of the calculation log

io.on("connection", (socket) => {
  console.log("New connection");

  // send calculation log when a client connects
  io.emit("calcMessage", calculationLog);

  socket.on("disconnect", () => {
    console.log("User has disconnected");
  });  

  // update calculation log when a new operation is completed and send it to the clients
  socket.on("calcMessage", (msg) => {
    // update the log, new msg at front of the array
    calculationLog = msg.concat(calculationLog);

    //remove last item from the list if the list is too large after adding an item to it
    if (calculationLog.length > MAX_SIZE_OF_CALC_LOG)
      calculationLog.length = MAX_SIZE_OF_CALC_LOG;

    console.log(`${calculationLog}`);

    // send the log to the clients
    io.emit("calcMessage", calculationLog);
  });  
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Listen on *: ${PORT}`));