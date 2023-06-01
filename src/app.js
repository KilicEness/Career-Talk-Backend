const express = require("express");
const userRouter = require("./routers/user");
const cors = require("cors");
require("./db/mongoose");

const app = express();

app.use(express.json());

// CORS yapılandırması
app.use(cors());

app.use(userRouter);

app.use(
  cors({
    origin: "*", // Tüm kökenlere izin vermek için '*'
    methods: "GET, POST, PUT, DELETE", // İzin verilen HTTP metodları
    allowedHeaders: "Content-Type, Authorization", // İzin verilen başlıklar
  })
);

module.exports = app;
