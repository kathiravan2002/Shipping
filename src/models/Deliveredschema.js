import mongoose from "mongoose";

const Deliveredschema =  mongoose.Schema({

    orderId: String,
    image:String,
 

})

const uploads = mongoose.model("delivered", Deliveredschema);
export default uploads;