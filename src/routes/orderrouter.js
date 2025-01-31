import express from 'express'
import {createorder,getorder,searchorder,getid,gettodayorder,updateorder,deleteorder, uploadMiddleware, getdelivered, getdispatched, getoutfordelivery} from "../Controller/Ordercontroller.js"
import { authorizeRoles,verifyToken } from '../middleware/authmiddleware.js';

const Orderrouter = express.Router();

Orderrouter.post("/createorder" ,createorder)
Orderrouter.get("/getorder" ,getorder)
Orderrouter.get("/",searchorder)
Orderrouter.get("/:id" ,getid)
Orderrouter.get("/orders/dispatche/:region",getdispatched)
Orderrouter.get("/orders/out/:region",getoutfordelivery)
Orderrouter.get("/orders/delivered/:region",getdelivered)
Orderrouter.get("/orders/today", gettodayorder)
Orderrouter.put("/:id" ,uploadMiddleware ,updateorder)
Orderrouter.delete("/:id" ,deleteorder)



export default Orderrouter;

