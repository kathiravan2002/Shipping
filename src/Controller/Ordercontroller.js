
import Order from "../models/orderschema.js"

export const createorder = async (req ,res ) => {
    console.log(req.body)
    try{ 
        const savedorder = await new Order(req.body).save();
        console.log(savedorder);
        res.send(savedorder);
    }catch (err) {
        console.error(err);
    }
}

export const getorder = async (req ,res)  => {
    try{
        const orders = await Order.find();
        res.send(orders);
    }catch (err) {
        console.error(err);
        // res.status(500).json({ error: err.message });
    }
}

export const searchorder =  async (req, res) => {
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
                { SKU: { $regex: search, $options: "i" } }, // Example SKU field
                { pickupId: { $regex: search, $options: "i" } }, // Example Pickup ID field
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


export const getid =  async (req ,res) => {
    try{
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.json(order);
    }catch (err) {
        console.error(err);
        // res.status(500).json({ error: err.message })
    }
}

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


  export const updateorder = async (req, res) => { 
    const updateOrder = await Order.findByIdAndUpdate( req.params.id,  req.body, { new: true }  ); 
    if (!updateOrder) {
        return res.status(404).json({ message: "Order not found" });
    } 
    res.json(updateOrder); 
}

export const deleteorder = async (req, res) => {
    try { 
        const deleteOrder = await Order.findByIdAndDelete(req.params.id); 
         
        res.status(200).json({ message: "Deleted successfully" });
    } catch (err) {
        console.error(err); 
        res.status(500).json({ error: err.message });
    }
}
 