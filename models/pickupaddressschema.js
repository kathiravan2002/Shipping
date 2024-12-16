const mongoose = require("mongoose")

const pickupaddressschema = mongoose.Schema({

    currentstatus : {
          type :String,
          required:true,

    }
})

const address = mongoose.model("address" ,pickupaddressschema);
module.exports = address;