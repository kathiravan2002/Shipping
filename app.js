import express from "express";
import cors from "cors";
import routes from "./src/routes/index.js";
import bodyParser from 'body-parser';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors({
    origin: ['http://192.168.29.71:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true 
})); 
app.use('/uploads', express.static('uploads'))
app.use("/api" , routes);



export default app;