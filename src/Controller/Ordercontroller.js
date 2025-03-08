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
            consigneeedistrict: item.consigneeedistrict || "",
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

      matchingConsigneeOrders = await Ordermaster.find({
        consigneeedistrict: regionn.region,
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

    const consigneeOrders = await Ordermaster.find({
      Coorderid: { $in: orderIds },
    });

    await Promise.all(
      orders.map(async (order) => {
        if (order.Orderstatus === "Order Dispatched" && !order.currentRegion) {
          const relatedConsigneeOrders = consigneeOrders.filter(
            (co) => co.Coorderid === order.orderId
          );
          if (relatedConsigneeOrders.length > 0) {
            const districtCounts = relatedConsigneeOrders.reduce((acc, co) => {
              acc[co.consigneeedistrict] = (acc[co.consigneeedistrict] || 0) + 1;
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

    let updatedConsigneeOrders;
    if (req.params.region === "admin") {
      updatedConsigneeOrders = await Ordermaster.find({
        Coorderid: { $in: updatedOrders.map((o) => o.orderId) },
      });
    } else {
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
        consigneeedistrict: regionn.region,
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
      region,
      getFilterOptions = "false", 
    } = req.query;

    let query = {};

    let matchingConsigneeOrders = [];
    if (region !== "admin") {
      const regionUser = await Adduser.findOne({ region });
      if (!regionUser) {
        return res.status(404).json({ message: "Region not found" });
      }

      matchingConsigneeOrders = await Ordermaster.find({
        consigneeedistrict: regionUser.region,
      }).distinct("Coorderid");

      query.$and = [
        {
          $or: [
            { currentRegion: regionUser.region },
            { orderId: { $in: matchingConsigneeOrders } },
          ],
        },
      ];
    }

    if (getFilterOptions === "true") {
      const orders = await Order.find(query).lean();

      const uniqueConsignerNames = [
        ...new Set(orders.map((item) => item.ConsignerName)),
      ].filter(Boolean);
      const uniqueOrderStatuses = [
        ...new Set(orders.map((item) => item.Orderstatus)),
      ].filter(Boolean);
      const uniqueConsignerCities = [
        ...new Set(orders.map((item) => item.consignercity)),
      ].filter(Boolean);
      const uniqueOrderDates = [
        ...new Set(orders.map((item) => item.orderDate)),
      ].filter(Boolean);
      const uniqueOrderIds = [
        ...new Set(orders.map((item) => item.orderId)),
      ].filter(Boolean);
      const uniqueConsignerDistricts = [
        ...new Set(orders.map((item) => item.consignerdistrict)),
      ].filter(Boolean);
      const uniqueConsignerPincodes = [
        ...new Set(orders.map((item) => item.consignerpincode)),
      ].filter(Boolean);

      return res.json({
        filterOptions: {
          consignerNames: uniqueConsignerNames,
          orderStatuses: uniqueOrderStatuses,
          consignerCities: uniqueConsignerCities,
          orderDates: uniqueOrderDates,
          orderIds: uniqueOrderIds,
          consignerDistricts: uniqueConsignerDistricts,
          consignerPincodes: uniqueConsignerPincodes,
        },
      });
    }

    // Existing logic for fetching paginated data
    if (search && search.trim()) {
      const searchRegex = { $regex: search, $options: "i" };
      const searchQuery = {
        $or: [
          { orderId: searchRegex },
          { ConsignerName: searchRegex },
          { consignermobileNumber: searchRegex },
          { consignermail: searchRegex },
          { consignercity: searchRegex },
          { consignerstate: searchRegex },
          { consignerdistrict: searchRegex },
          { consignerpincode: searchRegex },
          { Orderstatus: searchRegex },
          { orderDate: searchRegex },
          { noofpackage: searchRegex },
          { packagetype: searchRegex },
          { packageWeight: searchRegex },
          { consignerAddress: searchRegex },
        ],
      };

      const consigneeSearchIds = await Ordermaster.find({
        $or: [
          { cid: searchRegex },
          { Consigneename: searchRegex },
          { consigneemobileno: searchRegex },
          { consigneecity: searchRegex },
        ],
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

    if (status && status.trim() && status !== " ") {
      const statusFilter = { Orderstatus: status };
      if (query.$and) {
        query.$and.push(statusFilter);
      } else {
        query.$and = [statusFilter];
      }
    }

    if (filters) {
      const parsedFilters = JSON.parse(filters);
      const filterConditions = Object.entries(parsedFilters)
        .filter(([_, filter]) => filter.value && filter.value.length > 0)
        .map(([field, filter]) => {
          if (
            [
              "ConsignerName",
              "Orderstatus",
              "consignercity",
              "orderDate",
              "orderId",
              "consignerdistrict",
              "consignerpincode",
            ].includes(field) &&
            Array.isArray(filter.value)
          ) {
            return { [field]: { $in: filter.value } };
          } else if (filter.value && filter.value.trim()) {
            return {
              [field]: {
                $regex: filter.value,
                $options: "i",
              },
            };
          }
          return null;
        })
        .filter(Boolean);

      if (filterConditions.length > 0) {
        if (query.$and) {
          query.$and.push(...filterConditions);
        } else {
          query.$and = filterConditions;
        }
      }
    }

    const sort = {};
    if (sortField) {
      sort[sortField] = sortOrder === "desc" ? -1 : 1;
    }

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const [orders, total] = await Promise.all([
      Order.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limitNumber),
      Order.countDocuments(query),
    ]);

    const orderIds = orders.map((order) => order.orderId);
    let consigneeOrders;
    if (region === "admin") {
      consigneeOrders = await Ordermaster.find({ Coorderid: { $in: orderIds } });
    } else {
      consigneeOrders = await Ordermaster.find({
        Coorderid: { $in: orderIds },
        consigneeedistrict: region,
      });
    }

    const combinedOrders = orders.map((order) => {
      const filteredConsignees = consigneeOrders.filter(
        (co) => co.Coorderid === order.orderId
      );
      return {
        ...order._doc,
        consignees: filteredConsignees,
      };
    });

    return res.json({
      order: combinedOrders,
      total,
      page: pageNumber,
      totalPages: Math.ceil(total / limitNumber),
      limit: limitNumber,
    });
  } catch (error) {
    console.error("Filter Error:", error);
    return res.status(500).json({
      message: "Error processing filter request",
      error: error.message,
    });
  }
};




// export const getfilter = async (req, res) => {
//   try {
//     const {
//       page = 1,
//       limit = 10,
//       sortField,
//       sortOrder,
//       status,
//       search,
//       filters,
//       region
//     } = req.query;

//     let query = {};

//     // Region filter for non-admin users
//     let matchingConsigneeOrders = [];
//     if (region !== "admin") {
//       const regionUser = await Adduser.findOne({ region });
//       if (!regionUser) {
//         return res.status(404).json({ message: "Region not found" });
//       }

//       matchingConsigneeOrders = await Ordermaster.find({
//         consigneeedistrict: regionUser.region
//       }).distinct("Coorderid");

//       query.$and = [{
//         $or: [
//           { currentRegion: regionUser.region },
//           { orderId: { $in: matchingConsigneeOrders } }
//         ]
//       }];
//     }

//     // Add search conditions if search exists
//     if (search && search.trim()) {
//       const searchRegex = { $regex: search, $options: "i" };
//       const searchQuery = {
//         $or: [
//           { orderId: searchRegex },
//           { ConsignerName: searchRegex },
//           { consignermobileNumber: searchRegex },
//           { consignermail: searchRegex },
//           { consignercity: searchRegex },
//           { consignerstate: searchRegex },
//           { consignerdistrict: searchRegex },
//           { consignerpincode: searchRegex },
//           { Orderstatus: searchRegex },
//           { orderDate: searchRegex },
//           { noofpackage: searchRegex },
//           { packagetype: searchRegex },
//           { packageWeight: searchRegex },
//           { consignerAddress: searchRegex }
//         ]
//       };

//       const consigneeSearchIds = await Ordermaster.find({
//         $or: [
//           { cid: searchRegex },
//           { Consigneename: searchRegex },
//           { consigneemobileno: searchRegex },
//           { consigneecity: searchRegex }
//         ]
//       }).distinct("Coorderid");

//       if (consigneeSearchIds.length > 0) {
//         searchQuery.$or.push({ orderId: { $in: consigneeSearchIds } });
//       }

//       if (query.$and) {
//         query.$and.push(searchQuery);
//       } else {
//         query = searchQuery;
//       }
//     }

//     if (status && status.trim() && status !== " ") {
//       const statusFilter = { Orderstatus: status };
//       if (query.$and) {
//         query.$and.push(statusFilter);
//       } else {
//         query.$and = [statusFilter];
//       }
//     }

//     if (filters) {
//       try {
//         const parsedFilters = JSON.parse(filters);
//         const filterConditions = Object.entries(parsedFilters)
//           .filter(([_, filter]) => filter.value && filter.value.length > 0)
//           .map(([field, filter]) => {
//             if (["ConsignerName", "Orderstatus", "consignercity", "orderDate", "orderId", "consignerdistrict", "consignerpincode"].includes(field) && Array.isArray(filter.value)) {
//               return { [field]: { $in: filter.value } };
//             } else if (filter.value && filter.value.trim()) {
//               return {
//                 [field]: {
//                   $regex: filter.value,
//                   $options: "i"
//                 }
//               };
//             }
//             return null;
//           })
//           .filter(Boolean);

//         if (filterConditions.length > 0) {
//           if (query.$and) {
//             query.$and.push(...filterConditions);
//           } else {
//             query.$and = filterConditions;
//           }
//         }
//       } catch (error) {
//         console.error("Error parsing filters:", error);
//       }
//     }

//     // Sorting
//     const sort = {};
//     if (sortField) {
//       sort[sortField] = sortOrder === "desc" ? -1 : 1;
//     }

//     // Pagination
//     const pageNumber = parseInt(page);
//     const limitNumber = parseInt(limit);
//     const skip = (pageNumber - 1) * limitNumber;

//     // Fetch all filter options (without pagination)
//     const allOrders = await Order.find(query);
//     const filterOptions = {
//       consignerNames: [...new Set(allOrders.map((item) => item.ConsignerName))].filter(Boolean),
//       orderStatuses: [...new Set(allOrders.map((item) => item.Orderstatus))].filter(Boolean),
//       consignerCities: [...new Set(allOrders.map((item) => item.consignercity))].filter(Boolean),
//       orderDates: [...new Set(allOrders.map((item) => item.orderDate))].filter(Boolean),
//       orderIds: [...new Set(allOrders.map((item) => item.orderId))].filter(Boolean),
//       consignerDistricts: [...new Set(allOrders.map((item) => item.consignerdistrict))].filter(Boolean),
//       consignerPincodes: [...new Set(allOrders.map((item) => item.consignerpincode))].filter(Boolean),
//     };

//     // Execute query with pagination
//     const [orders, total] = await Promise.all([
//       Order.find(query)
//         .sort(sort)
//         .skip(skip)
//         .limit(limitNumber),
//       Order.countDocuments(query)
//     ]);

//     // Fetch associated Ordermaster records
//     const orderIds = orders.map((order) => order.orderId);
//     let consigneeOrders;
//     if (region === "admin") {
//       consigneeOrders = await Ordermaster.find({ Coorderid: { $in: orderIds } });
//     } else {
//       consigneeOrders = await Ordermaster.find({
//         Coorderid: { $in: orderIds },
//         consigneeedistrict: region
//       });
//     }

//     // Combine Order and Ordermaster data
//     const combinedOrders = orders.map((order) => {
//       const filteredConsignees = consigneeOrders.filter((co) => co.Coorderid === order.orderId);
//       return {
//         ...order._doc,
//         consignees: filteredConsignees
//       };
//     });

//     return res.json({
//       order: combinedOrders,
//       total,
//       page: pageNumber,
//       totalPages: Math.ceil(total / limitNumber),
//       limit: limitNumber,
//       filterOptions // Return filter options for all data
//     });
//   } catch (error) {
//     console.error("Filter Error:", error);
//     return res.status(500).json({
//       message: "Error processing filter request",
//       error: error.message
//     });
//   }
// };

export const getfilterdata =async (req, res) => {
  try {
    const { filterValues } = req.body;

    let query = {};

    // Add conditions dynamically based on filters
    if (filterValues.consignerNames?.length) {
      query.ConsignerName = { $in: filterValues.consignerNames };
    }
    if (filterValues.orderStatuses?.length) {
      query.Orderstatus = { $in: filterValues.orderStatuses };
    }
    if (filterValues.consignerCities?.length) {
      query.ConsignerCity = { $in: filterValues.consignerCities };
    }
    if (filterValues.orderDates?.length) {
      query.orderDate = { $in: filterValues.orderDates };
    }
    if (filterValues.orderIds?.length) {
      query.orderId = { $in: filterValues.orderIds };
    }
    if (filterValues.conrDistricts?.length) {
      query.ConsignerDistrict = { $in: filterValues.conrDistricts };
    }
    if (filterValues.consignerPincodes?.length) {
      query.ConsignerPincode = { $in: filterValues.consignerPincodes };
    }

    // Fetch filtered data from MongoDB
    const filteredOrders = await Order.find(query);

    res.status(200).json(filteredOrders);
  } catch (error) {
    console.error("Error fetching filter data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

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
        consigneeedistrict: regionn.region
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
        consigneeedistrict: regionn.region
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
      const orderId = req.params.id;
      console.log("Attempting to delete order with ID:", orderId);

      const order = await Order.findById(orderId);
      console.log("Order found:", order);

      if (!order) {
          return res.status(404).json({ error: "Order not found" });
      }

      await Order.findByIdAndDelete(orderId);
      await Ordermaster.deleteMany({ Coorderid: order.orderId });

      res.status(200).json({ 
          message: "Order and related master data deleted successfully"
      });

  } catch (err) {
      console.error("Error in deleteorder:", err);
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
        consigneeedistrict: regionn.region
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

export const getDispatchedFiltered = async (req, res) => {
  try {
    const { region } = req.params;
    const { 
      cid, 
      consigneename, 
      consigneeedistrict, 
      cstatus,
      consigneemobileno,
      consigneepin,
      dispatchedDateTime, // Filter for dispatched date
      search 
    } = req.query;

    let query = { cstatus: "Order Dispatched" };
    
    // Admin can see all dispatched orders
    if (region !== "admin") {
      const regionData = await Adduser.findOne({ region });
      if (!regionData) {
        return res.status(404).json({ message: "Region not found" });
      }
      query.consigneeedistrict = regionData.region;
    }

    // Apply filters if provided
    if (cid) {
      query.cid = { $in: cid.split(',') };
    }
    if (consigneename) {
      query.Consigneename = { $in: consigneename.split(',') };
    }
    if (consigneeedistrict && region === "admin") {
      query.consigneeedistrict = { $in: consigneeedistrict.split(',') };
    }
    if (cstatus) {
      query.cstatus = { $in: cstatus.split(',') };
    }
    if(consigneemobileno){
      query.consigneemobileno = { $in: consigneemobileno.split(',')}
    }
    if(consigneepin){
      query.consigneepin ={ $in: consigneepin.split(',')}
    }
    if (dispatchedDateTime) {
      // Convert localized date strings to ISO date ranges
      const dateValues = dispatchedDateTime.split(',').map(dateStr => {
        const date = new Date(dateStr);
        const startOfDay = new Date(date.setHours(0, 0, 0, 0)).toISOString();
        const endOfDay = new Date(date.setHours(23, 59, 59, 999)).toISOString();
        return { $gte: startOfDay, $lte: endOfDay };
      });
      query.statusHistory = {
        $elemMatch: {
          status: "Order Dispatched",
          timestamp: { $in: dateValues }
        }
      };
    }
    
    // Apply global search filter
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { cid: searchRegex },
        { Consigneename: searchRegex },
        { consigneeaddress: searchRegex },
        { consigneeedistrict: searchRegex },
        { consigneepin: searchRegex },
        { cstatus: searchRegex },
        {consigneemobileno:searchRegex},
      ];
    }

    const dispatchedOrders = await Ordermaster.find(query);

    if (dispatchedOrders.length === 0) {
      return res.status(200).json([]);
    }

    return res.status(200).json(dispatchedOrders);
  } catch (error) {
    console.error("Get Filtered Dispatched Orders Error:", error);
    return res.status(500).json({ 
      error: "An error occurred while fetching filtered dispatched orders" 
    });
  }
};

export const getoutfordelivery = async (req, res) => {
  try {
    const { region } = req.params;
    const { search } = req.query; // Get search query from request

    let query = { cstatus: "Out for Delivery" };

    // Add region filter if not admin
    if (region !== "admin") {
      const regionn = await Adduser.findOne({ region });
      if (!regionn) {
        return res.status(404).json({ message: "Region not found" });
      }
      query.consigneeedistrict = regionn.region;
    }

    // Add search filter across all fields
    if (search) {
      const searchRegex = new RegExp(search, "i"); // Case-insensitive search
      query.$or = [
        { cid: searchRegex },
        { Consigneename: searchRegex },
        { consigneemobileno: searchRegex },
        { consigneeaddress: searchRegex },
        { consigneeedistrict: searchRegex },
        { consigneepin: searchRegex },
        { "statusHistory.timestamp": searchRegex }, // Adjust based on your schema
      ];
    }

    const outForDeliveryOrders = await Ordermaster.find(query);

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
    const { region } = req.params;
    const { search } = req.query; // Get search query from request

    let query = { cstatus: "Delivered" };

    // Add region filter if not admin
    if (region !== "admin") {
      const regionn = await Adduser.findOne({ region });
      if (!regionn) {
        return res.status(404).json({ message: "Region not found" });
      }
      query.consigneeedistrict = regionn.region;
    }

    if (search) {
      const searchRegex = new RegExp(search, "i"); 
      query.$or = [
        { cid: searchRegex },
        { Consigneename: searchRegex },
        { consigneemobileno: searchRegex },
        { consigneeaddress: searchRegex },
        { consigneeedistrict: searchRegex },
        { consigneepin: searchRegex },
        { "statusHistory.timestamp": searchRegex },
      ];
    }

    const deliveredOrders = await Ordermaster.find(query);

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
      consigneeedistrict: Region.region,cstatus: { $ne: "Delivered" } 
    });

    if (pendingOrder.length === 0) {
      return res.join({ message: 'No dispatched orders found' })
    }
   return  res.json(pendingOrder);
  } catch (error) {
   return res.status(500).json({ error: 'An error occurred while fetching dispatched orders' });
  }
};


export const getmyorder = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const region = req.params.region;

    let orderQuery = {};
    let orders;
    let total;

    // Handle region-based filtering
    if (region === "admin") {
      orderQuery = {};
    } else {
      const regionData = await Adduser.findOne({ region: region });
      if (!regionData) {
        return res.status(404).json({ message: "Region not found" });
      }
      orderQuery = { currentRegion: regionData.region };
    }

    // Get total count and orders
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

    // Get related consignee details
    const orderIds = orders.map(order => order.orderId);
    const ordermasterData = await Ordermaster.find({
      Coorderid: { $in: orderIds },
    });

    // Combine orders with consignee details
    const updatedOrders = orders.map(order => {
      const relatedOrdermaster = ordermasterData.filter(om => om.Coorderid === order.orderId) || [];
      return {
        ...order._doc,
        consigneeDetails: relatedOrdermaster
      };
    });

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


export const getMyOrderFilter = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const region = req.query.region;
    const { filters, search, status, sortField, sortOrder, getFilterOptions } = req.query;

    // Handle filter options request
    if (getFilterOptions === "true") {
      let query = region === "admin" ? {} : { currentRegion: region };
      
      const orders = await Order.find(query);
      const ordermasterData = await Ordermaster.find({
        Coorderid: { $in: orders.map(o => o.orderId) }
      });

      const filterOptions = {
        consignerNames: [...new Set(orders.map(o => o.ConsignerName))],
        orderStatuses: [...new Set(orders.map(o => o.Orderstatus))],
        consignerCities: [...new Set(orders.map(o => o.consignercity))],
        orderDates: [...new Set(orders.map(o => o.orderDate))],
        orderIds: [...new Set(orders.map(o => o.orderId))],
        consignerDistricts: [...new Set(orders.map(o => o.consignerdistrict))],
        consignerPincodes: [...new Set(orders.map(o => o.consignerpincode))],
      };

      return res.status(200).json({ filterOptions });
    }

    // Build base query with region
    let orderQuery = {};
    if (region !== "admin") {
      const regionData = await Adduser.findOne({ region: region });
      if (!regionData) {
        return res.status(404).json({ message: "Region not found" });
      }
      orderQuery.currentRegion = regionData.region;
    }

    // Apply parsed filters if provided
    if (filters) {
      const parsedFilters = JSON.parse(filters);
      Object.entries(parsedFilters).forEach(([field, filter]) => {
        if (filter.value) {
          if (Array.isArray(filter.value)) {
            orderQuery[field] = { $in: filter.value };
          } else {
            orderQuery[field] = { $regex: new RegExp(filter.value, 'i') };
          }
        }
      });
    }

    // Apply status filter
    if (status) {
      orderQuery.Orderstatus = status;
    }

    // Apply search filter
    if (search) {
      orderQuery.$or = [
        { orderId: { $regex: new RegExp(search, 'i') } },
        { ConsignerName: { $regex: new RegExp(search, 'i') } }
      ];
    }

    // Get total count
    const total = await Order.countDocuments(orderQuery);

    // Build sort object
    let sort = { orderDate: -1 };
    if (sortField) {
      sort = { [sortField]: sortOrder === '1' ? 1 : -1 };
    }

    // Fetch orders with pagination and sorting
    const orders = await Order.find(orderQuery)
      .skip(skip)
      .limit(limit)
      .sort(sort);

    if (orders.length === 0) {
      return res.status(200).json({
        order: [],
        total: 0,
        page: page,
        totalPages: 0,
        limit: limit,
      });
    }

    // Get related consignee details
    const orderIds = orders.map(order => order.orderId);
    let ordermasterQuery = { Coorderid: { $in: orderIds } };

    // Apply consignee-specific filters if present
    if (filters) {
      const parsedFilters = JSON.parse(filters);
      const consigneeFields = [
        'Consigneename', 'consigneemobileno', 'consigneealterno',
        'consigneecity', 'consigneestate', 'consigneeedistrict',
        'consigneepin', 'typename', 'ptype', 'cid'
      ];
      
      consigneeFields.forEach(field => {
        if (parsedFilters[field]?.value) {
          ordermasterQuery[field] = Array.isArray(parsedFilters[field].value)
            ? { $in: parsedFilters[field].value }
            : { $regex: new RegExp(parsedFilters[field].value, 'i') };
        }
      });
    }

    const ordermasterData = await Ordermaster.find(ordermasterQuery);

    // Combine orders with consignee details
    const updatedOrders = orders.map(order => {
      const relatedOrdermaster = ordermasterData.filter(om => om.Coorderid === order.orderId) || [];
      return {
        ...order._doc,
        consigneeDetails: relatedOrdermaster
      };
    });

    return res.status(200).json({
      order: updatedOrders,
      total: total,
      page: page,
      totalPages: Math.ceil(total / limit),
      limit: limit,
    });

  } catch (error) {
    console.error("Error fetching filtered orders:", error);
    return res.status(500).json({ error: "An error occurred while fetching filtered orders" });
  }
};

export const uploadMiddleware = upload;
export const uploadfiles = upload;    