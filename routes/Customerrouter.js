
const express = require("express");
const router = express.Router();
const Customer = require("../models/customerschema"); // Correctly import the model

// Create (POST)
router.post("/", async (req, res) => {
    const { cname, ccontact } = req.body;

    try {
        // Create a new instance of Customer
        const newCustomer = new Customer({
            cname,
            ccontact,
        });

        // Save to the database
        const savedCustomer = await newCustomer.save();

        console.log(savedCustomer);
        res.status(201).json(savedCustomer);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Read All (GET)
router.get("/", async (req, res) => {
    try {
        const customers = await Customer.find();
        res.status(200).json(customers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Read One (GET by ID)
router.get("/:id", async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        res.status(200).json(customer);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Update (PUT)
router.put("/:id", async (req, res) => {
    const { cname, ccontact } = req.body;

    try {
        const updatedCustomer = await Customer.findByIdAndUpdate(
            req.params.id,
            { cname, ccontact },
            { new: true }
        );

        res.status(200).json(updatedCustomer);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Delete (DELETE)
router.delete("/:id", async (req, res) => {
    try {
        const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
        res.status(200).json(deletedCustomer);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;


