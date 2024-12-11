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

//readone(getone)
router.get("/:id" , async (res ,req) => {
    try{
        const order = await Order.findById(req.params.id);
        res.json(order);
    }catch (err) {
        console.error(err);
        // res.status(500).json({ error: err.message })
    }
})

//update(put)
router.put("/:id" , async (res ,req) => {
    try{
        const updateorder = await Order.findByIdAndUpdate(
            req.params.id ,
            {orderid ,orderdate},
            {new : true }
        );
        res.json(updateorder);
    }catch(err){
        console.error(err);
        // res.status(500).json({ error: err.message})
    }
})

//Delete(delete)
router.delete("/:id" , async (res ,req) => {
    try{
        const deleteorder = await Order.findByIdAndDelete(req,params.id);
        // res.status(201).json(deleteorder);
    }catch(err){
        console.error(err)
        // res.status(500).json({ error: err.message})
    }
})


module.exports = router;