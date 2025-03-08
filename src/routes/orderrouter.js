
import express from "express";
import { createorder, getorder, searchorder, getid, gettodayorder, updateorder ,deleteorder,getdelivered,uploadMiddleware, getoutfordelivery, getfilter, getdispatched, getmyorder, getpending, getTotalOrders, updateConsigneeOrder, getfilterdata, getDispatchedFiltered, getMyOrderFilter} from "../Controller/Ordercontroller.js";
import { authorizeRoles,verifyToken } from '../middleware/authmiddleware.js';

const Orderrouter = express.Router();

Orderrouter.post("/createorder",uploadMiddleware,createorder)

Orderrouter.get("/getorder/:region" ,getorder)

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

Orderrouter.put("/consignee/:cid" ,uploadMiddleware,updateConsigneeOrder)

Orderrouter.delete("/:id" ,deleteorder)

Orderrouter.get("/myorder/:region" ,getmyorder)

Orderrouter.get('/myorders/filter', getMyOrderFilter);

Orderrouter.post("/filter",getfilterdata)

Orderrouter.get("/filter/dispatched/:region",getDispatchedFiltered)

export default Orderrouter;