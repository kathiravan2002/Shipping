
import express from "express";
import { createorder, getorder, searchorder, getone, getOrdersToday, updateorder, deleteorder,getdelivered,uploadMiddleware} from "../Controller/Ordercontroller.js";

const Orderrouter = express.Router();

Orderrouter.post("/createorder",createorder)

Orderrouter.get("/getorder" ,getorder)

Orderrouter.get("/",searchorder)

Orderrouter.get("/:id" ,getone)

Orderrouter.get("/orders/delivered",getdelivered)

Orderrouter.get("/orders/today", getOrdersToday)

Orderrouter.put("/:id" ,uploadMiddleware,updateorder)

Orderrouter.delete("/:id" ,deleteorder)


export default Orderrouter;