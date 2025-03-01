// const express = require('express');
import express from "express"
import {generateinvoice,consigneeinvoice} from "../Controller/Invoicecontroller.js"
import { authorizeRoles,verifyToken } from '../middleware/authmiddleware.js';


const Invoicerouter = express.Router();

Invoicerouter.post("/generate-invoice/:id",verifyToken,authorizeRoles(["admin" , "manager","user"]), generateinvoice);
Invoicerouter.post("/consignee-invoice/:id" ,verifyToken,authorizeRoles(["admin" , "manager","user"]),consigneeinvoice)

export default Invoicerouter;

