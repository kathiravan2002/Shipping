import puppeteer from "puppeteer";
import fs from "fs";
import mongoose from "mongoose";
import path from "path";
import order from "../models/orderschema.js"
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
export const generateinvoice = async (req, res) => {
    try {
      const { id } = req.params;
      console.log('Request params:', req.params);
  
      if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({error:"Invlaid order id"});
      }                                                             
      const invoiceorder = await order.findById(id);
  
      if (!invoiceorder) {
        return res.status(404).json({ error: 'Order not found' });
      }
  
      console.log('Invoice order data:', invoiceorder);
  
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
  
      const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Courier Invoice</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 20px;
                    color: #333;
                }
                .invoice {
                    max-width: 800px;
                    margin: auto;
                    border: 1px solid #ddd;
                    padding: 20px;
                    border-radius: 5px;
                }
                header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                header img {
                    max-width: 60px;
                }
                .invoice-no {
                    font-size: 14px;
                    font-weight: bold;
                }
                h1 {
                    text-align: center;
                    font-size: 24px;
                }
                .billing-info {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 20px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                }
                table th, table td {
                    border: 1px solid #ddd;
                    padding: 10px;
                }
                table th {
                    background-color: #f4f4f4;
                }
                table tfoot td {
                    font-weight: bold;
                }
                tbody td {
                        text-align: center;
                    }
            </style>
        </head>
        <body>
            <div class="invoice">
                <header>
                    <img src="https://img.freepik.com/premium-vector/courier-logo-design_139869-1383.jpg" alt="Logo" width="50px" height="50px"> 
                    <div class="invoice-no">Invoice No: ${invoiceorder.invoiceNo}</div>
                </header>
                <h1>Courier Invoice</h1>
                <p><strong>Date:</strong> ${invoiceorder.orderDate}</p>
                <div class="billing-info">
                    <div>
                        <strong>Billed From:</strong><br>
                        ${invoiceorder.ConsignerName}<br>
                        ${invoiceorder.consignermobileNumber}<br>
                        ${invoiceorder.consignerAddress}<br>
                        ${invoiceorder.consignerpincode}
                    </div>
                    <div>
                        <strong>Billed To:</strong><br>
                        ${invoiceorder.Consigneename}<br>
                        ${invoiceorder.consigneemobileno}<br>
                        ${invoiceorder.consigneeaddress}<br>
                        ${invoiceorder.consigneepin}
                    </div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Total weight</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                      <tbody>  <tr>
                         <td>${invoiceorder.productname}</td>
                          <td>${invoiceorder.noofpackage}</td> 
                          <td>${invoiceorder.packageWeight}</td> 
                          <td>${invoiceorder.price}</td> 
                          </tr>
                           </tbody>  
  
                    <tfoot>
                        <tr>
                            <td colspan="3">Total Price</td>
                            <td>${invoiceorder.price}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </body>
        </html> `
        ;
      await page.setContent(htmlContent, { waitUntil: 'load' });
  
      const pdfDir = path.resolve(__dirname, '../invoices');
      const pdfPath = path.join(pdfDir, `invoice_${invoiceorder.orderId}.pdf`);
      
  
      if (!fs.existsSync(pdfDir)) {
        fs.mkdirSync(pdfDir);
      }
  
      await page.pdf({
        path: pdfPath,
        format: 'A4',
        printBackground: true,
      });
  
      await browser.close();
  
      res.download(pdfPath, `invoice_${invoiceorder.orderId}.pdf`, err => {
        if (err) {
          console.error('Error sending file:', err);
          res.status(500).send('Error downloading the file');
        }
      });
    } catch (error) {
      console.error('Error generating invoice:', error);
      res.status(500).json({ error: 'Failed to generate invoice', details: error.message });
    }
  };