const mongoose = require("mongoose");


const CustomerSchema = mongoose.Schema({
    cname: {
        type: String,
        required: true,
        
    },
    ccontact: {
        type: Number,
        required: true,

    }
})

const customer = mongoose.model("customer", CustomerSchema);
module.exports = customer;