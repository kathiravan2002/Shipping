import Order from "../models/orderschema.js";


export const track = async (req, res) => {
    try {
        const order = await Order.findOne({ orderId: req.params.orderId });
        if (!order) {
            return res.status(404).json({ message: "Tracking ID not found" });
        }
        res.json({
            orderId: order.orderId,
            consigner: order.ConsignerName,
            consignee: order.Consigneename,
            currentStatus: order.Orderstatus,
            Bookingdate: order.orderDate,
            From: `${order.consignerdistrict} , ${order.consignerpincode}` ,
            To: `${order.consigneedistrict}, ${order.consigneepin}`,  
            Packages: order.noofpackage,
            Consignment: order.consigneedistrict,
            statusHistory: order.statusHistory.map(status => ({
                status: status.status,
                timestamp: status.timestamp,
                // location: status.location,
                notes: status.notes
            }))
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error", error });
    }
};