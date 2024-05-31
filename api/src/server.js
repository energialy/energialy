const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const routes = require("./routes/index.js");
const { BASE_URL } = process.env;
const http = require("http");
const {Server: socketIo} = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new socketIo(server, {
  cors: {
    origin: "*",
  },
});
const userSockets = [];

io.on("connection", (socket) => {
  console.log("New user connected" + socket.id);

  socket.on("authenticate", (data) => {
    const { companyId } = data;

    if (companyId) {
      userSockets[companyId] = socket.id;
      console.log(`User ${companyId} connected with socket ID: ${socket.id}`);
      console.log(userSockets);
    } else {
      console.log("Authentication failed");
      socket.disconnect();
    }
  });

  socket.on("sendMessage", (messageSended) => {
    const { _message, _sender, _receiver } = messageSended;
    console.log("receicer",_receiver,userSockets[_receiver])
    userSockets[_receiver] ? io.to(userSockets[_receiver]).emit("message", messageSended) : null;
  });

  socket.on("disconnect", () => {
    console.log("User disconnected socket:" + socket.id);
  });
});

app.name = "API";

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use((req, res, next) => {
  // res.header('Access-Control-Allow-Origin', BASE_URL);

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

app.use("/", routes);

app.get("/", (req, res) => {
  res.send("Energialy API");
});

// Error catching endware.
app.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

module.exports = { app, server, io };
