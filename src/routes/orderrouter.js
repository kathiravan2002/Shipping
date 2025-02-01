import express from 'express'
import {createorder,getorder,searchorder,getid,gettodayorder,updateorder,deleteorder, getdelivered, uploadMiddleware, getdispatched, getoutfordelivery} from "../Controller/Ordercontroller.js"
import { authorizeRoles,verifyToken } from '../middleware/authmiddleware.js';

const Orderrouter = express.Router();

Orderrouter.post("/createorder",verifyToken,authorizeRoles(["admin" , "manager"]),createorder)
Orderrouter.get("/getorder",getorder)
Orderrouter.get("/",searchorder)
Orderrouter.get("/:id" ,getid)
Orderrouter.get("/orders/dispatche",getdispatched)
Orderrouter.get("/orders/out",getoutfordelivery)
Orderrouter.get("/orders/delivered",getdelivered)
Orderrouter.get("/orders/today", gettodayorder)
Orderrouter.put("/:id" ,uploadMiddleware,updateorder)
Orderrouter.delete("/:id" ,deleteorder)


export default Orderrouter;

