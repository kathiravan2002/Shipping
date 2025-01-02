const express = require("express");
const router = express.Router();
const Order = require("../models/orderschema");

//create(post)
// router.post("/createorder" , async (req ,res) => {
//     const {orderId ,orderDate} = req.body;
//     console.log(req.body)
//     try{
//         const neworder = new Order({
//             orderId,
//             orderDate,
//         });
        
//         const savedorder = await neworder.save();
//         console.log(savedorder);
//         res.status(201).json(savedorder);
//     }catch (err) {
//         console.error(err);
//         res.status(500).json({ error: err.message })
//     }
// })

router.post("/createorder" , async (req ,res ) => {
    console.log(req.body)
    try{ 
        const savedorder = await new Order(req.body).save();
        console.log(savedorder);
        res.send(savedorder);
    }catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message })
    }
})


//read(getall)
router.get("/getorder" ,async (req ,res)  => {
    try{
        const orders = await Order.find();
        res.send(orders);
    }catch (err) {
        console.error(err);
        // res.status(500).json({ error: err.message });
    }
}) 

router.get("/", async (req, res) => {
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
});


//readone(getone)
router.get("/:id" , async (req ,res) => {
    try{
        const ordered = await Order.findById(req.params.id);
        res.json(ordered);
    }catch (err) {
        console.error(err);
        // res.status(500).json({ error: err.message })
    }
})

//update(put)
router.put("/:id" , async (req ,res) => {
    try{
        const updateorder = await Order.findByIdAndUpdate(
            req.params.id ,
            req.body,
            //   {contact},
           {new : true }
        );
        res.json(updateorder);
    }catch(err){
        console.error(err);
        // res.status(500).json({ error: err.message})
    }
})

//Delete(delete)
router.delete("/:id" , async (req ,res) => {
    try{
        const deleteOrder = await Order.findByIdAndDelete(req.params.id);
        // res.json(deleteOrder);
       res.status(200).json({deleteOrder : " Deleted successfully"});
    }catch(err){
        console.error(err)
       res.status(500).json({ error: err.message})
    }
})


module.exports = router;