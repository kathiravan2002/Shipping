
// import multer from "multer";
// import path from "path";
// import fs from "fs";
// import uploads from "../models/Deliveredschema.js";
// import Order from "../models/orderschema.js";




// // const uploadsDir = path.join(__dirname, "../../uploads");
// // fs.mkdirSync(uploadsDir, { recursive: true });
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads");
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });


// const upload = multer({ storage: storage});


// export const uploadMiddleware = upload.single("image");

// export const imageupload = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded." });
//     }
//     // const { orderId } = req.body;

//     const orders = await Order.findById(req.params.id);
//     const imagePath = path.join('/uploads', req.file.filename);
//     console.log(imagePath)
//     const img = new uploads({
//       orderId: orders,
//       image: imagePath, 
//     });

//     await img.save();
//     res.status(200).json({ message: "Image uploaded!", filePath: imagePath });
//   } catch (err) {
//     console.error("Error uploading image:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// export const imageget= async (req, res) =>{
//   try {
//     const images = await uploads.find();
//     res.json(images);
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// };
 
import multer from "multer";
import path from "path";
import uploads from "../models/Deliveredschema.js";
import Order from "../models/orderschema.js";



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

export const uploadMiddleware = upload.single("image");

export const imageupload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }


    const imagePath = path.join('/uploads', req.file.filename);
    console.log(imagePath);


    const img = new uploads({
      orderId: order._id, 
      image: imagePath,
    });

    await img.save();
    res.status(200).json({ message: "Image uploaded!", filePath: imagePath });
  } catch (err) {
    console.error("Error uploading image:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const imageget = async (req, res) => {
  try {
    const images = await uploads.findById(req.params.id);
    res.json(images);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// import multer from 'multer';
// import path from 'path';
// import fs from 'fs';
// import uploads from '../models/Deliveredschema.js';
// import Order from '../models/orderschema.js';

// // Multer storage configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadPath = path.join(__dirname, '../../uploads');
//     // Ensure the 'uploads' directory exists
//     if (!fs.existsSync(uploadPath)) {
//       fs.mkdirSync(uploadPath, { recursive: true });
//     }
//     cb(null, uploadPath);  // Save files to the 'uploads' folder
//   },
//   filename: (req, file, cb) => {
//     const filename = Date.now() + path.extname(file.originalname);
//     cb(null, filename);
//   }
// });

// const upload = multer({ storage: storage });

// // Image upload route
// export const uploadMiddleware = upload.single('image');
// export const imageupload = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: 'No file uploaded.' });
//     }

//     // Find the order using the provided orderId
//     const order = await Order.findById(req.params.id);
//     if (!order) {
//       return res.status(404).json({ message: 'Order not found.' });
//     }

//     // Image path to save in the database
//     const imagePath = path.join('/uploads', req.file.filename);

//     // Create a new upload document in DB
//     const img = new uploads({
//       orderId: order._id,
//       image: imagePath,
//     });

//     await img.save();
//     res.status(200).json({ message: 'Image uploaded!', filePath: imagePath });

//   } catch (err) {
//     console.error('Error uploading image:', err);
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// };

// export const imageget = async (req, res) => {
//   try {
//     const images = await uploads.find(); // Fetch all images from the database
//     res.json(images); // Send images as JSON response
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// };

