import express from "express";
import { adduser,getuser, getid , updateid } from "../Controller/Addusercontroller.js";
import { authorizeRoles,verifyToken } from '../middleware/authmiddleware.js';

const Adduserrouter = express.Router();

Adduserrouter.post("/adduser",verifyToken,authorizeRoles(["admin" , "manager"]),adduser)

Adduserrouter.get("/getuser",verifyToken,authorizeRoles(["admin" , "manager",]),getuser)

Adduserrouter.get("/:id",getid)

Adduserrouter.put("/:id",updateid)

export default Adduserrouter;