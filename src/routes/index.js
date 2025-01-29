import express from "express";
import Orderrouter from "./Orderrouter.js";
import Invoicerouter from "./Invoicerouter.js";



const router = express.Router();




router.use("/order",Orderrouter)
router.use("/invoice",Invoicerouter)


export default router;              