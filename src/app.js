
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());

//  FINAL CORS FIX
app.use(cors({
    origin: true,   // sab localhost ports allow
    credentials: true
}));

app.use(cookieParser());

module.exports = app;
