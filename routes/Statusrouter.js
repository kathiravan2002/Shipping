const express = require("express");
const router = express.Router();
const Status = require("../models/statusschema");
 
//create(post)
router.post("/" , async (req ,res) => {
    const {currentstatus} = req.body;
    try{
        const newstatus = new Status({
            currentstatus,
         });
        
        const savestatus = await newstatus.save();
        console.log(savestatus);
        res.status(201).json(savestatus);
    }catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message })
    }
})

//read(getall)
router.get("/" ,async (req ,res)  => {
    try{
        const statusget = await Status.find();
        res.status(201).json(statusget);
    }catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
}) 

//readone(getone)
router.get("/:id" , async (req ,res) => {
    try{
        const status = await Status.findById(req.params.id);
        res.status(201).json(status);
    }catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message })
    }
})

//update(put)
router.put("/:id" , async (req ,res) => {
    try{
        const updatestatus = await Status.findByIdAndUpdate(
            req.params.id ,
            {currentstatus},
            {new : true }
        );
        res.status(201).json(updatestatus);
    }catch(err){
        console.error(err);
        res.status(500).json({ error: err.message})
    }
})

//Delete(delete)
router.delete("/:id" , async (res ,req) => {
    try{
        const deletestatus = await Status.findByIdAndDelete(req,params.id);
        res.status(201).json(deletestatus);
    }catch(err){
        console.error(err)
        res.status(500).json({ error: err.message})
    }
})


module.exports = router;