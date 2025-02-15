
import express from "express";
import { createorder, getorder, searchorder, getid, gettodayorder, updateorder, deleteorder,getdelivered,uploadMiddleware, getoutfordelivery, getfilter, getdispatched, getmyorder, getpending, getTotalOrders} from "../Controller/Ordercontroller.js";
import { authorizeRoles,verifyToken } from '../middleware/authmiddleware.js';
import Order from "../models/orderschema.js";

const Orderrouter = express.Router();

Orderrouter.post("/createorder",verifyToken,authorizeRoles(["admin" , "manager",]),createorder)

Orderrouter.get("/getorder/:region" ,verifyToken,authorizeRoles(["admin" , "manager",]),getorder)

Orderrouter.get("/",searchorder)

Orderrouter.get("/:id" ,getid)

Orderrouter.get("/orders/dispatche/:region" ,getdispatched)

Orderrouter.get("/orders/out/:region" ,getoutfordelivery)

Orderrouter.get("/orders/delivered/:region",getdelivered)

Orderrouter.get("/total/:region" ,getTotalOrders)

Orderrouter.get("/orders/today/:region", gettodayorder)

Orderrouter.get("/orders/filter", getfilter)

Orderrouter.get("/pending/:region", getpending)

Orderrouter.put("/:id" ,uploadMiddleware,updateorder)

Orderrouter.delete("/:id" ,deleteorder)

Orderrouter.get("/myorder/:region" ,getmyorder)


export default Orderrouter;