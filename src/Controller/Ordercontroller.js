import express from "express";
import moment from "moment-timezone";
import Order from "../models/orderschema.js";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Adduser from "../models/adduserschema.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generateOrderId = () => {
  const timestamp = moment().tz("Asia/Kolkata").format("YYYYMMDDHHmmss");
  return `ORD-${timestamp}`;
};

const generateInvoiceId = () => {
  const timestamp = moment().tz("Asia/Kolkata").format("YYYYMMDDHHmmss");
  return `INV-${timestamp}`;
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

export const updateorder = async (req, res) => {
  try {
    const imagePath = req.file
      ? `/uploads/${req.file.filename}`
      : req.body.deliveryimage; // Keep old image if not updated

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
      ],
    };

    const orders = await Order.find(searchCondition); // Search the orders collection

    // Send the result as a JSON response
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getid = async (req, res) => {
  try {
    const ordered = await Order.findById(req.params.id);
    res.json(ordered);
  } catch (err) {
    console.error(err);
    // res.status(500).json({ error: err.message })
  }
};

export const gettodayorder = async (req, res) => {
  try {
    // Get the start and end of today
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );

    // Filter orders for today
    const todayOrders = await Order.find({
      orderDate: { $gte: startOfDay, $lt: endOfDay },
    });

    res.json(todayOrders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteorder = async (req, res) => {
  try {
    const deleteOrder = await Order.findByIdAndDelete(req.params.id);
    // res.json(deleteOrder);
    res.status(200).json({ deleteOrder: " Deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const getdispatched = async (req, res) => {
  try {
    const Region = await Adduser.findOne({ region: req.params.region });
    if (!Region) {
      return res.status(404).json({ message: "Region not found" });
    }
    const dispatched = await Order.find({
      consigneedistrict: Region.region,
      Orderstatus: "Ordered Dispatched",
    });

    if (dispatched.length === 0) {
      res.json({ message: "No dispatched orders found" });
    }
    res.json(dispatched);
  } catch (error) {
    
    res.status(500)
    res.json({ error: "An error occurred while fetching dispatched orders" });
  }
};

export const getoutfordelivery = async (req, res) => {
  try{ 
    const Outregion = await Adduser.findOne({region: req.params.region})
    if(!Outregion){
      return res.status(404).json({ message: "Region not found" });
    }
    const out = await Order.find({
    consigneedistrict: Outregion.region,
    Orderstatus: "Out for Delivery",
   });
   if (out.length === 0) {
    res.json({ message: "No Out for deliver orders found" });
  }

   res.json(out);
} catch(error){
  
  res.status(500)
  res.json({ error: "An error occurred while fetching Out for delivery orders" });

}
};

export const getdelivered = async (req, res) => {
  try {
    const deliverregion = await Adduser.findOne({region: req.params.region})
    if(!deliverregion){
      return res.status(404).json({ message: "Region not found" });
    }
    const deliveredOrders = await Order.find({ consigneedistrict: deliverregion.region, Orderstatus: "Delivered" });
    if(deliveredOrders === 0){
      res.json({ message: "No deliver orders found" });
    }

    res.json(deliveredOrders);
  } catch (err) {
    
    res.status(500).json({ error: "An error occurred while fetching delivered orders" });
  }
};

export const uploadMiddleware = upload.single("deliveryimage");

// export const updateorder = async (req, res) => {
//   try {
//     console.log("Update Order", req.body);
//     const uploadDir = path.join(__dirname, "../../uploads");

//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir, { recursive: true });
//     }

//     // Improved image path handling
//     let imagePath;
//     if (req.file) {
//       // New file uploaded
//       imagePath = `/uploads/${req.file.filename}`;
//     } else if (req.body.deliveryimage && typeof req.body.deliveryimage === 'string') {
//       // Existing image path provided
//       imagePath = req.body.deliveryimage;
//     } else {
//       // No image provided or invalid image data
//       imagePath = null; // or "" depending on your schema requirements
//     }

//     const updatedOrder = await Order.findByIdAndUpdate(
//       req.params.id,
//       {
//         ...req.body,
//         deliveryimage: imagePath
//       },
//       { new: true }
//     );

//     if (!updatedOrder) {
//       return res.status(404).json({ error: "Order not found" });
//     }

//     res.json(updatedOrder);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// };
