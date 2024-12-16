import React, { useState } from "react";

const Addorder = () => {
  const [currentStep, setCurrentStep] = useState(1); // Track form step
  const [showPopup, setShowPopup] = useState(false); // State for popup visibility
  const [formData, setFormData] = useState({
    ConsignerName: "",
    consignermobileNumber: "",
    consignerAddress: "",
    consignermail: "",
    consignerdistrict: "",
    consignerstate: "TamilNadu",
    consignerpincode: "",
    Consigneename: "",
    consigneemobileno: "",
    consigneealterno: "",
    consigneedistrict: "",
    consigneeaddress: "",
    consigneestate: "TamilNadu",
    consigneepin: "",
    productname: "",
    packageWeight: "", // Updated dynamically
    packagetype: "",
    price :"",
  });
  console.log(formData);

  // Volumetric weight states
const [length, setLength] = useState('');
const [width, setWidth] = useState('');
const [height, setHeight] = useState('');
const [volumetricWeight, setVolumetricWeight] = useState(null);

// Function to calculate volumetric weight
const calculateVolumetricWeight = () => {
  if (length && width && height) {
    const volumetric = (length * width * height) / 5000;
    setVolumetricWeight(volumetric.toFixed(2));
    // setFormData((prev) => ({ ...prev, packageWeight: volumetric.toFixed(2) }));
  } else {
    alert("Please enter valid dimensions.");
  }
};

  // Function to go to the next step
  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
  };

  // Function to go to the previous step
  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };

  // Function to handle form submission
  const handleSubmit = () => {
    // Validation for each step
    
      if (!formData.ConsignerName || !formData.consignermobileNumber || !formData.consignerAddress || !formData.consignerdistrict || !formData.consignerstate || !formData.consignerpincode || !formData.Consigneename || !formData.consigneemobileno || !formData.consigneealterno || !formData.consigneedistrict || !formData.consigneeaddress || !formData.consigneestate   || !formData.consigneepin  || !formData.productname || !formData.packageWeight) {
        alert("Please fill all required  Details.");
        return;
      }
   
    setShowPopup(true); // Show popup
    setTimeout(() => {
      setShowPopup(false); // Hide popup after 3 seconds
    }, 1000);
  };

  
  // Handle form data change
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      let updatedData = { ...prev, [name]: value };

      // Update price dynamically when weight changes
      if (name === "packageWeight") {
        const price = calculatePrice (value);
        updatedData = { ...updatedData, price };
      }

      return updatedData;
    });
  };



  // Updated function to calculate price based on weight ranges
  const calculatePrice = (weight) => {
    if (!weight || isNaN(weight) || weight <= 0) {
      return 0; // Invalid weight or not provided
    }

    weight = parseFloat(weight); // Ensure weight is treated as a number

    if (weight <= 1) {
      return "₹40"; // Up to 1kg
    } else if (weight > 1 && weight <= 2) {
      return "₹80"; // 1 to 2kg
    } else if (weight > 2 && weight <= 5) {
      return "₹120"; // 2 to 5kg
    } else if (weight > 5 && weight <= 10) {
      return "₹360"; // 5 to 10kg
    } else if (weight > 10 && weight <= 20) {
      return "₹600"; // 10 to 20kg
    } else {
      return "₹1000"; // Above 20kg
    }
  };
 


  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow md shadow-violet-700 rounded-lg">
      {/* Step Indicator */}
      <div className="flex justify-between mb-6">
        <div
          className={`step ${currentStep === 1 && "font-bold font-serif text-purple-600"}`}
        >
          1.Consigner Details
        </div>
        <div
          className={`step ${currentStep === 2 && "font-bold font-serif text-purple-600"}`}
        >
          2.Consignee Details
        </div>
        <div
          className={`step ${currentStep === 3 && "font-bold font-serif text-purple-600"}`}
        >
          3.Product Details
        </div>
      </div>

      {/* Step 1: consigner Details */}
      {currentStep === 1 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Add Consigner Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="ConsignerName"
              value={formData.ConsignerName}
              onChange={handleInputChange}
              placeholder="Consigner Name"
              required
              className="p-2 border rounded w-full"
            />
            <input
              type="tel"
              name="consignermobileNumber"
              value={formData.consignermobileNumber}
              onChange={handleInputChange}
              placeholder="Mobile Number"
              required
              className="p-2 border rounded w-full"
            />
            <input
              type="text"
              name="consignerAddress"
              value={formData.consignerAddress}
              onChange={handleInputChange}
              placeholder="Complete Address"
              className="p-2 border rounded w-full col-span-2"
            />
            <input
              type="email"
              name="consignermail"
              value={formData.consignermail}
              onChange={handleInputChange}
              placeholder="Email (optional)"
              className="p-2 border rounded w-full "
            />   
             <input
              name="consignerpincode"
              value={formData.consignerpincode}
              onChange={handleInputChange}
              placeholder="Pincode"
              className="p-2 border rounded w-full "
            />
            {/* <input
              name="consignerdistrict"
              value={formData.consignerdistrict}
              onChange={handleInputChange}
              placeholder="District"
              className="p-2 border rounded w-full "
            /> */}

           <select
                id="consignerdistrict"
                name="consignerdistrict"
                value={formData.consignerdistrict}
                onChange={handleInputChange}
                className="p-2 border rounded-lg text-sm"
            >
              <option >Select District</option>
              <option>Ariyalur</option>
              <option >Chengalpattu</option>
              <option >Chennai</option>
              <option >Coimbatore</option>
              <option >Cuddalore</option>
              <option >Dharmapuri</option>
              <option >Dindigul</option>
              <option >Erode</option>
              <option >Kallakurichi</option>
              <option >Kancheepuram</option>
              <option >Kanyakumari</option>
              <option >Karur</option>
              <option >Krishnagiri</option>
              <option >Madurai</option>
              <option >Mayiladuthurai</option>
              <option >Nagapattinam</option>
              <option >	Namakkal</option>
              <option >Nilgiris</option>
              <option >Perambalur</option>
              <option >Pudukkottai</option>
              <option >Ramanathapuram</option>
              <option >	Ranipet</option>
              <option >	Salem</option>
              <option >Sivaganga</option>
              <option >Tenkasi</option>
              <option >Thanjavur</option>
              <option >Theni</option>
              <option >Thoothukudi</option>
              <option >Tiruchirappalli</option>
              <option >Tirunelveli</option>
              <option >Tirupathur</option>
              <option >Tiruppur</option>
              <option >Tiruvallur</option>
              <option >Tiruvannamalai</option>
              <option >Tiruvarur</option>
              <option >Vellore</option>
              <option >Viluppuram</option>
              <option >Virudhunagar</option>
            </select>
         
             <input
              name="consignerstate"
              value={formData.consignerstate}
              onChange={handleInputChange}
              placeholder="State"
              className="p-2 border rounded w-full "
            />
          
          
          </div>
        </div>
      )}

      {/* Step 2: Consignee details */}
      {currentStep === 2 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Consignee Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="Consigneename"
              value={formData.Consigneename}
              onChange={handleInputChange}
              placeholder="Consignee Name"
         
              className="p-2 border rounded w-full col-span-2"
            />
            <input
              type="tel"
              name="consigneemobileno"
              value={formData.consigneemobileno}
              onChange={handleInputChange}
              placeholder="Mobile No"
              required
              className="p-2 border rounded w-full"
            />
             <input
              type="tel"
              name="consigneealterno"
              value={formData.consigneealterno}
              onChange={handleInputChange}
              placeholder="Alternate Mobile No"
              required
              className="p-2 border rounded w-full"
            />
         
          
             <input
              type="text"
              name="consigneeaddress"
              value={formData.consigneeaddress}
              onChange={handleInputChange}
              placeholder="Complete Address"
              required
              className="p-2 border rounded w-full col-span-2"
            /> 
                <input
              name="consigneepin"
              value={formData.consigneepin}
              onChange={handleInputChange}
              placeholder="Pincode"
              className="p-2 border rounded w-full "
            />
             {/* <input
              name="consigneedistrict"
              value={formData.consigneedistrict}
              onChange={handleInputChange}
              placeholder="District"
              className="p-2 border rounded w-full "
            /> */}
            <select
                id="consigneedistrict"
                name="consigneedistrict"
                value={formData.consigneedistrict}
                onChange={handleInputChange}
                className="p-2 border rounded-lg text-sm"
            >
              <option >Select District</option>
              <option>Ariyalur</option>
              <option >Chengalpattu</option>
              <option >Chennai</option>
              <option >Coimbatore</option>
              <option >Cuddalore</option>
              <option >Dharmapuri</option>
              <option >Dindigul</option>
              <option >Erode</option>
              <option >Kallakurichi</option>
              <option >Kancheepuram</option>
              <option >Kanyakumari</option>
              <option >Karur</option>
              <option >Krishnagiri</option>
              <option >Madurai</option>
              <option >Mayiladuthurai</option>
              <option >Nagapattinam</option>
              <option >	Namakkal</option>
              <option >Nilgiris</option>
              <option >Perambalur</option>
              <option >Pudukkottai</option>
              <option >Ramanathapuram</option>
              <option >	Ranipet</option>
              <option >	Salem</option>
              <option >Sivaganga</option>
              <option >Tenkasi</option>
              <option >Thanjavur</option>
              <option >Theni</option>
              <option >Thoothukudi</option>
              <option >Tiruchirappalli</option>
              <option >Tirunelveli</option>
              <option >Tirupathur</option>
              <option >Tiruppur</option>
              <option >Tiruvallur</option>
              <option >Tiruvannamalai</option>
              <option >Tiruvarur</option>
              <option >Vellore</option>
              <option >Viluppuram</option>
              <option >Virudhunagar</option>
            </select>
           
            <input
              type="text"
              name="consigneestate"
              value={formData.consigneestate}
              onChange={handleInputChange}
              placeholder="State"
              required
              className="p-2 border rounded w-full"
            />
           
          </div>
        </div>
      )}

      {/* Step 3: Product Details */}
      {currentStep === 3 && (
  <div>
    <h2 className="text-lg font-semibold mb-4">Product Details</h2>
    <div className="grid grid-cols-2 gap-4">
      <input
        type="text"
        name="productname"
        value={formData.productname}
        onChange={handleInputChange}
        placeholder="Product Name"
        required
        className="p-2 border rounded w-full col-span-2"
      />
    

      {/* Volumetric Weight Calculator Inputs */}
      <div className="col-span-2">
        <h3 className="text-md font-semibold mb-2">Calculate Volumetric Weight</h3>
        <div className="grid grid-cols-3 gap-2">
          <input
            type="number"
            placeholder="Length (cm)"
            value={length}
            onChange={(e) => setLength(e.target.value)}
            className="p-2 border rounded w-full"
          />
          <input
            type="number"
            placeholder="Width (cm)"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            className="p-2 border rounded w-full"
          />
          <input
            type="number"
            placeholder="Height (cm)"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="p-2 border rounded w-full"
          />
        </div>
        <button
          onClick={calculateVolumetricWeight}
          className="bg-purple-600 text-white px-4 py-2 rounded mt-2"
        >
          Calculate Volumetric Weight
        </button>
        {volumetricWeight && (
          <p className="mt-2 text-sm text-gray-600">
            Calculated Volumetric Weight: {volumetricWeight} kg
          </p>
        )}
      </div>
      <input
        type="text"
        name="packageWeight"
        value={formData.packageWeight}
        onChange={handleInputChange}
        placeholder="Package Weight (kg)"
    
        className="p-2 border rounded w-full"
      />
        {/* Price */}
         <input
          type="text"
          name="price"
          value={formData.price}
          onChange={handleInputChange}
          placeholder="Price (₹)"
          className="p-2 border rounded w-full"
        />

      <textarea
        name="packagetype"
        value={formData.packagetype}
        onChange={handleInputChange}
        placeholder="Packaging Type"
        className="p-2 border rounded w-full col-span-2"
      ></textarea>
    </div>
  </div>
)}

      {/* Navigation Buttons */}
      <div
        className={`flex mt-6 ${currentStep === 1 ? "justify-end" : "justify-between"}`}
      >
        {currentStep > 1 && (
          <button
            onClick={handlePrevious}
            className="bg-gradient-to-r from-purple-600 to-green-500 text-white px-4 py-2 rounded transition duration-100 hover:from-green-500 hover:to-purple-600"
          >
            Previous
          </button>
        )}
        {currentStep < 3 ? (
          <button
            onClick={handleNext}
            className="bg-gradient-to-r from-purple-600 to-green-500 text-white px-4 py-2 rounded transition duration-100 hover:from-green-500 hover:to-purple-600"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-purple-600 to-green-500 text-white px-4 py-2 rounded transition duration-100 hover:from-green-500 hover:to-purple-600"
          >
            Submit
          </button>
        )}
      </div>

      {/* Success Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gradient-to-r from-purple-600 to-green-500 p-4 rounded shadow-md text-center">
            <h2 className="text-lg font-semibold text-white">
              Successfully Submitted!
            </h2>
            
          </div>
        </div>
      )}
    </div>
  );
};

export default Addorder;



// import axios from "axios";
// import React, { useState } from "react";

// const AddOrder = () => {
//   const [formData, setFormData] = useState({
//     orderId: "",
//     orderDate: "",
//     customerName: "",
//     contact: "",
//     productName: "",
//     quantity: "",
//     paymentMethod: "",
//     amountPaid: "",
//     status: "",
//   });

//   const [showPopup, setShowPopup] = useState(false); // State to manage popup visibility

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.orderId || !formData.customerName || !formData.productName) {
//       alert("Please fill in all required fields!");
//       return;
//     }

//     try {
//       console.log(formData);
//       const response = await axios.post(
//         "http://192.168.29.11:5000/api/order/createorder",
//         formData
//       );

//       console.log(response.data);

//       setShowPopup(true); // Show the popup
//       setTimeout(() => setShowPopup(false), 1000); // Hide the popup after 3 seconds
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };

//   return (
//     <div className="bg-white p-6 rounded-lg shadow-md shadow-violet-700">
//       <h1 className="text-2xl font-bold text-gray-800 mb-4">Add Order</h1>
//       <form onSubmit={handleSubmit}>
//         {/* Order Details */}
//         <section className="mb-4">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 ">
//             {/* Order Details */}
//             <div className="p-4 border rounded-lg ">
//               <h2 className="text-lg font-semibold text-gray-700 mb-2">
//                 Order Details
//               </h2>
//               <div className="flex flex-col gap-2 ">
//                 <input
//                   type="text"
//                   id="orderId"
//                   name="orderId"
//                   placeholder="Order ID"
//                   className="w-full p-1.5 border rounded-lg text-sm"
//                   value={formData.orderId}
//                   onChange={handleChange}
//                 />
//                 <input
//                   type="date"
//                   id="orderDate"
//                   name="orderDate"
//                   className="w-full p-1.5 border rounded-lg text-sm"
//                   value={formData.orderDate}
//                   onChange={handleChange}
//                 />
//               </div>
//             </div>

//             {/* Customer Details */}
//             <div className="p-4 border rounded-lg">
//               <h2 className="text-lg font-semibold text-gray-700 mb-2">
//                 Customer Details
//               </h2>
//               <div className="flex flex-col gap-2">
//                 <input
//                   type="text"
//                   id="customerName"
//                   name="customerName"
//                   placeholder="Customer Name"
//                   className="w-full p-1.5 border rounded-lg text-sm"
//                   value={formData.customerName}
//                   onChange={handleChange}
//                 />
//                 <input
//                   type="text"
//                   id="contact"
//                   name="contact"
//                   placeholder="Phone No."
//                   className="w-full p-1.5 border rounded-lg text-sm"
//                   value={formData.contact}
//                   onChange={handleChange}
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
//             {/* Product Details */}
//             <div className="p-4 border rounded-lg">
//               <h2 className="text-lg font-semibold text-gray-700 mb-2">
//                 Product Details
//               </h2>
//               <div className="flex flex-col gap-2">
//                 <input
//                   type="text"
//                   id="productName"
//                   name="productName"
//                   placeholder="Product Name"
//                   className="w-full p-1.5 border rounded-lg text-sm"
//                   value={formData.productName}
//                   onChange={handleChange}
//                 />
//                 <input
//                   type="text"
//                   id="quantity"
//                   name="quantity"
//                   placeholder="Quantity"
//                   className="w-full p-1.5 border rounded-lg text-sm"
//                   value={formData.quantity}
//                   onChange={handleChange}
//                 />
//               </div>
//             </div>

//             {/* Payment Details */}
//             <div className="p-4 border rounded-lg">
//               <h2 className="text-lg font-semibold text-gray-700 mb-2">
//                 Payment
//               </h2>
//               <input
//                 type="text"
//                 id="amountPaid"
//                 name="amountPaid"
//                 placeholder="Amount Paid"
//                 className="w-full p-1.5 border rounded-lg text-sm"
//                 value={formData.amountPaid}
//                 onChange={handleChange}
//               />
//             </div>
//           </div>

//           <div className="mt-4 p-4 border rounded-lg">
//             {/* Status */}
//             <h2 className="text-lg font-semibold text-gray-700 mb-2">
//               Current Status
//             </h2>
//             <select
//               id="status"
//               name="status"
//               className="w-full p-1.5 border rounded-lg text-sm"
//               value={formData.status}
//               onChange={handleChange}
//             >
//               <option value="">Select Status</option>
//               <option value="active">Order Placed</option>
//               <option value="pending">Shipped</option>
//               <option value="delivered">Out for delivery</option>
//               <option value="shipped">Delivered</option>
//             </select>
//           </div>
//         </section>
//         {/* Submit Button */}{" "}
//         <section className="mt-4">
//           <button
//             type="submit"
//             className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600"
//           >
//             Submit
//           </button>
//         </section>
//       </form>

//       {/* Success Popup */}
//       {showPopup && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white p-6 rounded shadow-md text-center">
//             <p className="text-lg font-semibold text-gray-950">
//               Successfully Submitted!
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AddOrder;
