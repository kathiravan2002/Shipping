import puppeteer from "puppeteer";
import fs from "fs";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url"; // Import to handle __dirname
import Order from "../models/orderschema.js";
import bwipjs from 'bwip-js';
import Ordermaster from "../models/ordermaster.js";

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateinvoice = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Request params:', req.params);

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid order ID" });
        }

        const invoiceorder = await Order.findById(id);
        if (!invoiceorder) {
            return res.status(404).json({ error: 'Order not found' });
        }

        console.log('Invoice order data:', invoiceorder);


        let consigneedetails = [];
        if (invoiceorder.orderId) {
            consigneedetails = await Ordermaster.find({
                Coorderid: invoiceorder.orderId
            });
        }

        if (!consigneedetails.length) {
            console.log('No consignee details found for order:', invoiceorder.orderId);
        }

        // Generate barcode
        const barcodeData = `ID:${invoiceorder.orderId}`;
        const barcodeBuffer = await new Promise((resolve, reject) => {
            bwipjs.toBuffer(
                {
                    bcid: 'code128',
                    text: barcodeData,
                    scale: 5,
                    height: 50,
                    width: 200,
                    textxalign: 'center',
                    textsize: 15
                },
                (err, png) => {
                    if (err) reject(err);
                    else resolve(png);
                }
            );
        });
        const barcodeBase64 = `data:image/png;base64,${barcodeBuffer.toString('base64')}`;

        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        // Modified HTML to handle multiple consignee details
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
        .top-section {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 20px;
        }
        .logo {
            width: 60px;
            height: 60px;
        }
        .invoice-details {
            text-align: right;
        }
        .invoice-no {
            font-size: 14px;
            margin-bottom: 10px;
        }
        .barcode-container {
            margin-top: 5px;
        }
        .barcode-container img {
            width: 200px;
            height: 50px;
        }
        .barcode-container p {
            margin-right: 30px;
        }
        h1 {
            text-align: center;
            font-size: 24px;
            margin: 20px 0;
        }
        .billing-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
        }
        .billing-info > div {
            flex: 1;
            padding: 10px;
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
        <div class="top-section">
            <img class="logo" src="https://img.freepik.com/premium-vector/courier-logo-design_139869-1383.jpg" alt="Logo">
            <div class="invoice-details">
                <div class="invoice-no">Invoice No: ${invoiceorder.invoiceNo}</div>
                <div class="barcode-container">
                    <img src="${barcodeBase64}" alt="barcode">
                    <p>${invoiceorder.orderId}</p>
                </div>
            </div>
        </div>
        <h1>Courier Invoice</h1>
        <p><strong>Date:</strong> ${invoiceorder.orderDate}</p>
        <div class="billing-info">
        <div>
        <table>
            <thead>
            
               <tr> <th><strong>Billed From:</strong></th></tr>
               </thead>
               <tbody><td>
                ${invoiceorder.ConsignerName}<br>
                ${invoiceorder.consignermobileNumber}<br>
                ${invoiceorder.consignerAddress}<br>
                ${invoiceorder.consignerpincode}</td>
                </tbody>
            
            </table>
            </div>
            <div>
            <table>
            <thead>
                <tr> <th><strong>Billed To:</strong></th></tr>
            </thead>
            <tbody>
                ${consigneedetails.length > 0 ? consigneedetails.map((detail) => `
                    <tr>
                        <td>
                           
                          <strong>consignee id :</strong>${detail.cid}<br>
                            ${detail.Consigneename}<br>
                            ${detail.consigneemobileno}<br>
                            ${detail.consigneeaddress}<br>
                            ${detail.consigneepin}
                        </td>
                    </tr>
                `).join('') : '<tr><td>No consignee details available</td></tr>'}
            </tbody>
        </table>
            </div>
        </div>
        <table>
            <thead>
                <tr>
                    <th>consignee Id</th>
                    <th>Package Type</th>
                    <th>Quantity</th>
                    <th>Total weight</th>
                    <th>Price</th>
                </tr>
            </thead>
            <tbody>
                ${consigneedetails.length > 0
                ? consigneedetails.map((detail) => `
                            
                            <tr>
                                <td> ${detail.cid} </td>
                                <td>${detail.ptype || 'N/A'}</td>
                                <td>${detail.packages || '0'}</td>
                                <td>${detail.totalWeight || '0'}</td>
                                <td>${detail.cprice || '0'}</td>
                            </tr>
                        `).join('')
                : '<tr><td colspan="4">No package details available</td></tr>'
            }
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="4">Total Price</td>
                    <td>${consigneedetails.length > 0
                ? consigneedetails.reduce((sum, detail) => sum + (parseFloat(detail.cprice) || 0), 0)
                : '0'
            }</td>
                </tr>
            </tfoot>
        </table>
    </div>
</body>
</html>`;

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


export const consigneeinvoice = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Request params:', req.params);

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid order ID" });
        }


        const invoiceorder = await Ordermaster.findById(id);

        if (!invoiceorder) {
            return res.status(404).json({ error: 'Order not found' });
        }

        console.log('Invoice order data:', invoiceorder);


        let orderDetails = null;
        if (invoiceorder.Coorderid) {
            orderDetails = await Order.findOne({ orderId: invoiceorder.Coorderid });
        }


        const barcodeData = `ID:${invoiceorder.cid || 'undefined'}`;

        const barcodeBuffer = await new Promise((resolve, reject) => {
            bwipjs.toBuffer(
                {
                    bcid: 'code128',
                    text: barcodeData,
                    scale: 5,
                    height: 50,
                    width: 200,
                    textxalign: 'center',
                    textsize: 15
                },
                (err, png) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(png);
                    }
                }
            );
        });

        const barcodeBase64 = `data:image/png;base64,${barcodeBuffer.toString('base64')}`;

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
                  .top-section {
                      display: flex;
                      justify-content: space-between;
                      align-items: flex-start;
                      margin-bottom: 20px;
                  }
                  .logo {
                      width: 60px;
                      height: 60px;
                  }
                  .invoice-details {
                      text-align: right;
                  }
                  .invoice-no {
                      font-size: 14px;
                      margin-bottom: 10px;
                  }
                  .barcode-container {
                      margin-top: 5px;
                  }
                  .barcode-container img {
                      width: 200px;
                      height: 50px;
                  }
                  .barcode-container p {
                      margin-right: 30px;
                  }
                  h1 {
                      text-align: center;
                      font-size: 24px;
                      margin: 20px 0;
                  }
                  .billing-info {
                      display: flex;
                      justify-content: space-between;
                      margin-bottom: 20px;
                  }
                  .billing-info > div {
                      flex: 1;
                      padding: 10px;
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
                  <div class="top-section">
                      <img class="logo" src="https://img.freepik.com/premium-vector/courier-logo-design_139869-1383.jpg" alt="Logo">
                      <div class="invoice-details">
                          <div class="invoice-no">Invoice No: ${orderDetails.invoiceNo || 'undefined'}</div>
                          <div class="barcode-container">
                              <img src="${barcodeBase64}" alt="barcode">
                             <p> ${invoiceorder.cid || 'undefined'}</p>
                          </div>
                      </div>
                  </div>
                  <h1>Courier Invoice</h1>
                  <p><strong>Date:</strong> ${orderDetails.orderDate || 'undefined'}</p>
                  <div class="billing-info">
                      <div>
                          <strong>Billed From:</strong><br>
                          ${orderDetails.ConsignerName}<br>
                          ${orderDetails.consignermobileNumber}<br>
                          ${orderDetails.consignerAddress}<br>
                          ${orderDetails.consignerpincode}
                      </div>
                      <div>
                          <strong>Billed To:</strong><br>
                          ${invoiceorder.Consigneename || 'undefined'}<br>
                          ${invoiceorder.consigneemobileno || 'undefined'}<br>
                          ${invoiceorder.consigneeedistrict || 'undefined'}<br>
                          ${invoiceorder.consigneepin || 'undefined'}<br>
                      </div>
                  </div>
                  <table>
                      <thead>
                          <tr>
                              <th>Package Type</th>
                              <th>Quantity</th>
                              <th>Total weight</th>
                              <th>Price</th>
                          </tr>
                      </thead>
                      <tbody>
                          <tr>
                              <td>${invoiceorder.ptype || 'undefined'}</td>
                              <td>${invoiceorder.packages || 'undefined'}</td>
                              <td>${invoiceorder.totalWeight || 'undefined'}</td>
                              <td>${invoiceorder.cprice || 'undefined'}</td>
                          </tr>
                      </tbody>
                      <tfoot>
                          <tr>
                              <td colspan="3">Total Price</td>
                              <td>${invoiceorder.cprice || 'undefined'}</td>
                          </tr>
                      </tfoot>
                  </table>
              </div>
          </body>
          </html>`;

        await page.setContent(htmlContent, { waitUntil: 'load' });

        const pdfDir = path.resolve(__dirname, '../invoices');
        const pdfPath = path.join(pdfDir, `invoice_${invoiceorder.cid || 'unknown'}.pdf`);

        if (!fs.existsSync(pdfDir)) {
            fs.mkdirSync(pdfDir);
        }

        await page.pdf({
            path: pdfPath,
            format: 'A5',
            printBackground: true,
        });

        await browser.close();

        res.download(pdfPath, `invoice_${invoiceorder.cid || 'unknown'}.pdf`, err => {
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