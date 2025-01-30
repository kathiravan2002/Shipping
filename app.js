import express from "express";
import cors from "cors";
const app = express();
import routes from "./src/routes/index.js";
// const bodyParser = require('body-parser');
import bodyParser from 'body-parser'
app.use(express.json())
app.use(bodyParser.json());
app.use(express.urlencoded({extended:true}))
app.use(cors({
    origin: ['http://192.168.29.11:5173' , 'http://localhost:5173' ,'http://192.168.29.11:5174','http://192.168.29.71:5173'] ,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true 
}));
app.use('/uploads', express.static('uploads'))
app.use("/api" , routes);

export default app;