import express from 'express'
import {createorder,getorder,searchorder,getid,gettodayorder,updateorder,deleteorder} from "../Controller/Ordercontroller.js"
import { authorizeRoles,verifyToken } from '../middleware/authmiddleware.js';

const Orderrouter = express.Router();

Orderrouter.post("/createorder",verifyToken,authorizeRoles(["admin" , "manager"]),createorder)
Orderrouter.get("/getorder",verifyToken,authorizeRoles(["admin" , "manager"]) ,getorder)
Orderrouter.get("/",searchorder)
Orderrouter.get("/:id" ,getid)
Orderrouter.get("/orders/today", gettodayorder)
Orderrouter.put("/:id" ,updateorder)
Orderrouter.delete("/:id" ,deleteorder)


export default Orderrouter;

