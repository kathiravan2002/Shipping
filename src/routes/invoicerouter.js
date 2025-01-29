// const express = require('express');
import express from "express"
import {generateinvoice} from "../Controller/Invoicecontroller.js"
// const {generateinvoice} = require("../Controller/Invoicecontroller")


const Invoicerouter = express.Router();

Invoicerouter.post("/generate-invoice/:id", generateinvoice)

export default Invoicerouter;

