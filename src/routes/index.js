import express from "express";
const router = express.Router();
 
import Adduserrouter from "./adduserrouter.js";
import Invoicerouter from "./invoicerouter.js";
import Loginrouter from "./loginrouter.js";
import Orderrouter from "./orderrouter.js";
 

router.use("/add",Adduserrouter)
router.use("/invoices",Invoicerouter)
router.use("/login",Loginrouter)
router.use("/order",Orderrouter)
 


export default router;