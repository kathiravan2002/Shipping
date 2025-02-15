import express from "express";

import Adduserrouter from "./adduserrouter.js";
import Invoicerouter from "./invoicerouter.js";
import Loginrouter from "./loginrouter.js";
import Orderrouter from "./orderrouter.js";
import Trackrouter from "./trackrouter.js";
 
const router = express.Router();
 
router.use("/add",Adduserrouter)
router.use("/invoices",Invoicerouter)
router.use("/login",Loginrouter)
router.use("/order",Orderrouter)
router.use("/order",Trackrouter)
 


export default router;