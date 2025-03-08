import express from "express";
import { consigneeinvoice, generateinvoice } from '../Controller/Invoicecontroller.js';

const Invoicerouter = express.Router();



Invoicerouter.post("/generate-invoice/:id",generateinvoice)
Invoicerouter.post("/consignee-invoice/:id" ,consigneeinvoice)


export default Invoicerouter;