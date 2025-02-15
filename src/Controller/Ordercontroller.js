import express from 'express';
import moment from 'moment-timezone';
import Order from '../models/orderschema.js';
import Adduser from '../models/adduserschema.js'
import multer from "multer";
import bwipjs from "bwip-js"


const generateOrderId = () => {
  const timestamp = moment().tz('Asia/Kolkata').format('YYYYMMDDHHmmss'); // Example: 20250121123045
  return `ORD${timestamp}`; // Prefix with "ORD-"
};

const generateInvoiceId = () => {
  const timestamp = moment().tz('Asia/Kolkata').format('YYYYMMDDHHmmss'); // Example: 20250121123045
  return `INV${timestamp}`; // Prefix with "ORD-"
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

      const initialStatus = {
          status: "Order Placed",
          timestamp: new Date(),
          location: req.body.consignercity,
          notes: "Order has been placed successfully"
      };

      const newOrder = new Order({
          ...req.body,
          orderId,
          invoiceNo,
          Orderstatus: "Order Placed",
          statusHistory: [initialStatus]
      });

      const savedOrder = await newOrder.save();
      console.log(savedOrder);
      res.status(201).json(savedOrder);
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
  }
};

export const getorder = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = {};
    let total = 0;
    let orders;

    if (req.params.region === "admin") {
      query = {};
      total = await Order.countDocuments(query);
      orders = await Order.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ orderDate: -1 });
    } else {
      const regionn = await Adduser.findOne({ region: req.params.region });
      
      if (!regionn) {
        return res.status(404).json({ message: "Region not found" });
      }

      query = {
        $or: [
          { currentRegion: regionn.region },
          { consigneeedistrict: regionn.region }
        ]
      };

      total = await Order.countDocuments(query);
      orders = await Order.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ orderDate: -1 });

      if (orders.length === 0) {
        return res.json({
          order: [],
          total: 0,
          page: page,
          totalPages: 0,
          limit: limit
        });
      }
    }

    // Update order region if dispatched
    await Promise.all(
      orders.map(async (order) => {
        if (order.Orderstatus === "Order Dispatched" && 
            order.currentRegion !== order.consigneeedistrict) {
          await Order.updateOne(
            { orderId: order.orderId },
            { 
              $set: { 
                currentRegion: order.currentRegion,
                lastUpdated: new Date()
              }
            }
          );
        }
      })
    );

    // Get the updated orders after modifications
    const updatedOrders = await Order.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ orderDate: -1 });

    return res.status(200).json({
      order: updatedOrders,
      total: total,
      page: page,
      totalPages: Math.ceil(total / limit),
      limit: limit
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ 
      error: err.message,
      message: 'Error retrieving orders'
    });
  }
}; 


export const searchorder = async (req, res) => {
  try {
    const { search } = req.query;


    if (!search) {
      const orders = await Order.find();
      return res.json(orders);
    }


    const searchCondition = {
      $or: [
        { orderId: { $regex: search, $options: "i" } },
        { ConsignerName: { $regex: search, $options: "i" } },
        { consignermobileNumber: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ]
    };

    const orders = await Order.find(searchCondition);


    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}


export const getid = async (req, res) => {
  try {
    const ordered = await Order.findById(req.params.id);
    res.json(ordered);
  } catch (err) {
    console.error(err);
    // res.status(500).json({ error: err.message })
  }
}

export const getdispatched = async (req, res) => {
  try {
    if (req.params.region === "admin") {
     
      const allDispatchedOrders = await Order.find({ Orderstatus: "Order Dispatched" });
      return res.json(allDispatchedOrders);
    }

    const Region = await Adduser.findOne({ region: req.params.region });

    if (!Region) {
      return res.status(404).json({ message: "Region not found" });
    }

    const dispatched = await Order.find({
      consigneeedistrict: Region.region,
      Orderstatus: "Order Dispatched",
    });

    if (dispatched.length === 0) {
      return res.json([]);
    }

    return res.json(dispatched);  
  } catch (error) {
    console.error("Error fetching dispatched orders:", error);
    return res.status(500).json({ error: "An error occurred while fetching dispatched orders" });  
  }
};


export const getoutfordelivery = async (req, res) => {
  try {
    if (req.params.region === "admin") {
     
      const out = await Order.find({  Orderstatus: 'Out for Delivery' });
      return res.json(out);
    }

    const Region = await Adduser.findOne({ region: req.params.region });

    if (!Region) {
      return res.status(404).json({ message: "Region not found" });
    }

    const outs = await Order.find({
      consigneeedistrict: Region.region,
      Orderstatus: 'Out for Delivery' 
    });

    if (outs.length === 0) {
      return res.json([]);
    }

    return res.json(outs);  
  } catch (error) {
    console.error("Error fetching dispatched orders:", error);
    return res.status(500).json({ error: "An error occurred while fetching dispatched orders" });  
  }
};



export const getdelivered = async (req, res) => {
  try {
    if (req.params.region === "admin") {
     
      const deliveredOrders = await Order.find({ Orderstatus: 'Delivered' });
      return res.json(deliveredOrders);
    }

    const Region = await Adduser.findOne({ region: req.params.region });

    if (!Region) {
      return res.status(404).json({ message: "Region not found" });
    }

    const deliveredOrder = await Order.find({
      consigneeedistrict: Region.region,
      Orderstatus: 'Delivered' 
    });

    if (deliveredOrder.length === 0) {
      return res.json([]);
    }

    return res.json(deliveredOrder);  
  } catch (error) {
    console.error("Error fetching dispatched orders:", error);
    return res.status(500).json({ error: "An error occurred while fetching dispatched orders" });  
  }
};



export const gettodayorder = async (req, res) => {
  try {
   
    const today = new Date();
    const startOfDay = new Date(  today.getFullYear(),  today.getMonth(),  today.getDate());
    const endOfDay = new Date(  today.getFullYear(),  today.getMonth(),  today.getDate() + 1)
    // Filter orders for today
    let todaycount;
    if(req.params.region === "admin"){
      todaycount = await Order.countDocuments({
        todayorderDate: { $gte: startOfDay, $lt: endOfDay },
      });
    }
    else{
      const region = await Adduser.findOne({region: req.params.region });
      if(!region){
        return res.status(404).json({message: "Region not found"});
      }
      todaycount =await Order.countDocuments({
        currentRegion:region.region, todayorderDate: { $gte: startOfDay, $lt: endOfDay },

      });

    }
    // const todayOrders = await Order.find({
    //   todayorderDate: { $gte: startOfDay, $lt: endOfDay },
    // });

    return res.status(200).json({today : todaycount});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



export const getmyorder =  async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = {};
    let total = 0;
    let orders;
    if (req.params.region === "admin") {
      query = {};
      total = await Order.countDocuments(query.currentRegion);
      orders = await Order.find(query.currentRegion)
        .skip(skip)
        .limit(limit)
        .sort({ orderDate: -1 });
    }else{
      const Region = await Adduser.findOne({ region: req.params.region });
      
      if (!Region) {
      return res.status(404).json({ message: "Region not found" });
      }

      query = {currentRegion: Region.region}

      total = await Order.countDocuments(query);
      orders = await Order.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ orderDate: -1 });

      if (orders.length === 0) {
        return res.json({
          order: [],
          total: 0,
          page: page,
          totalPages: 0,
          limit: limit
        });
      }

    }

    const updatedOrders = await Order.find(query)
    .skip(skip)
    .limit(limit)
    .sort({ orderDate: -1 });

  return res.status(200).json({
    order: updatedOrders,
    total: total,
    page: page,
    totalPages: Math.ceil(total / limit),
    limit: limit
  });

  } catch (error) {
   return res.status(500).json({ error: 'An error occurred while fetching dispatched orders' });
  }


};


export const getfilter = async (req, res) => {
  try {
      const {
          page = 1,
          limit = 10,
          sortField,
          sortOrder,
          status,
          search,
          filters,
          region
      } = req.query;

      // Base query
      let query = {};
      
      // Always apply region filter for non-admin users
      if (region !== 'admin') {
          const regionUser = await Adduser.findOne({ region: region });
          if (!regionUser) {
              return res.status(404).json({ message: "Region not found" });
          }
          query.$and = [{ 
              $or: [
                  { currentRegion: regionUser.region },
                  { consigneeedistrict: regionUser.region }
              ]
          }];
      }

      // Add search conditions if search exists
      if (search && search.trim()) {
          const searchRegex = { $regex: search, $options: 'i' };
          const searchQuery = {
              $or: [
                  { orderId: searchRegex },
                  { ConsignerName: searchRegex },
                  { Consigneename: searchRegex },
                  { consignermobileNumber: searchRegex },
                  { consignermail: searchRegex },
                  { consigneemobileno: searchRegex },
                  { consignercity: searchRegex },
                  { consigneecity: searchRegex }
              ]
          };

          if (query.$and) {
              query.$and.push(searchQuery);
          } else {
              query = searchQuery;
          }
      }

      // Add status filter if exists
      if (status && status.trim() && status !== ' ') {
          const statusFilter = { Orderstatus: status };
          if (query.$and) {
              query.$and.push(statusFilter);
          } else {
              query.$and = [statusFilter];
          }
      }

      // Process additional filters
      if (filters) {
          try {
              const parsedFilters = JSON.parse(filters);
              const filterConditions = Object.entries(parsedFilters)
                  .filter(([_, filter]) => filter.value && filter.value.trim())
                  .map(([field, filter]) => ({
                      [field]: {
                          $regex: filter.value,
                          $options: 'i'
                      }
                  }));

              if (filterConditions.length > 0) {
                  if (query.$and) {
                      query.$and.push(...filterConditions);
                  } else {
                      query.$and = filterConditions;
                  }
              }
          } catch (error) {
              console.error('Error parsing filters:', error);
          }
      }

      // Sorting
      const sort = {};
      if (sortField) {
          sort[sortField] = sortOrder === 'desc' ? -1 : 1;
      }

      // Pagination
      const pageNumber = parseInt(page);
      const limitNumber = parseInt(limit);
      const skip = (pageNumber - 1) * limitNumber;

      // Execute query with Promise.all
      const [orders, total] = await Promise.all([
          Order.find(query)
              .sort(sort)
              .skip(skip)
              .limit(limitNumber),
          Order.countDocuments(query)
      ]);

      return res.json({
          order: orders,
          total,
          page: pageNumber,
          totalPages: Math.ceil(total / limitNumber),
          limit: limitNumber
      });

  } catch (error) {
      console.error('Filter Error:', error);
      return res.status(500).json({
          message: 'Error processing filter request',
          error: error.message
      });
  }
};



export const getTotalOrders = async (req, res) => {
  try {
    let totalCount;
    
    if (req.params.region === "admin") {
      totalCount = await Order.countDocuments();
    } else {
      const regionn = await Adduser.findOne({ region: req.params.region });
      
      if (!regionn) {
        return res.status(404).json({ message: "Region not found" });
      }

      totalCount = await Order.countDocuments({
        $or: [
          { currentRegion: regionn.region },
          { consigneeedistrict: regionn.region }
        ]
      });
    }

    return res.status(200).json({ total: totalCount });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};






export const getpending =  async (req, res) => {
  try {
    if (req.params.region === "admin") {
     
      const pendingOrders = await Order.find({ Orderstatus: { $ne: "Delivered" } });
      return res.json(pendingOrders);
    }

    const Region = await Adduser.findOne({ region: req.params.region });

    if (!Region) {
      return res.status(404).json({ message: "Region not found" });
    }

    const pendingOrder = await Order.find({
      consigneeedistrict: Region.region,Orderstatus: { $ne: "Delivered" }  //changes
     
    });

    if (pendingOrder.length === 0) {
      return res.join({ message: 'No dispatched orders found' })
    }
   return  res.json(pendingOrder)
  } catch (error) {
   return res.status(500).json({ error: 'An error occurred while fetching dispatched orders' });
  }


}



export const updateorder = async (req, res) => {
  try {
      const imagePath = req.file
          ? `/uploads/${req.file.filename}`
          : req.body.deliveryimage;

      // Create new status history entry if status is changing
      const currentOrder = await Order.findById(req.params.id);
      if (currentOrder && req.body.Orderstatus && currentOrder.Orderstatus !== req.body.Orderstatus) {
          const newStatus = {
              status: req.body.Orderstatus,
              timestamp: new Date(),
              location: req.body.currentRegion || currentOrder.currentRegion,
              notes: req.body.statusNotes || `Order status updated to ${req.body.Orderstatus}`
          };

          // Update the order with new status history
          const updatedOrder = await Order.findByIdAndUpdate(
              req.params.id,
              {
                  ...req.body,
                  deliveryimage: imagePath,
                  $push: { statusHistory: newStatus }
              },
              { new: true }
          );

          if (!updatedOrder) {
              return res.status(404).json({ error: "Order not found" });
          }
          res.json(updatedOrder);
      } else {
          // If no status change, update other fields normally
          const updatedOrder = await Order.findByIdAndUpdate(
              req.params.id,
              { ...req.body, deliveryimage: imagePath },
              { new: true }
          );
          if (!updatedOrder) {
              return res.status(404).json({ error: "Order not found" });
          }
          res.json(updatedOrder);
      }
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
  }
}

export const deleteorder = async (req, res) => {
  try {
    const deleteOrder = await Order.findByIdAndDelete(req.params.id);
    // res.json(deleteOrder);
    res.status(200).json({ deleteOrder: " Deleted successfully" });
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
}





export const uploadMiddleware = upload.single("deliveryimage");
