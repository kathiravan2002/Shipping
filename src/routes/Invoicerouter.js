import express from "express";
import { generateinvoice } from '../Controller/Invoicecontroller.js';

const Invoicerouter = express.Router();



Invoicerouter.post("/generate-invoice/:id",generateinvoice)


export default Invoicerouter;