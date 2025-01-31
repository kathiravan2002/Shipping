import express from 'express';
import moment from 'moment-timezone';
import Order from '../models/orderschema.js';
import multer from "multer";
import path from "path";

const generateOrderId = () => {
    // Get the current timestamp in a specific timezone
    const timestamp = moment().tz('Asia/Kolkata').format('YYYYMMDDHHmmss'); // Example: 20250121123045
    // const randomString = Math.random().toString(36).substring(2, 8); // Generate random base-36 string
    return `ORD-${timestamp}`; // Prefix with "ORD-"
};

const generateInvoiceId = () => {
    // Get the current timestamp in a specific timezone
    const timestamp = moment().tz('Asia/Kolkata').format('YYYYMMDDHHmmss'); // Example: 20250121123045
    // const randomString = Math.random().toString(36).substring(2, 8); // Generate random base-36 string
    return `INV-${timestamp}`; // Prefix with "ORD-"
};
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/"); // Save files in "uploads" directory
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });


  const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
   
  });


export const createorder = async (req, res) => {
    try {
      console.log("REQ BODY:", req.body);
  
      const orderId = generateOrderId();
      const invoiceNo = generateInvoiceId();
  
      console.log(`Order ID: ${orderId}, Invoice No: ${invoiceNo}`);
  
  
      const newOrder = new Order({
        ...req.body,
        orderId,
        invoiceNo,
       
      });
  
      const savedOrder = await newOrder.save();
      console.log(savedOrder);
      res.status(201).json(savedOrder);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  };
  
  // Fetch all orders
  export const getorder = async (req, res) => {
    try {
      const orders = await Order.find();
      res.status(200).json(orders);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  };
  
export const searchorder = async (req, res) => {
    try {
        const { search } = req.query;

        // If search query is empty, return all orders
        if (!search) {
            const orders = await Order.find();
            return res.json(orders);
        }

        // Build a search condition for multiple fields
        const searchCondition = {
            $or: [
                { orderId: { $regex: search, $options: "i" } },
                { ConsignerName: { $regex: search, $options: "i" } }, // Example of field to search for
                { consignermobileNumber: { $regex: search, $options: "i" } }, // Another example field
                { email: { $regex: search, $options: "i" } }, // Example field
               
            ]
        };

        const orders = await Order.find(searchCondition); // Search the orders collection

        // Send the result as a JSON response
        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}


export const getid = async (req ,res) => {
    try{
        const ordered = await Order.findById(req.params.id);
        res.json(ordered);
    }catch (err) {
        console.error(err);
        // res.status(500).json({ error: err.message })
    }
}


export const getdispatched=async (req,res) =>{
  try{

   const dispatched = await Order.find({consigneedistrict :'Kallakurichi',Orderstatus:'Ordered Dispatched' });

   if(dispatched.length === 0){
     res.join({message: 'No dispatched orders found'})
   }
   res.json(dispatched)
  }catch(error){
   res.status(500).json({ error: 'An error occurred while fetching dispatched orders' });
  }


}

export const getoutfordelivery=async(req,res) => {

  const out = await Order.find({consigneedistrict :['Kallakurichi','Salem'],Orderstatus:'Out for Delivery'});
  res.json(out)

}


export const getdelivered = async (req, res) => {
    try {
      // Fetch all orders with "Delivered" status
      const deliveredOrders = await Order.find({ Orderstatus: 'Delivered' });
  
      if (deliveredOrders.length === 0) {
         res.json({ message: 'No delivered orders found' });
      }
  
       res.json(deliveredOrders);
    } catch (err) {
      console.error('Error fetching delivered orders:', err);
        res.status(500).json({ error: 'An error occurred while fetching delivered orders' });
    }
  };
   
  


export const gettodayorder = async (req, res) => {
    try {
      // Get the start and end of today
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  
      // Filter orders for today
      const todayOrders = await Order.find({
        orderDate: { $gte: startOfDay, $lt: endOfDay },
      });
  
      res.json(todayOrders);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }


  export const  updateorder = async (req, res) => {
    try {
      const imagePath = req.file ? `/uploads/${req.file.filename}` : req.body.deliveryimage; // Keep old image if not updated
  
      const updatedOrder = await Order.findByIdAndUpdate(
        req.params.id,
        { ...req.body, deliveryimage: imagePath }, // Include image update
        { new: true }
      );
  
      if (!updatedOrder) {
        return res.status(404).json({ error: "Order not found" });
      }
  
      res.json(updatedOrder);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  };
  
export const deleteorder= async (req ,res) => {
    try{
        const deleteOrder = await Order.findByIdAndDelete(req.params.id);
        // res.json(deleteOrder);
       res.status(200).json({deleteOrder : " Deleted successfully"});
    }catch(err){
        console.error(err)
       res.status(500).json({ error: err.message})
    }
}


export const uploadMiddleware = upload.single("deliveryimage");
