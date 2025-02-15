import express from 'express'
import {createorder,getorder,searchorder,getid,gettodayorder,updateorder,deleteorder, uploadMiddleware, getdelivered, getdispatched, getoutfordelivery,getfilter,getTotalOrders,getpending,getmyorder} from "../Controller/Ordercontroller.js"
import { authorizeRoles,verifyToken } from '../middleware/authmiddleware.js';


const Orderrouter = express.Router();

Orderrouter.post("/createorder" ,createorder);
Orderrouter.get("/getorder/:region" ,getorder);
Orderrouter.get("/",searchorder);
Orderrouter.get("/orders/filter",getfilter);
Orderrouter.get("/:id" ,getid);
Orderrouter.get("/orders/dispatche/:region",getdispatched);
Orderrouter.get("/orders/out/:region",getoutfordelivery);
Orderrouter.get("/orders/delivered/:region",getdelivered);
Orderrouter.get('/total/:region', getTotalOrders);
Orderrouter.get("/orders/today/:region", gettodayorder);
Orderrouter.put("/:id" ,uploadMiddleware ,updateorder);
Orderrouter.delete("/:id" ,deleteorder);
Orderrouter.get("/pending/:region",getpending);
Orderrouter.get("/myorder/:region",getmyorder);

export default Orderrouter;

