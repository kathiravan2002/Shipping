import express from "express";
import mongoose from "mongoose";
import app from "./app.js";
import dotenv from "dotenv";
dotenv.config();

const port = process.env.port;

const dbconnectionstring = process.env.DB_CONN_STRING
mongoose.connect(dbconnectionstring)
    .then(res => console.log("MongoDB connected successfully"))
    .catch(err => console.log(err))


app.listen(port, () => console.log("application running successfully on port :" + port)) 
