const express = require("express");
const cors = require("cors");
const app = express();
const productRoutes = require("./routes/productrouter");
const customerRoutes = require("./routes/Customerrouter");
const orderRoutes =  require("./routes/Orderrouter");
const paymentRoutes = require("./routes/Paymentrouter");
const statusRoutes = require("./routes/Statusrouter")
const pickupaddressRoutes = require("./routes/Pickupaddressrouter")

const mongoose = require("mongoose");
require("dotenv").config();

app.use(express.json())
app.get("/", (req, res) => {
    res.json("hello world")
});

app.use(cors({
    origin: ['http://192.168.29.11:5173' , 'http://localhost:5173' ,'http://192.168.29.11:5174','http://192.168.29.71:5173'] ,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true 
}));
//http://localhost:5000/api/product -post
//http://localhost:5000/api/product -get
//http://localhost:5000/api/product/1 -getone 
//http://localhost:5000/api/product -put
//http://localhost:5000/api/product/1-delete
//http://localhost:5000/api/product -getall
//http://localhost:5000/api/customer -post
//http://localhost:5000/api/customer -get
//http://localhost:5000/api/customer/1 -getone 
//http://localhost:5000/api/customer -put
//http://localhost:5000/api/customer/1-delete
//http://localhost:5000/api/customer -getall
app.use("/api/product", productRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/order" , orderRoutes);
app.use("/api/payment" , paymentRoutes);
app.use("/api/status" , statusRoutes);
app.use("/api/address" , pickupaddressRoutes);
const port = process.env.port;

const dbconnectionstring = process.env.DB_CONN_STRING
mongoose.connect(dbconnectionstring)
    .then(res => console.log("MongoDB connected successfully"))
    .catch(err => console.log(err))


app.listen(port, () => console.log("application running successfully on port :" + port)) 