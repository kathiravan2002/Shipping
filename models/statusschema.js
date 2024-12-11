const mongoose = require("mongoose")

const statusschema = mongoose.Schema({

    currentstatus : {
          type :String,
          required:true,

    }
})

const status = mongoose.model("status" ,statusschema);
module.exports = status;