import app from "./app.js";
import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();
const port = process.env.port;
const dbconnectionstring = process.env.DB_CONN_STRING


mongoose.connect(dbconnectionstring)
    .then(res => console.log("MongoDB connected successfully"))
    .catch(err => console.log(err))
mongoose.connect(dbconnectionstring, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
app.listen(port, () => console.log("application running successfully on port :" + port)) 