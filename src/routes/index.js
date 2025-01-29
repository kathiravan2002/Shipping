import express from "express";
import Orderrouter from "./Orderrouter.js";
import Invoicerouter from "./Invoicerouter.js";
import Loginrouter from "./loginrouter.js";
import Adduserrouter from "./adduserrouter.js";


const router = express.Router();




router.use("/order",Orderrouter)
router.use("/invoice",Invoicerouter)
router.use("/login",Loginrouter)
router.use("/add",Adduserrouter)


export default router;              
