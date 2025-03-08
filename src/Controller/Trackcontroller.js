import Ordermaster from "../models/ordermaster.js";
import Order from "../models/orderschema.js";


export const track = async (req, res) => {
    try {
      const { orderId } = req.params; 
  
      // Check if the input is an orderId or cid based on prefix or length
      if (orderId.startsWith("ORD")) {
        // Track by orderId
        const order = await Order.findOne({ orderId });
        if (!order) {
          return res.status(404).json({ message: "Order tracking ID not found" });
        }
  
        // Fetch associated consignee orders
        const consigneeOrders = await Ordermaster.find({ Coorderid: order.orderId });
  
        // Prepare tracking response with consignee history
        const trackingData = {
          orderId: order.orderId,
          consigner: order.ConsignerName,
          currentStatus: order.Orderstatus,
          Bookingdate: order.orderDate,
          From: `${order.consignerdistrict}, ${order.consignerpincode.slice(7)}`,
          Packages: order.noofpackage,
          statusHistory: order.statusHistory.map(status => ({
            status: status.status,
            timestamp: status.timestamp,
            // location: status.location,
            notes: status.notes
          })),
          consignees: consigneeOrders.map(co => ({
            cid: co.cid,
            Consigneename: co.Consigneename,
            Bookingdate: co.orderDate,
            To: `${co.consigneeedistrict}, ${co.consigneepin.slice(7)}`,
            currentStatus: co.cstatus,
            statusHistory: co.statusHistory.map(status => ({
              status: status.status,
              timestamp: status.timestamp,
              // location: status.location,
              notes: status.notes
            }))
          }))
        };
  
        res.json(trackingData);
      } else if (orderId.startsWith("CID")) {
        // Track by cid
        const consignee = await Ordermaster.findOne({ cid: orderId });
        if (!consignee) {
          return res.status(404).json({ message: "Consignee tracking ID not found" });
        }
  
        // Fetch parent order for additional context
        const order = await Order.findOne({ orderId: consignee.Coorderid });
  
        const trackingData = {
          cid: consignee.cid,
          orderId: consignee.Coorderid,
          consigner: order ? order.ConsignerName : "Unknown",
          Consigneename: consignee.Consigneename,
          currentStatus: consignee.cstatus,
          From: order ? `${order.consignerdistrict}, ${order.consignerpincode.slice(7)}` : "Unknown",
          To: `${consignee.consigneeedistrict}, ${consignee.consigneepin.slice(7)}`,
          Packages: consignee.packages,
          statusHistory: consignee.statusHistory.map(status => ({
            status: status.status,
            timestamp: status.timestamp,
            // location: status.location,
            notes: status.notes
          }))
        };
  
        res.json(trackingData);
      } else {
        return res.status(400).json({ message: "Invalid tracking ID format" });
      }
    } catch (error) {
      console.error("Track Error:", error);
      res.status(500).json({ message: "Server Error", error });
    }
  };