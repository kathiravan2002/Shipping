const express = require("express");
const router = express.Router();
const product = require("../models/productschema");
//create
router.post("/", async (req, res) => {
    const { name, qty } = req.body
    try {
        let Product = new product({
            name,
            qty,
           
        });
        Product = await Product.save();
        console.log(Product)
        res.json(Product)
    } catch (err) {
        console.log(err)
        res.status(500).json(err.message)
    }
})
//read
router.get("/", async(req, res) => {
    const products = await product.find();
    res.status(200).json(products)
    console.log(products)
    
})
//read one
router.get("/:id", async (req, res) => {
    const productone = await product.findById(req.params.id);
    res.status(200).json(productone)
    console.log(productone)

})
//update
router.put("/:id", async (req, res) => {
    const { id, name, qty} = req.body;
    try{
        const producttwo = await product.findByIdAndUpdate(
             id,
             {name, qty},
             {new: true}
        )
        res.json(producttwo);
        console.log(producttwo)
    }catch(err) {
        res.status(500).json(err.message)
    }
})
//delete
router.delete("/:id", async (req, res) => {
    try{
        const productthree= await product.findByIdAndDelete(
            req.params.id
        )
        res.json(productthree);
    }catch(err){
        res.status(500).json(err.message)
    }
    
})

module.exports = router; 