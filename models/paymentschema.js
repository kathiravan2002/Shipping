const mongoose = require("mongoose")

const paymentschema = mongoose.Schema({


    amountpaid: {
        type: Number,
        requird:true,
    }
})

const payment = mongoose.model("payment" ,paymentschema);
module.exports = payment;