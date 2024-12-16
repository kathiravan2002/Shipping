const express = require("express");
const router = express.Router();
const Payment = require("../models/paymentschema")
//create(post)

router.post("/" , async (req ,res) => {
    const { amountpaid} = req.body;
    try{
        const newpayment = new Payment({
            
            amountpaid,
        });
        
        const savepayment = await newpayment.save();
        console.log(savepayment);
        res.status(201).json(savepayment);
    }catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message })
    }
})

//readall(get)

router.get("/" ,async (req ,res)  => {
    try{
        const payments = await Payment.find();
        res.status(201).json(payments);
    }catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
}) 
//readone(get one)

router.get("/:id" , async (req ,res) => {
    try{
        const payment = await Payment.findById(req.params.id);
        res.status(201).json(payment);
    }catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message })
    }
})

//update(put)
router.put("/:id" , async (res ,req) => {
    try{
        const updatepayment = await Payment.findByIdAndUpdate(
            req.params.id ,
            {amountpaid },
            {new : true }
        );
        res.status(201).json(updatepayment);
    }catch(err){
        console.error(err);
        res.status(500).json({ error: err.message})
    }
})

//Delete(delete)
router.delete("/:id" , async (res ,req) => {
    try{
        const deletepayment = await Payment.findByIdAndDelete(req,params.id);
        res.status(201).json(deletepayment);
    }catch(err){
        console.error(err)
        res.status(500).json({ error: err.message})
    }
})


module.exports = router;