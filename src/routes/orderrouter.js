
import express from "express";
import { createorder, getorder, searchorder, getid, gettodayorder, updateorder, deleteorder,getdelivered,uploadMiddleware, getoutfordelivery} from "../Controller/Ordercontroller.js";

const Orderrouter = express.Router();

Orderrouter.post("/createorder",createorder)

Orderrouter.get("/getorder" ,getorder)

Orderrouter.get("/",searchorder)

Orderrouter.get("/:id" ,getid)

Orderrouter.get("/orders/out" ,getoutfordelivery)

Orderrouter.get("/orders/delivered",getdelivered)

Orderrouter.get("/orders/today", gettodayorder)

Orderrouter.put("/:id" ,uploadMiddleware,updateorder)

Orderrouter.delete("/:id" ,deleteorder)


export default Orderrouter;