const express = require("express");
const router = express.Router();
const address = require("../models/pickupaddressschema")


//create(post)
router.post("/" , async (req ,res) => {
    const {Pickupaddress} = req.body;
    try{
        const newaddress = new address({
            Pickupaddress,
         });
        
        const saveaddress = await newaddress.save();
        console.log(saveaddress);
        res.status(201).json(saveaddress);
    }catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message })
    }
})

//read(getall)
router.get("/" ,async (req ,res)  => {
    try{
        const addressget = await Address.find();
        res.status(201).json(addressget);
    }catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
}) 

//readone(getone)
router.get("/:id" , async (req ,res) => {
    try{
        const address = await Status.findById(req.params.id);
        res.status(201).json(address);
    }catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message })
    }
})

//update(put)
router.put("/:id" , async (req ,res) => {
    try{
        const updateaddress = await Address.findByIdAndUpdate(
            req.params.id ,
            {pickupaddress},
            {new : true }
        );
        res.status(201).json(updateaddress);
    }catch(err){
        console.error(err);
        res.status(500).json({ error: err.message})
    }
})

//Delete(delete)
router.delete("/:id" , async (res ,req) => {
    try{
        const deleteaddress = await Address.findByIdAndDelete(req,params.id);
        res.status(201).json(deleteaddress);
    }catch(err){
        console.error(err)
        res.status(500).json({ error: err.message})
    }
})


module.exports = router;