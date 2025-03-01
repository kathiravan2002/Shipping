import mongoose from "mongoose";
import moment from "moment-timezone";
import Order from "../models/orderschema.js";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Adduser from "../models/adduserschema.js";
import Ordermaster from "../models/ordermaster.js"


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generateOrderId = () => {
  const timestamp = moment().tz("Asia/Kolkata").format("YYYYMMDDHHmmss");
  return `ORD${timestamp}`;
};

let orderCounter = 0;
const generatecid = () => {
  const timestamp = moment().tz("Asia/Kolkata").format("MMDDHHmmss");
  const paddedCounter = orderCounter.toString().padStart(2,0); 
  orderCounter += 1; 
  return `CID${timestamp}${paddedCounter}`; 
};  

const generateInvoiceId = () => {
  const timestamp = moment().tz("Asia/Kolkata").format("YYYYMMDDHHmmss");
  return `INV${timestamp}`;
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  
  if (extname && mimetype) {
    return cb(null, true);
  }
  cb(new Error('Only images are allowed (jpeg, jpg, png)'));
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
}).any(); // Accept all fields

export const createorder = async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);
    console.log("REQ FILES:", req.files);

    let corders = req.body.corders || [];
    if (typeof corders === 'string') {
      corders = JSON.parse(corders);
    }

    // Handle file uploads
    const deliveryImage = req.files.find(file => file.fieldname === 'deliveryimage')?.filename 
      ? `/uploads/${req.files.find(file => file.fieldname === 'deliveryimage').filename}` 
      : null;

    // Map product images based on their dynamic field names (e.g., productImage[0], productImage[1])
    if (req.files) {
      corders = corders.map((corder, index) => {
        const productImageField = req.files.find(file => file.fieldname === `productImage[${index}]`);
        return {
          ...corder,
          productImage: productImageField?.filename 
            ? `/uploads/${productImageField.filename}` 
            : corder.productImage
        };
      });
    }

    const orderId = generateOrderId();
    const invoiceNo = generateInvoiceId();

    const initialStatus = {
      status: "Order Placed",
      timestamp: new Date(),
      location: req.body.consignercity || "Unknown",
      notes: "Order has been placed successfully"
    };

    const newOrder = new Order({
      ...req.body,
      orderId,
      invoiceNo,
      Orderstatus: "Order Placed",
      deliveryimage: deliveryImage,
      statusHistory: [initialStatus],
    });

    const corderDocs = Array.isArray(corders)
      ? corders.map((item, index) => {
          const cid = generatecid() + `-${index}`; 
          return {
            Coorderid: orderId,
            cid,
            Consigneename: item.Consigneename || "",
            consigneemobileno: item.consigneemobileno || "",
            consigneealterno: item.consigneealterno || "",
            consigneeaddress: item.consigneeaddress || "",
            consigneecity: item.consigneecity || "",
            consigneestate: item.consigneestate || "",
            consigneedistrict: item.consigneedistrict || "",
            consigneepin: item.consigneepin || "",
            typename: item.typename || "",
            ptype: item.ptype || "",
            weight: item.weight || "",
            packages: item.packages || "",
            totalWeight: item.totalWeight || "",
            cpriceperkg: item.cpriceperkg || "",
            cprice: item.cprice || "",
            cstatus: item.cstatus || "Order Placed",
            productImage: item.productImage || "",
            statusHistory: [
              {
                status: item.cstatus || "Order Placed",
                timestamp: new Date(),
                location: item.consigneecity || "Unknown",
                notes: "Consignee order placed",
              },
            ],
          };
        })
      : [];

    const savedOrder = await newOrder.save();
    let cosaveorder = [];
    if (corderDocs.length > 0) {
      cosaveorder = await Ordermaster.insertMany(corderDocs);
    }

    res.status(201).json({
      Message: "Order saved Successfully",
      savedOrder,
      cosaveorder
    });
  } catch (err) {
    console.error("Create Order Error:", err);
    res.status(500).json({
      error: "Failed to save order",
      details: err.message
    });
  }
};

export const updateorder = async (req, res) => {
  try {
    const currentOrder = await Order.findById(req.params.id);
    if (!currentOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    const deliveryImage = req.files.find(file => file.fieldname === 'deliveryimage')?.filename 
      ? `/uploads/${req.files.find(file => file.fieldname === 'deliveryimage').filename}` 
      : req.body.deliveryimage;

    let consigneeUpdates = req.body.corders || [];
    if (typeof consigneeUpdates === 'string') {
      consigneeUpdates = JSON.parse(consigneeUpdates);
    }

    // Map product images based on their dynamic field names (e.g., productImage[0], productImage[1])
    if (req.files) {
      consigneeUpdates = consigneeUpdates.map((corder, index) => {
        const productImageField = req.files.find(file => file.fieldname === `productImage[${index}]`);
        return {
          ...corder,
          productImage: productImageField?.filename 
            ? `/uploads/${productImageField.filename}` 
            : corder.productImage
        };
      });
    }

    const consignees = await Ordermaster.find({ Coorderid: currentOrder.orderId });
    const updatedConsignees = await Promise.all(consignees.map(async (consignee, index) => {
      const corderData = consigneeUpdates[index] || {};
      
      if (Object.keys(corderData).length === 0) return consignee;

      const updateData = {
        ...corderData,
        productImage: corderData.productImage || consignee.productImage
      };

      if (corderData.cstatus && corderData.cstatus !== consignee.cstatus) {
        updateData.statusHistory = [...consignee.statusHistory, {
          status: corderData.cstatus,
          timestamp: new Date(),
          location: corderData.consigneecity || consignee.consigneecity,
          notes: `Consignee status updated to ${corderData.cstatus}`
        }];
      }

      return await Ordermaster.findOneAndUpdate(
        { cid: consignee.cid },
        updateData,
        { new: true }
      );
    }));

    const allDelivered = updatedConsignees.every(co => co.cstatus === "Delivered");
    const someDelivered = updatedConsignees.some(co => co.cstatus === "Delivered");
    const newOrderStatus = allDelivered ? "Delivered" : someDelivered ? "Partial" : "Order Placed";

    const updateOrderData = {
      ...req.body,
      deliveryimage: deliveryImage,
      Orderstatus: newOrderStatus
    };

    if (currentOrder.Orderstatus !== newOrderStatus) {
      updateOrderData.statusHistory = [...currentOrder.statusHistory, {
        status: newOrderStatus,
        timestamp: new Date(),
        location: req.body.currentRegion || currentOrder.currentRegion,
        notes: `Order status updated to ${newOrderStatus}`
      }];
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      updateOrderData,
      { new: true }
    );

    res.json({ savedOrder: updatedOrder, cosaveorder: updatedConsignees });
  } catch (err) {
    console.error("Update Order Error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const updateConsigneeOrder = async (req, res) => {
  try {
    const { cid } = req.params;
    const currentConsignee = await Ordermaster.findOne({ cid });

    if (!currentConsignee) {
      return res.status(404).json({ error: "Consignee order not found" });
    }

    // Handle the uploaded file from req.files (since we use multer.any())
    const productImageFile = req.files && req.files.find(file => file.fieldname === "productImage");
    const imagePath = productImageFile ? `/uploads/${productImageFile.filename}` : req.body.productImage;

    console.log("Uploaded files:", req.files); // Debug log
    console.log("Product image path:", imagePath); // Debug log

    let updatedConsignee;
    if (req.body.cstatus && currentConsignee.cstatus !== req.body.cstatus) {
      const newStatus = {
        status: req.body.cstatus,
        timestamp: new Date(),
        location: req.body.consigneecity || currentConsignee.consigneecity,
        notes: req.body.statusNotes || `Consignee status updated to ${req.body.cstatus}`,
      };

      updatedConsignee = await Ordermaster.findOneAndUpdate(
        { cid },
        {
          ...req.body,
          productImage: imagePath,
          $push: { statusHistory: newStatus },
        },
        { new: true }
      );
    } else {
      updatedConsignee = await Ordermaster.findOneAndUpdate(
        { cid },
        { ...req.body, productImage: imagePath },
        { new: true }
      );
    }

    const order = await Order.findOne({ orderId: currentConsignee.Coorderid });
    const allConsignees = await Ordermaster.find({ Coorderid: order.orderId });
    const allDelivered = allConsignees.every((co) => co.cstatus === "Delivered");
    const someDelivered = allConsignees.some((co) => co.cstatus === "Delivered");
    const newOrderStatus = allDelivered ? "Delivered" : someDelivered ? "Partial" : "Order Placed";

    let updatedOrder;
    if (order.Orderstatus !== newOrderStatus) {
      const newOrderStatusEntry = {
        status: newOrderStatus,
        timestamp: new Date(),
        location: order.currentRegion,
        notes: `Order status updated to ${newOrderStatus} due to consignee update`,
      };

      updatedOrder = await Order.findOneAndUpdate(
        { orderId: order.orderId },
        { Orderstatus: newOrderStatus, $push: { statusHistory: newOrderStatusEntry } },
        { new: true }
      );
    }

    res.json({ updatedConsignee, updatedOrder });
  } catch (err) {
    console.error("Update Consignee Order Error:", err);
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
    // Define matchingConsigneeOrders here with global scope
    let matchingConsigneeOrders = [];

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

      // Populate matchingConsigneeOrders for region users
      matchingConsigneeOrders = await Ordermaster.find({
        consigneedistrict: regionn.region,
      }).distinct("Coorderid");

      query = {
        $or: [
          { currentRegion: regionn.region },
          { orderId: { $in: matchingConsigneeOrders } },
        ],
      };

      total = await Order.countDocuments(query);
      orders = await Order.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ orderDate: -1 });

      if (orders.length === 0) {
        return res.status(200).json({
          order: [],
          total: 0,
          page: page,
          totalPages: 0,
          limit: limit,
        });
      }
    }

    const orderIds = orders.map((order) => order.orderId);

    // Fetch all consignees for the orders (for region update logic)
    const consigneeOrders = await Ordermaster.find({
      Coorderid: { $in: orderIds },
    });

    // Update order region if dispatched (only if currentRegion is unset)
    await Promise.all(
      orders.map(async (order) => {
        if (order.Orderstatus === "Order Dispatched" && !order.currentRegion) {
          const relatedConsigneeOrders = consigneeOrders.filter(
            (co) => co.Coorderid === order.orderId
          );
          if (relatedConsigneeOrders.length > 0) {
            const districtCounts = relatedConsigneeOrders.reduce((acc, co) => {
              acc[co.consigneedistrict] = (acc[co.consigneedistrict] || 0) + 1;
              return acc;
            }, {});
            const newRegion = Object.entries(districtCounts).reduce((a, b) =>
              b[1] > a[1] ? b : a
            )[0];
            await Order.updateOne(
              { orderId: order.orderId },
              {
                $set: {
                  currentRegion: newRegion,
                  lastUpdated: new Date(),
                },
              }
            );
          }
        }
      })
    );

    // Re-fetch updated orders
    const updatedOrders = await Order.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ orderDate: -1 });

    // Fetch consignees, handling region-specific filtering
    let updatedConsigneeOrders;
    if (req.params.region === "admin") {
      updatedConsigneeOrders = await Ordermaster.find({
        Coorderid: { $in: updatedOrders.map((o) => o.orderId) },
      });
    } else {
      // For region users, fetch consignees separately for currentRegion and consigneedistrict matches
      const regionn = await Adduser.findOne({ region: req.params.region });
      const currentRegionOrderIds = updatedOrders
        .filter((order) => order.currentRegion === regionn.region)
        .map((order) => order.orderId);
      const consigneeDistrictOrderIds = updatedOrders
        .filter((order) => matchingConsigneeOrders.includes(order.orderId))
        .map((order) => order.orderId);

      const currentRegionConsignees = await Ordermaster.find({
        Coorderid: { $in: currentRegionOrderIds },
      });
      const consigneeDistrictConsignees = await Ordermaster.find({
        Coorderid: { $in: consigneeDistrictOrderIds },
        consigneedistrict: regionn.region,
      });

      // Combine and deduplicate consignees, prioritizing region-specific filtering
      const allConsignees = [
        ...currentRegionConsignees,
        ...consigneeDistrictConsignees.filter(
          (co) =>
            !currentRegionConsignees.some(
              (crc) => crc.Coorderid === co.Coorderid && crc.cid === co.cid
            )
        ),
      ];
      updatedConsigneeOrders = allConsignees; // Fixed variable name typo here
    }

    // Combine Order and Ordermaster data
    const combinedOrders = updatedOrders.map((order) => {
      const filteredConsignees = updatedConsigneeOrders.filter(
        (co) => co.Coorderid === order.orderId
      );
      return {
        ...order._doc,
        consignees: filteredConsignees,
      };
    });

    return res.status(200).json({
      order: combinedOrders,
      total: total,
      page: page,
      totalPages: Math.ceil(total / limit),
      limit: limit,
    });
  } catch (err) {
    console.error("Get Order Error:", err);
    return res.status(500).json({
      error: err.message,
      message: "Error retrieving orders",
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
      ],
    };

    const orders = await Order.find(searchCondition);  

    
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
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

    // Base query for Orders
    let query = {};

    // Region filter for non-admin users
    let matchingConsigneeOrders = [];
    if (region !== "admin") {
      const regionUser = await Adduser.findOne({ region });
      if (!regionUser) {
        return res.status(404).json({ message: "Region not found" });
      }

      // Find Ordermaster records matching the region in consigneedistrict
      matchingConsigneeOrders = await Ordermaster.find({
        consigneedistrict: regionUser.region
      }).distinct("Coorderid");

      query.$and = [{
        $or: [
          { currentRegion: regionUser.region }, // Orders currently in this region
          { orderId: { $in: matchingConsigneeOrders } } // Orders with consignees in this region
        ]
      }];
    }

    // Add search conditions if search exists
    if (search && search.trim()) {
      const searchRegex = { $regex: search, $options: "i" };
      const searchQuery = {
        $or: [
          { orderId: searchRegex },
          { ConsignerName: searchRegex },
          { consignermobileNumber: searchRegex },
          { consignermail: searchRegex },
          { consignercity: searchRegex }
        ]
      };

      // Extend search to Ordermaster fields via a separate query
      const consigneeSearchIds = await Ordermaster.find({
        $or: [
          { cid: searchRegex},
          { Consigneename: searchRegex },
          { consigneemobileno: searchRegex },
          { consigneecity: searchRegex }
        ]
      }).distinct("Coorderid");

      if (consigneeSearchIds.length > 0) {
        searchQuery.$or.push({ orderId: { $in: consigneeSearchIds } });
      }

      if (query.$and) {
        query.$and.push(searchQuery);
      } else {
        query = searchQuery;
      }
    }

    // Add status filter if exists
    if (status && status.trim() && status !== " ") {
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
              $options: "i"
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
        console.error("Error parsing filters:", error);
      }
    }

    // Sorting
    const sort = {};
    if (sortField) {
      sort[sortField] = sortOrder === "desc" ? -1 : 1;
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

    // Fetch associated Ordermaster records
    const orderIds = orders.map(order => order.orderId);
    let consigneeOrders;
    if (region === "admin") {
      // Admin gets all consignees
      consigneeOrders = await Ordermaster.find({ Coorderid: { $in: orderIds } });
    } else {
      // Non-admin gets only consignees matching their region
      consigneeOrders = await Ordermaster.find({
        Coorderid: { $in: orderIds },
        consigneedistrict: region
      });
    }

    // Combine Order and Ordermaster data
    const combinedOrders = orders.map(order => {
      const filteredConsignees = consigneeOrders.filter(co => co.Coorderid === order.orderId);
      return {
        ...order._doc,
        consignees: filteredConsignees
      };
    });

    return res.json({
      order: combinedOrders,
      total,
      page: pageNumber,
      totalPages: Math.ceil(total / limitNumber),
      limit: limitNumber
    });
  } catch (error) {
    console.error("Filter Error:", error);
    return res.status(500).json({
      message: "Error processing filter request",
      error: error.message
    });
  }
};


export const getid = async (req, res) => {
  try {
    const savedOrder = await Order.findById(req.params.id);
    if (!savedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    const cosaveorder = await Ordermaster.find({ Coorderid: savedOrder.orderId });

    res.json({
      savedOrder,
      cosaveorder
    });
  } catch (err) {
    console.error("Get Order by ID Error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getTotalOrders = async (req, res) => {
  try {
    let totalOrders, singleConsigneeOrders, multipleConsigneeOrders;

    if (req.params.region === "admin") {
      const allOrders = await Order.find();
      const orderIds = allOrders.map(order => order.orderId);
      const consigneeCounts = await Ordermaster.aggregate([
        { $match: { Coorderid: { $in: orderIds } } },
        { $group: { _id: "$Coorderid", count: { $sum: 1 } } }
      ]);
      
      // Create a map of orderId to consignee count for easier lookup
      const orderConsigneeCounts = {};
      consigneeCounts.forEach(item => {
        orderConsigneeCounts[item._id] = item.count;
      });
      
      // Categorize orders based on consignee count
      totalOrders = allOrders;
      singleConsigneeOrders = allOrders.filter(order => 
        orderConsigneeCounts[order.orderId] === 1);
      multipleConsigneeOrders = allOrders.filter(order => 
        orderConsigneeCounts[order.orderId] > 1);
      
    } else {
      // Find the region
      const regionn = await Adduser.findOne({ region: req.params.region });
      if (!regionn) {
        return res.status(404).json({ message: "Region not found" });
      }

      // Get order IDs where consignee district matches the region
      const matchingConsigneeOrders = await Ordermaster.find({
        consigneedistrict: regionn.region
      }).distinct("Coorderid");

      // Get orders for the region
      const regionOrders = await Order.find({
        $or: [
          { currentRegion: regionn.region },
          { orderId: { $in: matchingConsigneeOrders } }
        ]
      });
      
      const orderIds = regionOrders.map(order => order.orderId);
      
      // Get consignee counts for each order
      const consigneeCounts = await Ordermaster.aggregate([
        { $match: { Coorderid: { $in: orderIds } } },
        { $group: { _id: "$Coorderid", count: { $sum: 1 } } }
      ]);
      
      // Create a map of orderId to consignee count
      const orderConsigneeCounts = {};
      consigneeCounts.forEach(item => {
        orderConsigneeCounts[item._id] = item.count;
      });
      
      // Categorize orders based on consignee count
      totalOrders = regionOrders;
      singleConsigneeOrders = regionOrders.filter(order => 
        orderConsigneeCounts[order.orderId] === 1);
      multipleConsigneeOrders = regionOrders.filter(order => 
        orderConsigneeCounts[order.orderId] > 1);
    }

    return res.status(200).json({
      total: {
        count: totalOrders.length,
        orders: totalOrders
      },
      singleConsignee: {
        count: singleConsigneeOrders.length,
        orders: singleConsigneeOrders
      },
      multipleConsignee: {
        count: multipleConsigneeOrders.length,
        orders: multipleConsigneeOrders
      }
    });
    
  } catch (err) {
    console.error("Get Total Orders Error:", err);
    return res.status(500).json({ error: err.message });
  }
};

export const gettodayorder = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    let todaycount;
    if (req.params.region === "admin") {
      todaycount = await Order.find({
        todayorderDate: { $gte: startOfDay, $lt: endOfDay }
      });
    } else {
      const regionn = await Adduser.findOne({ region: req.params.region });
      if (!regionn) {
        return res.status(404).json({ message: "Region not found" });
      }
      const matchingConsigneeOrders = await Ordermaster.find({
        consigneedistrict: regionn.region
      }).distinct("Coorderid");

      todaycount = await Order.find({
        $and: [
          { todayorderDate: { $gte: startOfDay, $lt: endOfDay } },
          {
            $or: [
              { currentRegion: regionn.region },
              { orderId: { $in: matchingConsigneeOrders } }
            ]
          }
        ]
      });
    }
    return res.status(200).json({ today: todaycount });
  } catch (error) {
    console.error("Get Today Order Error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteorder = async (req, res) => {
  try {
    const deleteOrder = await Order.findByIdAndDelete(req.params.id);
    res.status(200).json({ deleteOrder: " Deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const getdispatched = async (req, res) => {
  try {
    let dispatchedOrders;

    if (req.params.region === "admin") {
      dispatchedOrders = await Ordermaster.find({ cstatus: "Order Dispatched" });
    } else {
      const regionn = await Adduser.findOne({ region: req.params.region });
      if (!regionn) {
        return res.status(404).json({ message: "Region not found" });
      }
      dispatchedOrders = await Ordermaster.find({
        cstatus: "Order Dispatched",
        consigneedistrict: regionn.region
      });
    }
    if (dispatchedOrders.length === 0) {
      return res.status(200).json([]);
    }

    return res.status(200).json(dispatchedOrders);
  } catch (error) {
    console.error("Get Dispatched Orders Error:", error);
    return res.status(500).json({ error: "An error occurred while fetching dispatched orders" });
  }
};

export const getoutfordelivery = async (req, res) => {
  try {
    let outForDeliveryOrders;
    if (req.params.region === "admin") {
       outForDeliveryOrders = await Ordermaster.find({ cstatus: "Out for Delivery" })
    } else {
      const regionn = await Adduser.findOne({ region: req.params.region });
      if (!regionn) {
        return res.status(404).json({ message: "Region not found" });
      }
      outForDeliveryOrders = await Ordermaster.find({
        cstatus: "Out for Delivery",
        consigneedistrict: regionn.region
      });
    }
    if (outForDeliveryOrders.length === 0) {
      return res.status(200).json([]);
    }
    return res.status(200).json(outForDeliveryOrders);
  } catch (error) {
    console.error("Get Out for Delivery Orders Error:", error);
    return res.status(500).json({ error: "An error occurred while fetching Out for Delivery orders" });
  }
};

export const getdelivered = async (req, res) => {
  try {
    let deliveredOrders;

    if (req.params.region === "admin") {
      deliveredOrders = await Ordermaster.find({ cstatus: "Delivered"});
    } else {
      const regionn = await Adduser.findOne({ region: req.params.region });
      if (!regionn) {
        return res.status(404).json({ message: "Region not found" });
      }
      deliveredOrders = await Ordermaster.find({
        cstatus: "Delivered",
        consigneedistrict: regionn.region
      })
    }

    if (deliveredOrders.length === 0) {
      return res.status(200).json([]);
    }

    return res.status(200).json(deliveredOrders);
  } catch (error) {
    console.error("Get Delivered Orders Error:", error);
    return res.status(500).json({ error: "An error occurred while fetching delivered orders" });
  }
};


export const getpending =  async (req, res) => {
  try {
    if (req.params.region === "admin") {
     
      const pendingOrders = await Ordermaster.find({ cstatus: { $ne: "Delivered" } });
      return res.json(pendingOrders);
    }
    const Region = await Adduser.findOne({ region: req.params.region });
    if (!Region) {
      return res.status(404).json({ message: "Region not found" });
    }
    const pendingOrder = await Ordermaster.find({
      consigneedistrict: Region.region,cstatus: { $ne: "Delivered" } 
    });

    if (pendingOrder.length === 0) {
      return res.join({ message: 'No dispatched orders found' })
    }
   return  res.json(pendingOrder);
  } catch (error) {
   return res.status(500).json({ error: 'An error occurred while fetching pending orders' });
  }
};


export const getmyorder = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let orderQuery = {};
    let total = 0;
    let orders;

    if (req.params.region === "admin") {
      orderQuery = {};
      total = await Order.countDocuments(orderQuery);
      orders = await Order.find(orderQuery)
        .skip(skip)
        .limit(limit)
        .sort({ orderDate: -1 });
    } else {
      const Region = await Adduser.findOne({ region: req.params.region });

      if (!Region) {
        return res.status(404).json({ message: "Region not found" });
      }

      orderQuery = { currentRegion: Region.region };
      total = await Order.countDocuments(orderQuery);
      orders = await Order.find(orderQuery)
        .skip(skip)
        .limit(limit)
        .sort({ orderDate: -1 });

      if (orders.length === 0) {
        return res.status(200).json({
          order: [],
          total: 0,
          page: page,
          totalPages: 0,
          limit: limit,
        });
      }
    }

    // Apply filters from req.query to Order data
    const orderFilters = {};
    const orderFilterFields = [
      'orderId',
      'ConsignerName',
      'Orderstatus',
      'consignermobileNumber',
      'consignercity',
      'consignermail',
      'consignerdistrict',
      'consignerstate',
      'consignerpincode',
      'noofpackage',
      'packageWeight',
      'price',
    ];

    orderFilterFields.forEach((field) => {
      if (req.query[field]) {
        orderFilters[field] = { $regex: new RegExp(req.query[field], 'i') }; // Case-insensitive regex
      }
    });

    // Apply Order filters if present
    if (Object.keys(orderFilters).length > 0) {
      orders = orders.filter(order => {
        return Object.entries(orderFilters).every(([key, value]) => {
          if (order[key] && value.$regex.test(order[key])) {
            return true;
          }
          return false;
        });
      });
      total = orders.length; // Update total based on filtered results
    }

    // Get order IDs for all visible (and filtered) orders
    const orderIds = orders.map(order => order.orderId);
    console.log("Fetching orders for orderIds after filtering:", orderIds); // Debug log

    // Fetch all Ordermaster records for these orders as a base set
    let ordermasterData = await Ordermaster.find({
      Coorderid: { $in: orderIds },
    });
    console.log("Base Ordermaster data found:", ordermasterData.length); // Debug log

    // Apply filters from req.query to refine Ordermaster data
    const ordermasterFilters = {};
    const ordermasterFilterFields = [
      'Consigneename',
      'consigneemobileno',
      'consigneealterno',
      'consigneeaddress',
      'consigneecity',
      'consigneestate',
      'consigneedistrict',
      'consigneepin',
      'typename',
      'ptype',
      'weight',
      'packages',
      'totalWeight',
      'cprice',
      'cstatus',
      'cid', // Added for filtering by consignee ID
    ];

    ordermasterFilterFields.forEach((field) => {
      if (req.query[field]) {
        if (field === 'cid') {
          // Use exact match for cid to ensure precise filtering
          ordermasterFilters[field] = req.query[field]; // Exact match, no regex
        } else {
          ordermasterFilters[field] = { $regex: new RegExp(req.query[field], 'i') }; // Case-insensitive regex for other fields
        }
      }
    });

    console.log("Ordermaster filters applied:", ordermasterFilters); // Debug log

    // Apply Ordermaster filters if present
    if (Object.keys(ordermasterFilters).length > 0) {
      ordermasterData = await Ordermaster.find({
        Coorderid: { $in: orderIds },
        ...ordermasterFilters, // Use MongoDB query for exact cid match
      });
      console.log("Filtered Ordermaster data:", ordermasterData.length); // Debug log
    }

    // Ensure ordermasterData is always an array, even if empty
    if (!ordermasterData || !Array.isArray(ordermasterData)) {
      ordermasterData = [];
    }

    // Combine Order and Ordermaster data
    const updatedOrders = orders.map(order => {
      const relatedOrdermaster = ordermasterData.filter(om => om.Coorderid === order.orderId) || [];
      return {
        ...order._doc,
        consigneeDetails: relatedOrdermaster.length > 0 ? relatedOrdermaster : [],
      };
    });

    console.log("Updated Orders with Consignee Details:", updatedOrders); // Debug log

    return res.status(200).json({
      order: updatedOrders,
      total: total,
      page: page,
      totalPages: Math.ceil(total / limit),
      limit: limit,
    });

  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ error: "An error occurred while fetching orders" });
  }
};

export const uploadMiddleware = upload;
export const uploadfiles = upload;    