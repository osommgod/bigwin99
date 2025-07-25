import "dotenv/config";
import path from "path";

import express from "express";
import configViewEngine from "./config/configEngine";
import routes from "./routes/web";
import cronJobContronler from "./controllers/cronJobContronler";
import socketIoController from "./controllers/socketIoController";
let cookieParser = require("cookie-parser");

const app = express();
app.set('trust proxy', true);
const server = require("http").createServer(app);
const io = require("socket.io")(server);

const port = process.env.PORT || 3000;
console.log("Trying to connect to DB at host:", process.env.DATABASE_HOST);

app.use(cookieParser());
app.use(
  "/qr_img",
  express.static(path.join(__dirname, "src", "public", "qr_img"))
);
// app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// setup viewEngine
configViewEngine(app);
// init Web Routes
routes.initWebRouter(app);

// Cron game 1 Phut
cronJobContronler.cronJobGame1p(io);

// Check xem ai connect vào sever
socketIoController.sendMessageAdmin(io);

// app.all('*', (req, res) => {
//     return res.render("404.ejs");
// });

server.listen(port, "127.0.0.1",() => {
  console.log("Connected success port: " + port);
});
