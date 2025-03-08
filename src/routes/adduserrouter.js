import express from "express";
import { adduser,getuser, getid , updateid, getusername, getFilterOptions } from "../Controller/Addusercontroller.js";
import { authorizeRoles,verifyToken } from '../middleware/authmiddleware.js';

const Adduserrouter = express.Router();

Adduserrouter.post("/adduser",verifyToken,authorizeRoles(["admin" , "manager"]),adduser)

Adduserrouter.get("/getuser",verifyToken,authorizeRoles(["admin" , "manager",]),getuser)

Adduserrouter.get("/login/getname",verifyToken, authorizeRoles(["admin", "manager","user","subdistributor","deliveryman"]), getusername);

Adduserrouter.get("/:id",getid)

Adduserrouter.put("/:id",updateid)

Adduserrouter.get("/get/filter", getFilterOptions);

export default Adduserrouter;