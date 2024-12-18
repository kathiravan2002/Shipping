import React, { useState, useEffect } from "react";

const Addorder = () => {
  const [formData, setFormData] = useState({
    ConsignerName: "",
    consignermobileNumber: "",
    consignerAddress: "",
    consignermail: "",
    consignerdistrict: "",
    consignerstate: "",
    consignerpincode: "",
    Consigneename: "",
    consigneemobileno: "",
    consigneealterno: "",
    consigneedistrict: "",
    consigneeaddress: "",
    consigneestate: "",
    consigneepin: "",
    productname: "",
    packageWeight: "",
    packagetype: "",
    price: "",
  });

  const [districts, setDistricts] = useState([]);
  const [pincodes, setPincodes] = useState([]);
  const [apiData, setApiData] = useState([]);

  // Fetch data from the API on component mount
  useEffect(() => {
    fetch("https://api.data.gov.in/resource/5c2f62fe-5afa-4119-a499-fec9d604d5bd?api-key=579b464db66ec23bdd0000019029558117064dd17c6931b0f89fb6ba&format=json&filters[statename]=Tamil Nadu&limit=40000")
      .then((response) => response.json())
      .then((data) => {
        setApiData(data.records); // Store full API data to use for filtering
        console.log(data.records); // Log the full records to check the dataset
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // Get unique states from API data
  const states = [...new Set(apiData.map((item) => item.statename))];
  console.log("States:", states); // Log all the unique states

  // Update districts based on selected state
  useEffect(() => {
    if (formData.consignerstate) {
      const filteredDistricts = apiData
        .filter((item) => item.statename === formData.consignerstate) // Filter based on state
        .map((item) => item.district);
      setDistricts([...new Set(filteredDistricts)]); // Remove duplicates
    }
  }, [formData.consignerstate, apiData]);

  // Update pincodes based on selected district
  useEffect(() => {
    if (formData.consignerdistrict) {
      const filteredPincodes = apiData
        .filter((item) => item.district === formData.consignerdistrict)
        .map((item) => ({
          pincode: item.pincode,
          officename: item.officename,
        }));
      setPincodes(filteredPincodes);
    }
  }, [formData.consignerdistrict, apiData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
        let updatedData = { ...prev, [name]: value };
  
        if (name === "packageWeight") {
          const price = calculatePrice(value);
          updatedData = { ...updatedData, price };
        }
        return updatedData;
      });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.ConsignerName || !formData.consignermobileNumber || !formData.consignerAddress || !formData.consignerdistrict || !formData.consignerstate || !formData.consignerpincode || !formData.Consigneename || !formData.consigneemobileno || !formData.consigneeaddress || !formData.consigneedistrict || !formData.consigneestate || !formData.consigneepin || !formData.productname || !formData.packageWeight) {
          alert("Please fill all required details.");
          return;
        }
        alert("Form submitted successfully!");
      };
    
      const [length, setLength] = useState('');
      const [width, setWidth] = useState('');
      const [height, setHeight] = useState('');
      const [volumetricWeight, setVolumetricWeight] = useState(null);
      
  const calculateVolumetricWeight = () => {
    if (length && width && height) {
      const volumetric = (length * width * height) / 5000;
      setVolumetricWeight(volumetric.toFixed(2));
    } else {
      alert("Please enter valid dimensions.");
    }
  };

  const calculatePrice = (weight) => {
    if (!weight || isNaN(weight) ) {
      return 0;
    }

    weight = parseFloat(weight);

    if (weight <= 1 && weight==0 ) {
      return "₹40";
    } else if (weight > 1 && weight <= 2) {
      return "₹80";
    } else if (weight > 2 && weight <= 5) {
      return "₹120";
    } else if (weight > 5 && weight <= 10) {
      return "₹360";
    } else if (weight > 10 && weight <= 20) {
      return "₹600";
    } else { 
      return "₹1000";
    }
  };

    console.log(formData);

  return (
    <div className="max-w-full mx-auto p-4 bg-white shadow-lg shadow-purple-300 rounded-lg">
      <h1 className="text-center text-2xl font-semibold mb-10">Order Details</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-3 lg:grid-cols-3 md:grid-cols-3 gap-4 text-sm">
        {/* Consigner Details */}
        <div className="col-span-3 lg:col-span-1 md:col-span-1">
          <h2 className="font-semibold text-xl mb-6">1. Consigner Details</h2>
          <input
            type="text"
            name="ConsignerName"
            value={formData.ConsignerName}
            onChange={handleInputChange}
            placeholder="Consigner Name"
            className="w-full p-4 border rounded mb-2"
          />
          <input
            type="tel"
            name="consignermobileNumber"
            value={formData.consignermobileNumber}
            onChange={handleInputChange}
            placeholder="Mobile Number"
            className="w-full p-4 border rounded mb-2"
          />
           <input type="text" name="consignerAddress" value={formData.consignerAddress} onChange={handleInputChange} placeholder="Address" className="w-full p-4 border rounded mb-2" />
          <input type="email" name="consignermail" value={formData.consignermail} onChange={handleInputChange} placeholder="Email (optional)" className="w-full p-4 border rounded mb-2" />
           
     
          
          {/* State Dropdown */}
          <select
            name="consignerstate"
            value={formData.consignerstate}
            onChange={handleInputChange}
            className="w-full p-4 border rounded mb-2"
          >
            <option value="">Select State</option>
            {states.length > 0 ? (
              states.map((state, idx) => (
                <option key={idx} value={state}>
                  {state}
                </option>
              ))
            ) : (
              <option>No states available</option>
            )}
          </select>
          
          {/* District Dropdown */}
          <select
            name="consignerdistrict"
            value={formData.consignerdistrict}
            onChange={handleInputChange}
            className="w-full p-4 border rounded mb-2"
          >
            <option value="">Select District</option>
            {districts.length > 0 ? (
              districts.map((district, idx) => (
                <option key={idx} value={district}>
                  {district}
                </option>
              ))
            ) : (
              <option>No districts available</option>
            )}
          </select>

          {/* Pincode Dropdown */}
          <select
            name="consignerpincode"
            value={formData.consignerpincode}
            onChange={handleInputChange}
            className="w-full p-4 border rounded mb-2"
          >
            <option value="">Select Pincode</option>
            {pincodes.length > 0 ? (
              pincodes.map((pincode, idx) => (
                <option key={idx} value={`${pincode.pincode}-${pincode.officename}`}>
                  {pincode.pincode} - {pincode.officename}
                </option>
              ))
            ) : (
              <option>No pincodes available</option>
            )}
          </select>
        </div>


        
        {/* Consignee Details */}
        <div className="col-span-3 lg:col-span-1 md:col-span-1">
          <h2 className="font-semibold  text-xl mb-6">2.Consignee Details</h2>
          <input type="text" name="Consigneename" value={formData.Consigneename} onChange={handleInputChange} placeholder="Consignee Name" className="w-full p-4 border rounded mb-2" />
          <input type="tel" name="consigneemobileno" value={formData.consigneemobileno} onChange={handleInputChange} placeholder="Mobile Number" className="w-full p-4 border rounded mb-2" />
          <input type="tel" name="consigneealterno" value={formData.consigneealterno} onChange={handleInputChange} placeholder="Alternate Mobile No" className="w-full p-4 border rounded mb-2" />
          <input type="text" name="consigneeaddress" value={formData.consigneeaddress} onChange={handleInputChange} placeholder="Address" className="w-full p-4 border rounded mb-2" />  
          
          {/* <input type="text" name="consigneepin" value={formData.consigneepin} onChange={handleInputChange} placeholder="Pincode" className="w-full p-4 border rounded" />
          <input type="text" name="consigneestate" value={formData.consigneestate} onChange={handleInputChange} placeholder="State" className="w-full p-4 border rounded mb-2" />
          <select name="consigneedistrict" value={formData.consigneedistrict} onChange={handleInputChange} className="w-full p-4 border rounded mb-2">
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
            {/* Add other districts */}
          {/* </select> */} 
         
          
          {/* State Dropdown */}
          <select
            name="consigneestate"
            value={formData.consigneestate}
            onChange={handleInputChange}
            className="w-full p-4 border rounded mb-2"
          >
            <option value="">Select State</option>
            {states.length > 0 ? (
              states.map((state, idx) => (
                <option key={idx} value={state}>
                  {state}
                </option>
              ))
            ) : (
              <option>No states available</option>
            )}
          </select>
          
          {/* District Dropdown */}
          <select
            name="consigneedistrict"
            value={formData.consigneedistrict}
            onChange={handleInputChange}
            className="w-full p-4 border rounded mb-2"
          >
            <option value="">Select District</option>
            {districts.length > 0 ? (
              districts.map((district, idx) => (
                <option key={idx} value={district}>
                  {district}
                </option>
              ))
            ) : (
              <option>No districts available</option>
            )}
          </select>

          {/* Pincode Dropdown */}
          <select
            name="consigneepin"
            value={formData.consigneepin}
            onChange={handleInputChange}
            className="w-full p-4 border rounded mb-2"
          >
            <option value="">Select Pincode</option>
            {pincodes.length > 0 ? (
              pincodes.map((pincode, idx) => (
                <option key={idx} value={`${pincode.pincode}-${pincode.officename}`}>
                  {pincode.pincode} - {pincode.officename}
                </option>
              ))
            ) : (
              <option>No pincodes available</option>
            )}
          </select>
        </div>

        {/* Product Details */}
        <div className="col-span-3 lg:col-span-1 md:col-span-1">
          <h2 className="font-semibold  text-xl mb-6">3.Product Details</h2>
          <input type="text" name="productname" value={formData.productname} onChange={handleInputChange} placeholder="Product Name" className="w-full p-4 border rounded mb-2" />
          <div className="grid grid-cols-3 lg:grid-cols-3 gap-2 mb-2">
            <input type="number" placeholder="Length (cm)" value={length} onChange={(e) => setLength(e.target.value)} className="w-full p-4 border rounded lg:col-span-1 col-span-3"/>
            <input type="number" placeholder="Width (cm)" value={width} onChange={(e) => setWidth(e.target.value)} className="w-full p-4 border rounded lg:col-span-1 col-span-3"/>
            <input type="number" placeholder="Height (cm)" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full p-4 border rounded lg:col-span-1 col-span-3"/>
          </div>
          <button type="button" onClick={calculateVolumetricWeight} className="bg-purple-600 text-white  p-3  rounded mb-2">
            Calculate Volumetric Weight
          </button>
          {volumetricWeight && <p className="text-sm">Volumetric Weight: {volumetricWeight} kg</p>}
          <input type="text" name="packageWeight" value={formData.packageWeight} onChange={handleInputChange} placeholder="Package Weight (kg)" className="w-full p-4 border rounded mb-2" />
          <input type="text" name="price" value={formData.price}  placeholder="Price (₹)" onChange={handleInputChange} className="w-full p-4 border rounded mb-2" />
          <select name="packagetype" value={formData.packagetype} onChange={handleInputChange} className="w-full p-4 border rounded mb-2">
            <option>Select package type</option>
            <option>Perishable goods</option>
            <option>Fragile items</option>
            <option>Crates</option>
            <option>Document</option>
            <option>Envelope</option>

          </select>
          <select name="instruction" value={formData.instruction} onChange={handleInputChange} className="w-full p-4 border rounded mb-2">
            <option>Select Handling Instruction</option>
            <option>Do not Tilt</option>
            <option>Handle with care</option>

          </select>
         
        </div>

        {/* Submit Button */}
        <div className="col-span-3 text-center mt-4 p-4">
          <button type="submit" className="bg-gradient-to-r from-purple-600 to-green-500 text-white px-7 py-3 rounded">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Addorder;   


// import React, { useState } from "react";

// const Addorder = () => {
//   const [formData, setFormData] = useState({
//     ConsignerName: "",
//     consignermobileNumber: "",
//     consignerAddress: "",
//     consignermail: "",
//     consignerdistrict: "",
//     consignerstate: "",
//     consignerpincode: "",
//     Consigneename: "",
//     consigneemobileno: "",
//     consigneealterno: "",
//     consigneedistrict: "",
//     consigneeaddress: "",
//     consigneestate: "",
//     consigneepin: "",
//     productname: "",
//     packageWeight: "",
//     packagetype: "",
//     price: "",
//   });
//    console.log(formData);
//   const [length, setLength] = useState('');
//   const [width, setWidth] = useState('');
//   const [height, setHeight] = useState('');
//   const [volumetricWeight, setVolumetricWeight] = useState(null);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => {
//       let updatedData = { ...prev, [name]: value };

//       if (name === "packageWeight") {
//         const price = calculatePrice(value);
//         updatedData = { ...updatedData, price };
//       }
//       return updatedData;
//     });
//   };

//   const calculateVolumetricWeight = () => {
//     if (length && width && height) {
//       const volumetric = (length * width * height) / 5000;
//       setVolumetricWeight(volumetric.toFixed(2));
//     } else {
//       alert("Please enter valid dimensions.");
//     }
//   };

//   const calculatePrice = (weight) => {
//     if (!weight || isNaN(weight) || weight <= 0) {
//       return 0;
//     }

//     weight = parseFloat(weight);

//     if (weight <= 1) {
//       return "₹40";
//     } else if (weight > 1 && weight <= 2) {
//       return "₹80";
//     } else if (weight > 2 && weight <= 5) {
//       return "₹120";
//     } else if (weight > 5 && weight <= 10) {
//       return "₹360";
//     } else if (weight > 10 && weight <= 20) {
//       return "₹600";
//     } else {
//       return "₹1000";
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!formData.ConsignerName || !formData.consignermobileNumber || !formData.consignerAddress || !formData.consignerdistrict || !formData.consignerstate || !formData.consignerpincode || !formData.Consigneename || !formData.consigneemobileno || !formData.consigneeaddress || !formData.consigneedistrict || !formData.consigneestate || !formData.consigneepin || !formData.productname || !formData.packageWeight) {
//       alert("Please fill all required details.");
//       return;
//     }
//     alert("Form submitted successfully!");
//   };

//   return (
//     <div className="max-w-full mx-auto p-4 bg-white shadow-lg shadow-purple-300 rounded-lg">
//       <h1 className="text-center text-2xl font-semibold mb-10"> Order Details</h1>
//       <form onSubmit={handleSubmit} className="grid grid-cols-3 lg:grid-cols-3 md:grid-cols-3 gap-4 text-sm">

//         {/* Consigner Details */}
//         <div className="col-span-3 lg:col-span-1 md:col-span-1">
//           <h2 className="font-semibold text-xl mb-6">1.Consigner Details</h2>
//           <input type="text" name="ConsignerName" value={formData.ConsignerName} onChange={handleInputChange} placeholder="Consigner Name" className="w-full p-4 border rounded mb-2" />
//           <input type="tel" name="consignermobileNumber" value={formData.consignermobileNumber} onChange={handleInputChange} placeholder="Mobile Number" className="w-full p-4 border rounded mb-2" />
//           <input type="text" name="consignerAddress" value={formData.consignerAddress} onChange={handleInputChange} placeholder="Address" className="w-full p-4 border rounded mb-2" />
//           <input type="email" name="consignermail" value={formData.consignermail} onChange={handleInputChange} placeholder="Email (optional)" className="w-full p-4 border rounded mb-2" />
           
     
//           <input type="text" name="consignerstate" value={formData.consignerstate} onChange={handleInputChange} placeholder="State" className="w-full p-4 border rounded mb-2" />
//           <select name="consignerdistrict" value={formData.consignerdistrict} onChange={handleInputChange} className="w-full p-4 border rounded mb-2">
//           <option >Select District</option>
//               <option>Ariyalur</option>
//               <option >Chengalpattu</option>
//               <option >Chennai</option>
//               <option >Coimbatore</option>
//               <option >Cuddalore</option>
//               <option >Dharmapuri</option>
//               <option >Dindigul</option>
//               <option >Erode</option>
//               <option >Kallakurichi</option>
//               <option >Kancheepuram</option>
//               <option >Kanyakumari</option>
//               <option >Karur</option>
//               <option >Krishnagiri</option>
//               <option >Madurai</option>
//               <option >Mayiladuthurai</option>
//               <option >Nagapattinam</option>
//               <option >	Namakkal</option>
//               <option >Nilgiris</option>
//               <option >Perambalur</option>
//               <option >Pudukkottai</option>
//               <option >Ramanathapuram</option>
//               <option >	Ranipet</option>
//               <option >	Salem</option>
//               <option >Sivaganga</option>
//               <option >Tenkasi</option>
//               <option >Thanjavur</option>
//               <option >Theni</option>
//               <option >Thoothukudi</option>
//               <option >Tiruchirappalli</option>
//               <option >Tirunelveli</option>
//               <option >Tirupathur</option>
//               <option >Tiruppur</option>
//               <option >Tiruvallur</option>
//               <option >Tiruvannamalai</option>
//               <option >Tiruvarur</option>
//               <option >Vellore</option>
//               <option >Viluppuram</option>
//               <option >Virudhunagar</option>
//             {/* Add other districts */}
//           </select>
//           <input type="text" name="consignerpincode" value={formData.consignerpincode} onChange={handleInputChange} placeholder="Pincode" className="w-full p-4 border rounded" />
        
//         </div>

//         {/* Consignee Details */}
//         <div className="col-span-3 lg:col-span-1 md:col-span-1">
//           <h2 className="font-semibold  text-xl mb-6">2.Consignee Details</h2>
//           <input type="text" name="Consigneename" value={formData.Consigneename} onChange={handleInputChange} placeholder="Consignee Name" className="w-full p-4 border rounded mb-2" />
//           <input type="tel" name="consigneemobileno" value={formData.consigneemobileno} onChange={handleInputChange} placeholder="Mobile Number" className="w-full p-4 border rounded mb-2" />
//           <input type="tel" name="consigneealterno" value={formData.consigneealterno} onChange={handleInputChange} placeholder="Alternate Mobile No" className="w-full p-4 border rounded mb-2" />
//           <input type="text" name="consigneeaddress" value={formData.consigneeaddress} onChange={handleInputChange} placeholder="Address" className="w-full p-4 border rounded mb-2" />  
          
//           <input type="text" name="consigneepin" value={formData.consigneepin} onChange={handleInputChange} placeholder="Pincode" className="w-full p-4 border rounded" />
//           <input type="text" name="consigneestate" value={formData.consigneestate} onChange={handleInputChange} placeholder="State" className="w-full p-4 border rounded mb-2" />
//           <select name="consigneedistrict" value={formData.consigneedistrict} onChange={handleInputChange} className="w-full p-4 border rounded mb-2">
//           <option >Select District</option>
//               <option>Ariyalur</option>
//               <option >Chengalpattu</option>
//               <option >Chennai</option>
//               <option >Coimbatore</option>
//               <option >Cuddalore</option>
//               <option >Dharmapuri</option>
//               <option >Dindigul</option>
//               <option >Erode</option>
//               <option >Kallakurichi</option>
//               <option >Kancheepuram</option>
//               <option >Kanyakumari</option>
//               <option >Karur</option>
//               <option >Krishnagiri</option>
//               <option >Madurai</option>
//               <option >Mayiladuthurai</option>
//               <option >Nagapattinam</option>
//               <option >	Namakkal</option>
//               <option >Nilgiris</option>
//               <option >Perambalur</option>
//               <option >Pudukkottai</option>
//               <option >Ramanathapuram</option>
//               <option >	Ranipet</option>
//               <option >	Salem</option>
//               <option >Sivaganga</option>
//               <option >Tenkasi</option>
//               <option >Thanjavur</option>
//               <option >Theni</option>
//               <option >Thoothukudi</option>
//               <option >Tiruchirappalli</option>
//               <option >Tirunelveli</option>
//               <option >Tirupathur</option>
//               <option >Tiruppur</option>
//               <option >Tiruvallur</option>
//               <option >Tiruvannamalai</option>
//               <option >Tiruvarur</option>
//               <option >Vellore</option>
//               <option >Viluppuram</option>
//               <option >Virudhunagar</option>
//             {/* Add other districts */}
//           </select>
         
//         </div>

//         {/* Product Details */}
//         <div className="col-span-3 lg:col-span-1 md:col-span-1">
//           <h2 className="font-semibold  text-xl mb-6">3.Product Details</h2>
//           <input type="text" name="productname" value={formData.productname} onChange={handleInputChange} placeholder="Product Name" className="w-full p-4 border rounded mb-2" />
//           <div className="grid grid-cols-3 lg:grid-cols-3 gap-2 mb-2">
//             <input type="number" placeholder="Length (cm)" value={length} onChange={(e) => setLength(e.target.value)} className="w-full p-4 border rounded lg:col-span-1 col-span-3"/>
//             <input type="number" placeholder="Width (cm)" value={width} onChange={(e) => setWidth(e.target.value)} className="w-full p-4 border rounded lg:col-span-1 col-span-3"/>
//             <input type="number" placeholder="Height (cm)" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full p-4 border rounded lg:col-span-1 col-span-3"/>
//           </div>
//           <button type="button" onClick={calculateVolumetricWeight} className="bg-purple-600 text-white  p-3  rounded mb-2">
//             Calculate Volumetric Weight
//           </button>
//           {volumetricWeight && <p className="text-sm">Volumetric Weight: {volumetricWeight} kg</p>}
//           <input type="text" name="packageWeight" value={formData.packageWeight} onChange={handleInputChange} placeholder="Package Weight (kg)" className="w-full p-4 border rounded mb-2" />
//           <input type="text" name="price" value={formData.price}  placeholder="Price (₹)" onChange={handleInputChange} className="w-full p-4 border rounded mb-2" />
//           <select name="packagetype" value={formData.packagetype} onChange={handleInputChange} className="w-full p-4 border rounded mb-2">
//             <option>Select package type</option>
//             <option>Perishable goods</option>
//             <option>Fragile items</option>
//             <option>Crates</option>
//             <option>Document</option>
//             <option>Envelope</option>

//           </select>
//           <select name="instruction" value={formData.instruction} onChange={handleInputChange} className="w-full p-4 border rounded mb-2">
//             <option>Select Handling Instruction</option>
//             <option>Do not Tilt</option>
//             <option>Handle with care</option>

//           </select>
         
//         </div>

//         {/* Submit Button */}
//         <div className="col-span-3 text-center mt-4 p-4">
//           <button type="submit" className="bg-gradient-to-r from-purple-600 to-green-500 text-white px-7 py-3 rounded">
//             Submit
//           </button>
//         </div>
        
//       </form>
//     </div>
//   );
// };

// export default Addorder;



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
