import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import { CornerDownLeft, Trash } from 'lucide-react';
import apiurl from "../../services/Apiendpoint/Apiendpoint";
import ConsignerDetails from "./ConsignerDetails";

const Addorder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [consigneeType, setConsigneeType] = useState("Single");
  const [singleConsignee, setSingleConsignee] = useState({
    Consigneename: "",
    consigneemobileno: "",
    consigneealterno: "",
    consigneeaddress: "",
    consigneecity: "",
    consigneestate: "",
    consigneeedistrict: "",
    consigneepin: ""
  });
  const [formData, setFormData] = useState({
    orderDetails: {
      ConsignerName: "",
      consignermobileNumber: "",
      consignerAddress: "",
      consignercity: "",
      consignermail: "",
      consignerdistrict: "",
      consignerstate: "",
      consignerpincode: "",
      productname: "",
      noofpackage: "",
      packageWeight: "",
      packagetype: "",
      price: "",
      Orderstatus: "Order Placed",
      instruction: "",
      currentRegion: "",
      deliveryimage: null
    },
    consignees: [{
      cid: "",
      Consigneename: "",
      consigneemobileno: "",
      consigneealterno: "",
      consigneeaddress: "",
      consigneecity: "",
      consigneestate: "",
      consigneeedistrict: "",
      consigneepin: "",
      typename: "",
      ptype: "",
      weight: "",
      packages: "",
      totalWeight: "",
      cpriceperkg: "",
      cprice: "",
      cstatus: "Order Placed",
      productImage: null
    }]
  });

  const [apiData, setApiData] = useState([]);
  const [consignerDistricts, setConsignerDistricts] = useState([]);
  const [consignerPincodes, setConsignerPincodes] = useState([]);
  const [consigneeDistrictsMap, setConsigneeDistrictsMap] = useState({});
  const [consigneePincodesMap, setConsigneePincodesMap] = useState({});
  const [taxRate, setTaxRate] = useState("");

  const toSentenceCase = (str) =>
    str.toLowerCase().replace(/(^\w|\s\w)/g, (match) => match.toUpperCase());

  useEffect(() => {
    fetch(
      "https://api.data.gov.in/resource/5c2f62fe-5afa-4119-a499-fec9d604d5bd?api-key=579b464db66ec23bdd0000019029558117064dd17c6931b0f89fb6ba&format=json&filters[statename]=Tamil Nadu&limit=40000"
    )
      .then((response) => response.json())
      .then((data) => setApiData(data.records))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const states = [...new Set(apiData.map((item) => item.statename))];

  useEffect(() => {
    if (formData.orderDetails && formData.orderDetails.consignerstate) {
      const filteredDistricts = apiData
        .filter((item) => item.statename === formData.orderDetails.consignerstate)
        .map((item) => item.district);
      setConsignerDistricts([...new Set(filteredDistricts)].map(toSentenceCase).sort());
    }
  }, [formData.orderDetails?.consignerstate, apiData]);

  useEffect(() => {
    if (formData.orderDetails && formData.orderDetails.consignerdistrict) {
      const originalDistrict = apiData
        .find((d) => toSentenceCase(d.district) === formData.orderDetails.consignerdistrict)?.district;
      const filteredPincodes = apiData
        .filter((item) => item.district === originalDistrict)
        .map((item) => ({ pincode: item.pincode, officename: item.officename }));
      setConsignerPincodes(filteredPincodes);
    }
  }, [formData.orderDetails?.consignerdistrict, apiData]);

  useEffect(() => {
    const newDistrictsMap = {};
    formData.consignees.forEach((consignee, index) => {
      if (consignee.consigneestate) {
        const filteredDistricts = apiData
          .filter((item) => item.statename === consignee.consigneestate)
          .map((item) => item.district);
        newDistrictsMap[index] = [...new Set(filteredDistricts)].map(toSentenceCase).sort();
      }
    });
    setConsigneeDistrictsMap(newDistrictsMap);

    if (consigneeType === "Single" && singleConsignee.consigneestate) {
      const filteredDistricts = apiData
        .filter((item) => item.statename === singleConsignee.consigneestate)
        .map((item) => item.district);
      newDistrictsMap["single"] = [...new Set(filteredDistricts)].map(toSentenceCase).sort();
    }
  }, [formData.consignees, singleConsignee.consigneestate, apiData, consigneeType]);


  useEffect(() => {
    const newPincodesMap = {};
    formData.consignees.forEach((consignee, index) => {
      if (consignee.consigneeedistrict) {
        const originalDistrict = apiData
          .find((d) => toSentenceCase(d.district) === consignee.consigneeedistrict)?.district;
        const filteredPincodes = apiData
          .filter((item) => item.district === originalDistrict)
          .map((item) => ({ pincode: item.pincode, officename: item.officename }));
        newPincodesMap[index] = filteredPincodes;
      }
    });
    setConsigneePincodesMap(newPincodesMap);

    if (consigneeType === "Single" && singleConsignee.consigneeedistrict) {
      const originalDistrict = apiData
        .find((d) => toSentenceCase(d.district) === singleConsignee.consigneeedistrict)?.district;
      const filteredPincodes = apiData
        .filter((item) => item.district === originalDistrict)
        .map((item) => ({ pincode: item.pincode, officename: item.officename }));
      newPincodesMap["single"] = filteredPincodes;
    }
  }, [formData.consignees, singleConsignee.consigneeedistrict, apiData, consigneeType]);


  useEffect(() => {
    if (id) {
      const fetchOrderDetails = async () => {
        try {
          const response = await axios.get(`${apiurl()}/api/order/${id}`);
          const { savedOrder, cosaveorder } = response.data;
          
          if (!savedOrder) throw new Error("Order data not found in response");
          
          setFormData(prev => ({
            ...prev,
            orderDetails: savedOrder || prev.orderDetails,
            consignees: Array.isArray(cosaveorder) && cosaveorder.length > 0 ? cosaveorder : prev.consignees
          }));

          if (Array.isArray(cosaveorder)) {
            setConsigneeType(cosaveorder.length > 1 ? "Multiple" : "Single");
            if (cosaveorder.length === 1 && consigneeType === "Single") {
              setSingleConsignee({
                Consigneename: cosaveorder[0].Consigneename || "",
                consigneemobileno: cosaveorder[0].consigneemobileno || "",
                consigneealterno: cosaveorder[0].consigneealterno || "",
                consigneeaddress: cosaveorder[0].consigneeaddress || "",
                consigneecity: cosaveorder[0].consigneecity || "",
                consigneestate: cosaveorder[0].consigneestate || "",
                consigneeedistrict: cosaveorder[0].consigneeedistrict || "",
                consigneepin: cosaveorder[0].consigneepin || ""
              });
            }

            const allDelivered = cosaveorder.every(co => co.cstatus === "Delivered");
            const someDelivered = cosaveorder.some(co => co.cstatus === "Delivered");
            setFormData(prev => ({
              ...prev,
              orderDetails: {
                ...prev.orderDetails,
                Orderstatus: allDelivered ? "Delivered" : someDelivered ? "Partial" : "Order Placed"
              }
            }));
          }
        } catch (error) {
          console.error("Error fetching order details:", error);
          toast.error("Failed to load order details");
        }
      };
      fetchOrderDetails();
    }
  }, [id, consigneeType]);

  const handleOrderInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      orderDetails: { ...prev.orderDetails, [name]: value }
    }));
  };

  const handleSingleConsigneeChange = (e) => {
    const { name, value } = e.target;
    setSingleConsignee(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleConsigneeChange = (index, field, value) => {
    const updatedConsignees = [...formData.consignees];
    updatedConsignees[index][field] = value;

    if (field === "weight" || field === "packages" || field === "cpriceperkg") {
      const weight = parseFloat(updatedConsignees[index].weight) || 0;
      const packages = parseFloat(updatedConsignees[index].packages) || 0;
      const pricePerKg = parseFloat(updatedConsignees[index].cpriceperkg) || 0;
      updatedConsignees[index].totalWeight = weight * packages;
      updatedConsignees[index].cprice = (weight * packages * pricePerKg).toFixed(2);
    }

    const allDelivered = updatedConsignees.every(co => co.cstatus === "Delivered");
    const someDelivered = updatedConsignees.some(co => co.cstatus === "Delivered");
    const newOrderStatus = allDelivered ? "Delivered" : someDelivered ? "Partial" : "Order Placed";

    setFormData(prev => ({
      ...prev,
      consignees: updatedConsignees,
      orderDetails: {
        ...prev.orderDetails,
        Orderstatus: newOrderStatus
      }
    }));
  };

  const handleImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const updatedConsignees = [...formData.consignees];
      updatedConsignees[index].productImage = file;
      setFormData(prev => ({ ...prev, consignees: updatedConsignees }));
    }
  };

  const addConsignee = () => {
    const newConsignee = consigneeType === "Single"
      ? { ...singleConsignee, typename: "", ptype: "", weight: "", packages: "", totalWeight: "", cpriceperkg: "", cprice: "", cstatus: "Order Placed", productImage: null }
      : {
          Consigneename: "",
          consigneemobileno: "",
          consigneealterno: "",
          consigneeaddress: "",
          consigneecity: "",
          consigneestate: "",
          consigneeedistrict: "",
          consigneepin: "",
          typename: "",
          ptype: "",
          weight: "",
          packages: "",
          totalWeight: "",
          cpriceperkg: "",
          cprice: "",
          cstatus: "Order Placed",
          productImage: null
        };

    setFormData(prev => ({
      ...prev,
      consignees: [...prev.consignees, newConsignee]
    }));
  };

  const deleteConsignee = (index) => {
    const updatedConsignees = formData.consignees.filter((_, i) => i !== index);
    const allDelivered = updatedConsignees.every(co => co.cstatus === "Delivered");
    const someDelivered = updatedConsignees.some(co => co.cstatus === "Delivered");
    const newOrderStatus = allDelivered ? "Delivered" : someDelivered ? "Partial" : "Order Placed";

    setFormData(prev => ({
      ...prev,
      consignees: updatedConsignees,
      orderDetails: {
        ...prev.orderDetails,
        Orderstatus: newOrderStatus
      }
    }));
  };

  const totalPackages = formData.consignees.reduce(
    (sum, row) => sum + (parseFloat(row.packages) || 0), 0
  );
  const totalWeight = formData.consignees.reduce(
    (sum, row) => sum + (parseFloat(row.totalWeight) || 0), 0
  );
  const totalAmount = formData.consignees.reduce(
    (sum, row) => sum + (parseFloat(row.cprice) || 0), 0
  );
  // const taxAmount = totalAmount * (parseFloat(taxRate) / 100 || 0);
  // const totalWithTax = totalAmount + taxAmount;
  const totalWithTax = totalAmount ;


  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      orderDetails: {
        ...prev.orderDetails,
        packageWeight: totalWeight > 0 ? totalWeight.toFixed(2) : "",
        price: totalWithTax > 0 ? totalWithTax.toFixed(2) : "",
        noofpackage: totalPackages > 0 ? totalPackages.toString() : ""
      }
    }));
  }, [totalWeight, totalWithTax, totalPackages]);

 
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const formDataToSend = new FormData();
  
      // Append order details
      Object.entries(formData.orderDetails).forEach(([key, value]) => {
        if (value !== null && value !== undefined && key !== "statusHistory") {
          if (key === "deliveryimage" && value instanceof File) {
            formDataToSend.append("deliveryimage", value);
          } else {
            formDataToSend.append(key, value);
          }
        }
      });
  
      // Handle consignees
      let consigneesToSend;
      if (consigneeType === "Single") {
        consigneesToSend = formData.consignees.map(consignee => ({
          ...consignee,
          Consigneename: singleConsignee.Consigneename,
          consigneemobileno: singleConsignee.consigneemobileno,
          consigneealterno: singleConsignee.consigneealterno,
          consigneeaddress: singleConsignee.consigneeaddress,
          consigneecity: singleConsignee.consigneecity,
          consigneestate: singleConsignee.consigneestate,
          consigneeedistrict: singleConsignee.consigneeedistrict,
          consigneepin: singleConsignee.consigneepin
        }));
      } else {
        consigneesToSend = formData.consignees;
      }
  
      consigneesToSend.forEach((consignee, index) => {
        Object.entries(consignee).forEach(([key, value]) => {
          if (value !== null && value !== undefined && key !== "statusHistory") {
            if (key === "productImage" && value instanceof File) {
              // Append productImage with a unique field name based on index
              formDataToSend.append(`productImage[${index}]`, value);
            } else if (key !== "productImage") {
              formDataToSend.append(`corders[${index}][${key}]`, value);
            }
          }
        });
      });
  
      const headers = {
        "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
        "Content-Type": "multipart/form-data"
      };
  
      const url = id 
        ? `${apiurl()}/api/order/${id}` 
        : `${apiurl()}/api/order/createorder`;
      const method = id ? axios.put : axios.post;
  
      const response = await method(url, formDataToSend, { headers });
  
      toast.success(id ? "Order updated successfully!" : "Order created successfully!");
      setTimeout(() => navigate("/order"), 500);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(`Failed to submit order: ${error.response?.data?.error || error.message}`);
    }
  };

  const CONSIGNEE_STATUS = {
    PLACED: "Order Placed",
    DISPATCHED: "Order Dispatched",
    OUT_FOR_DELIVERY: "Out for Delivery",
    DELIVERED: "Delivered"
  };

  const ORDER_STATUS = {
    PLACED: "Order Placed",
    PARTIAL: "Partial",
    DELIVERED: "Delivered"
  };

  const getNextConsigneeStatuses = (currentStatus) => {
    switch (currentStatus) {
      case CONSIGNEE_STATUS.PLACED: return [CONSIGNEE_STATUS.PLACED, CONSIGNEE_STATUS.DISPATCHED];
      case CONSIGNEE_STATUS.DISPATCHED: return [CONSIGNEE_STATUS.DISPATCHED, CONSIGNEE_STATUS.OUT_FOR_DELIVERY];
      case CONSIGNEE_STATUS.OUT_FOR_DELIVERY: return [CONSIGNEE_STATUS.OUT_FOR_DELIVERY, CONSIGNEE_STATUS.DELIVERED];
      case CONSIGNEE_STATUS.DELIVERED: return [CONSIGNEE_STATUS.DELIVERED];
      default: return [CONSIGNEE_STATUS.PLACED];
    }
  };

  return (
    <div className="max-w-full p-4 mx-auto rounded-lg shadow-lg bg-gray-50 shadow-purple-300">
      <h1 className="mb-2 text-2xl font-semibold text-center">Order Details</h1>
      <form onSubmit={handleSubmit} className="text-sm">
    

        <ConsignerDetails  formData={formData} handleOrderInputChange={handleOrderInputChange} states={states} consignerDistricts={consignerDistricts} 
        consignerPincodes={consignerPincodes} />

        <div className="mt-6">
          <h2 className="mb-4 text-xl font-semibold">2. Consignee Type</h2>
          <div className="flex gap-4">
            <label className="flex items-center"><input type="radio" name="consigneeType" value="Single" checked={consigneeType === "Single"} onChange={() => setConsigneeType("Single")} className="mr-2" />Single Consignee</label>
            <label className="flex items-center"><input type="radio" name="consigneeType" value="Multiple" checked={consigneeType === "Multiple"} onChange={() => setConsigneeType("Multiple")} className="mr-2" />Multiple Consignee</label>
          </div>
        </div>

        {consigneeType === "Single" && (
          <div className="mt-6">
            <h2 className="mb-6 text-xl font-semibold">3. Consignee Details</h2>
            <div className="grid gap-2 lg:grid-cols-5">
              <input type="text" name="Consigneename" value={singleConsignee.Consigneename} onChange={handleSingleConsigneeChange} placeholder="Consignee Name" className="w-full p-4 mb-2 border-2 rounded bg-purple-50 focus:outline-none focus:ring-purple-400 focus:ring-2" required />
              <input type="tel" name="consigneemobileno" value={singleConsignee.consigneemobileno} onChange={(e) => handleSingleConsigneeChange({ target: { name: e.target.name, value: e.target.value.replace(/\D/g, "").slice(0, 10) } })} placeholder="Mobile Number" className="w-full p-4 mb-2 border-2 rounded bg-purple-50 focus:outline-none focus:ring-purple-400 focus:ring-2" required />
              {/* <input type="tel" name="consigneealterno" value={singleConsignee.consigneealterno} onChange={(e) => handleSingleConsigneeChange({ target: { name: e.target.name, value: e.target.value.replace(/\D/g, "").slice(0, 10) } })} placeholder="Alternate Mobile" className="w-full p-4 mb-2 border-2 rounded bg-purple-50 focus:outline-none focus:ring-purple-400 focus:ring-2" /> */}
              <input type="text" name="consigneeaddress" value={singleConsignee.consigneeaddress} onChange={handleSingleConsigneeChange} placeholder="Address" className="w-full p-4 mb-2 border-2 rounded bg-purple-50 focus:outline-none focus:ring-purple-400 focus:ring-2" required />
              <input type="text" name="consigneecity" value={singleConsignee.consigneecity} onChange={handleSingleConsigneeChange} placeholder="City" className="w-full p-4 mb-2 border-2 rounded bg-purple-50 focus:outline-none focus:ring-purple-400 focus:ring-2" required />
              <select name="consigneestate" value={singleConsignee.consigneestate} onChange={handleSingleConsigneeChange} className="w-full p-4 mb-2 border-2 rounded bg-purple-50 focus:outline-none focus:ring-purple-400 focus:ring-2" required>
                <option value="">Select State</option>
                {states.map((state, idx) => (<option key={idx} value={state}>{state}</option>))}
              </select>
              <select name="consigneeedistrict" value={singleConsignee.consigneeedistrict} onChange={handleSingleConsigneeChange} className="w-full p-4 mb-2 border-2 rounded bg-purple-50 focus:outline-none focus:ring-purple-400 focus:ring-2" required>
                <option value="">Select District</option>
                {consigneeDistrictsMap["single"]?.map((district, idx) => (<option key={idx} value={district}>{district}</option>))}
              </select>
              <select name="consigneepin" value={singleConsignee.consigneepin} onChange={handleSingleConsigneeChange} className="w-full p-4 mb-2 border-2 rounded bg-purple-50 focus:outline-none focus:ring-purple-400 focus:ring-2" required>
                <option value="">Select Pincode</option>
                {consigneePincodesMap["single"]?.map((pincode, idx) => (<option key={idx} value={`${pincode.pincode}-${pincode.officename}`}>{pincode.pincode} - {pincode.officename}</option>))}
              </select>
            </div>

            <div className="mt-6">
              <h2 className="mb-6 text-xl font-semibold">4. Product Details</h2>
              <table className="w-full text-sm border border-collapse border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 border">S.NO</th>
                    <th className="p-2 border">Type</th>
                    <th className="p-2 border">Weight</th>
                    <th className="p-2 border">Quantity</th>
                    <th className="p-2 border">Total Weight</th>
                    <th className="p-2 border">Price/kg</th>
                    <th className="p-2 border">Price</th>
                    <th className="border p-2 w-[170px]">Status</th>
                    {/* <th className="p-2 border">Image</th> */}
                    <th className="p-2 border">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.consignees.map((consignee, index) => (
                    <tr key={index}>
                      <td className="p-2 border">{index + 1}</td>
                      <td className="p-2 space-x-1 border">
                        <input type="text" value={consignee.typename} onChange={(e) => handleConsigneeChange(index, "typename", e.target.value)} placeholder="Product" className="w-1/2 p-1 border rounded bg-violet-50 " required  disabled={isEditMode}/>
                        <select value={consignee.ptype} onChange={(e) => handleConsigneeChange(index, "ptype", e.target.value)} className="p-1 mt-1 border rounded bg-violet-50" required  disabled={isEditMode}>
                          <option value="">Package Type</option>
                          <option>Spoiled items</option>
                          <option>Breakable things</option>
                          <option>Big boxes</option>
                          <option>Document</option>
                          <option>Envelope</option>
                        </select>
                      </td>
                      <td className="p-2 border"><input type="tel" value={consignee.weight} onChange={(e) => handleConsigneeChange(index, "weight", e.target.value)} placeholder="Weight" className="w-full p-1 border rounded bg-violet-50" required min="0"  disabled={isEditMode} /></td>
                      <td className="p-2 border"><input type="tel" value={consignee.packages} onChange={(e) => handleConsigneeChange(index, "packages", e.target.value)} placeholder="Qty" className="w-full p-1 border rounded bg-violet-50" required min="0"  disabled={isEditMode} /></td>
                      <td className="p-2 border"><input value={consignee.totalWeight ? `${consignee.totalWeight} Kg` : ""} className="w-full p-1 border rounded bg-violet-50" required min="0" /></td>
                      <td className="p-2 border"><input type="tel" value={consignee.cpriceperkg} onChange={(e) => handleConsigneeChange(index, "cpriceperkg", e.target.value)} placeholder="₹/kg" className="w-full p-1 border rounded bg-violet-50" min="0"  disabled={isEditMode} /></td>
                      <td className="p-2 border"><input value={consignee.cprice ? `₹${consignee.cprice}` : ""} className="w-full p-1 border rounded bg-violet-50" required min="0" /></td>
                      <td className="p-2 border">
                        <select value={consignee.cstatus} onChange={(e) => handleConsigneeChange(index, "cstatus", e.target.value)} className="w-full p-1 border rounded bg-violet-50" required>
                          <option value="">Select Status</option>
                          {getNextConsigneeStatuses(consignee.cstatus).map(status => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </td>
                      {/* <td className="p-2 border">
                        {consignee.cstatus === "Delivered" && (
                          <input type="file" accept="image/*" onChange={(e) => handleImageChange(index, e)} className="w-full p-1 border rounded bg-violet-50" />
                        )}
                        {consignee.productImage && consignee.cstatus === "Delivered" && (
                          <span className="text-sm text-gray-600">{typeof consignee.productImage === "string" ? "Image Uploaded" : consignee.productImage.name}</span>
                        )}
                      </td> */}
                      <td className="p-2 text-center border"><button type="button" onClick={() => deleteConsignee(index)} className="text-red-500 hover:underline"><Trash /></button></td>
                    </tr>
                  ))}
                  <tr className="bg-gray-100">
                    <td className="p-2 border" colSpan="3">Totals</td>
                    <td className="p-2 border">{totalPackages || ""}</td>
                    <td className="p-2 border">{totalWeight ? `${totalWeight.toFixed(2)} Kg` : ""}</td>
                    <td className="p-2 border" colSpan="1"></td>
                    <td className="p-2 border">{totalAmount ? `₹${totalAmount.toFixed(2)}` : ""}</td>
                    <td className="p-2 border" colSpan="2"></td>
                  </tr>
                </tbody>
              </table>
              <div className="flex justify-end mt-4">
                <button type="button" onClick={addConsignee} className="flex items-center p-2 text-white bg-purple-500 border rounded">
                  Add Product <CornerDownLeft className="ml-2" />
                </button>
              </div>
            </div>
          </div>
        )}

        {consigneeType === "Multiple" && (
          <div className="mt-6">
            <h2 className="mb-6 text-xl font-semibold">3. Consignee Details</h2>
            <table className="w-full text-sm border border-collapse border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">S.NO</th>
                  <th className="p-2 border">Name</th>
                  <th className="border p-2 w-[150px]">Mobile</th>
                  <th className="p-2 border">Address</th>
                  <th className="border p-2 w-[250px]">Location</th>
                  <th className="border p-2 w-[200px]">Type</th>
                  <th className="border p-2 w-[80px]">Weight</th>
                  <th className="border p-2 w-[20px]">Quantity</th>
                  <th className="border p-2 w-[80px]">Total Weight</th>
                  <th className="border p-2 w-[80px]">Price/kg</th>
                  <th className="border p-2 w-[90px]">Price</th>
                  <th className="border p-2 w-[170px]">Status</th>
                  {/* <th className="p-2 border">Image</th> */}
                  <th className="p-2 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {formData.consignees.map((consignee, index) => (
                  <tr key={index}>
                    <td className="p-2 border">{index + 1}</td>
                    <td className="p-2 border"><input type="text" value={consignee.Consigneename} onChange={(e) => handleConsigneeChange(index, "Consigneename", e.target.value)} placeholder="Name" className="p-1 border rounded bg-violet-50" required /></td>
                    <td className="p-2 space-y-1 border">
                      <input type="tel" value={consignee.consigneemobileno} onChange={(e) => handleConsigneeChange(index, "consigneemobileno", e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="Mobile" className="w-full p-1 border rounded bg-violet-50" required />
                      {/* <input type="tel" value={consignee.consigneealterno} onChange={(e) => handleConsigneeChange(index, "consigneealterno", e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="AlterMobile" className="w-full p-1 border rounded bg-violet-50" /> */}
                    </td>
                    <td className="p-2 border">
                      <textarea value={consignee.consigneeaddress} onChange={(e) => handleConsigneeChange(index, "consigneeaddress", e.target.value)} placeholder="Address" className="w-full p-1 border rounded bg-violet-50" required />
                      <input type="text" value={consignee.consigneecity} onChange={(e) => handleConsigneeChange(index, "consigneecity", e.target.value)} placeholder="City" className="w-full p-1 mt-1 border rounded bg-violet-50" required />
                    </td>
                    <td className="p-2 border">
                      <select value={consignee.consigneestate} onChange={(e) => handleConsigneeChange(index, "consigneestate", e.target.value)} className="w-full p-1 border rounded bg-violet-50" required>
                        <option value="">State</option>
                        {states.map((state, idx) => (<option key={idx} value={state}>{state}</option>))}
                      </select>
                      <select value={consignee.consigneeedistrict} onChange={(e) => handleConsigneeChange(index, "consigneeedistrict", e.target.value)} className="w-full p-1 mt-1 border rounded bg-violet-50" required>
                        <option value="">District</option>
                        {consigneeDistrictsMap[index]?.map((district, idx) => (<option key={idx} value={district}>{district}</option>))}
                      </select>
                      <select value={consignee.consigneepin} onChange={(e) => handleConsigneeChange(index, "consigneepin", e.target.value)} className="w-full p-1 mt-1 border rounded bg-violet-50" required>
                        <option value="">Pincode</option>
                        {consigneePincodesMap[index]?.map((pincode, idx) => (<option key={idx} value={`${pincode.pincode}-${pincode.officename}`}>{pincode.pincode} - {pincode.officename}</option>))}
                      </select>
                    </td>
                    <td className="p-2 border">
                      <input type="text" value={consignee.typename} onChange={(e) => handleConsigneeChange(index, "typename", e.target.value)} placeholder="Product" className="w-full p-1 border rounded bg-violet-50" required />
                      <select value={consignee.ptype} onChange={(e) => handleConsigneeChange(index, "ptype", e.target.value)} className="w-full p-1 mt-1 border rounded bg-violet-50" required>
                      <option value="">Package Type</option>
                          <option>Spoiled items</option>
                          <option>Breakable things</option>
                          <option>Big boxes</option>
                          <option>Document</option>
                          <option>Envelope</option>
                      </select>
                    </td>
                    <td className="p-2 border"><input type="tel" value={consignee.weight} onChange={(e) => handleConsigneeChange(index, "weight", e.target.value)} placeholder="Weight" className="w-full p-1 border rounded bg-violet-50" required min="0" /></td>
                    <td className="p-2 border"><input type="tel" value={consignee.packages} onChange={(e) => handleConsigneeChange(index, "packages", e.target.value)} placeholder="Qty" className="w-full p-1 border rounded bg-violet-50" required min="0" /></td>
                    <td className="p-2 border"><input value={consignee.totalWeight ? `${consignee.totalWeight} Kg` : ""} className="w-full p-1 border rounded bg-violet-50" required min="0" /></td>
                    <td className="p-2 border"><input type="tel" value={consignee.cpriceperkg} onChange={(e) => handleConsigneeChange(index, "cpriceperkg", e.target.value)} placeholder="₹/kg" className="w-full p-1 border rounded bg-violet-50" min="0" /></td>
                    <td className="p-2 border"><input value={consignee.cprice ? `₹${consignee.cprice}` : ""} className="w-full p-1 border rounded bg-violet-50" required min="0" /></td>
                    <td className="p-2 border">
                      <select value={consignee.cstatus} onChange={(e) => handleConsigneeChange(index, "cstatus", e.target.value)} className="w-full p-1 border rounded bg-violet-50" required>
                        <option value="">Select Status</option>
                        {getNextConsigneeStatuses(consignee.cstatus).map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </td>
                    {/* <td className="p-2 border">
                      {consignee.cstatus === "Delivered" && (
                        <input type="file" accept="image/*" onChange={(e) => handleImageChange(index, e)} className="w-full p-1 border rounded bg-violet-50" />
                      )}
                      {consignee.productImage && consignee.cstatus === "Delivered" && (
                        <span className="text-sm text-gray-600">{typeof consignee.productImage === "string" ? "Image Uploaded" : consignee.productImage.name}</span>
                      )}
                    </td> */}
                    <td className="p-2 text-center border"><button type="button" onClick={() => deleteConsignee(index)} className="text-red-500 hover:underline"><Trash /></button></td>
                  </tr>
                ))}
                <tr className="bg-gray-100">
                  <td className="p-2 border" colSpan="7">Totals</td>
                  <td className="p-2 border">{totalPackages || ""}</td>
                  <td className="p-2 border">{totalWeight ? `${totalWeight.toFixed(2)} Kg` : ""}</td>
                  <td className="p-2 border" colSpan="1"></td>
                  <td className="p-2 border">{totalAmount ? `₹${totalAmount.toFixed(2)}` : ""}</td>
                  <td className="p-2 border" colSpan="2"></td>
                </tr>
              </tbody>
            </table>
            <div className="flex justify-end mt-4">
              <button type="button" onClick={addConsignee} className="flex items-center p-2 text-white bg-purple-500 border rounded">
                Add Consignee <CornerDownLeft className="ml-2" />
              </button>
            </div>
          </div>
        )}

        <div className="grid gap-2 mt-4 lg:grid-cols-5">
          {/* <div><label className="text-gray-700 text-[15px] ml-2">Tax Rate (%):</label><input type="tel" value={taxRate} onChange={(e) => setTaxRate(e.target.value)} className="w-full p-2 border rounded bg-purple-50" min="0" /></div> */}
          {/* <div><label className="text-gray-700 text-[15px] ml-2">Total Weight:</label><input type="text" value={totalWeight ? `${totalWeight.toFixed(2)} Kg` : ""} readOnly className="w-full p-2 border rounded bg-purple-50" /></div> */}
          {/* <div><label className="text-gray-700 text-[15px] ml-2">Tax Amount:</label><input type="text" value={taxAmount ? `₹${taxAmount.toFixed(2)}` : ""} readOnly className="w-full p-2 border rounded bg-purple-50" /></div> */}
          {/* <div><label className="text-gray-700 text-[15px] ml-2">Total Amount:</label><input type="text" value={totalAmount ? `₹${totalAmount.toFixed(2)}` : ""} readOnly className="w-full p-2 border rounded bg-purple-50" /></div> */}
          {/* <div><label className="text-gray-700 text-[15px] ml-2">Total with Tax:</label><input type="text" value={totalWithTax ? `₹${totalWithTax.toFixed(2)}` : ""} readOnly className="w-full p-2 border rounded bg-purple-50" /></div> */}
        </div>

        <div className="grid gap-2 mt-4 lg:grid-cols-5">
          <input type="text" name="packageWeight" value={formData.orderDetails.packageWeight ? `${formData.orderDetails.packageWeight}kg` : ""} onChange={handleOrderInputChange} placeholder="Package Weight (kg)" className="p-4 mb-2 border-2 rounded bg-purple-50" readOnly />
          <input type="text" name="noofpackage" value={formData.orderDetails.noofpackage} onChange={handleOrderInputChange} placeholder="No of Packages" className="p-4 mb-2 border-2 rounded bg-purple-50" readOnly />
          <input type="text" name="price" value={formData.orderDetails.price ? `₹${formData.orderDetails.price}` : ""}onChange={handleOrderInputChange} placeholder="Price (₹)" className="p-4 mb-2 border-2 rounded bg-purple-50" readOnly />
          <select name="instruction" value={formData.orderDetails.instruction} onChange={handleOrderInputChange} className="p-4 mb-2 border-2 rounded bg-purple-50" required>
            <option value="">Select Handling Instruction</option>
            <option>Do not Tilt</option>
            <option>Handle with care</option>
          </select>
          <select name="Orderstatus" value={formData.orderDetails.Orderstatus} onChange={handleOrderInputChange} className="p-4 mb-2 border-2 rounded bg-purple-50" disabled>
            <option value="Order Placed">Order Placed</option>
            <option value="Partial">Partial</option>
            <option value="Delivered">Delivered</option>
          </select>
          {formData.orderDetails.Orderstatus === "Delivered" && (
            <input type="file" accept="image/*" onChange={(e) => setFormData(prev => ({ ...prev, orderDetails: { ...prev.orderDetails, deliveryimage: e.target.files[0] } }))} className="p-4 mb-2 border-2 rounded bg-violet-50" />
          )}
          {formData.orderDetails.Orderstatus === "Order Placed" && (
            <select name="currentRegion" value={formData.orderDetails.currentRegion} onChange={handleOrderInputChange} className="p-4 mb-2 border-2 rounded bg-violet-50">
             <option value="">Select office Region</option>
                 <option value="Ariyalur">Ariyalur</option>
                 <option value="Chengalpattu">Chengalpattu</option>
                 <option value="Chennai">Chennai</option>
                 <option value="Coimbatore">Coimbatore</option>
                 <option value="Cuddalore">Cuddalore</option>
                 <option value="Dharmapuri">Dharmapuri</option>
                 <option value="Dindigul">Dindigul</option>
                 <option value="Erode">Erode</option>
                 <option value="Kallakurichi">Kallakurichi</option>
                 <option value="Kanchipuram">Kanchipuram</option>
                 <option value="Kanniyakumari">Kanniyakumari</option>
                 <option value="Karur">Karur</option>
                 <option value="Krishnagiri">Krishnagiri</option>
                 <option value="Madurai">Madurai</option>
                 <option value="Mayiladuthurai">Mayiladuthurai</option>
                 <option value="Nagapattinam">Nagapattinam</option>
                 <option value="Namakkal">Namakkal</option>
                 <option value="Perambalur">Perambalur</option>
                 <option value="Pudukkottai">Pudukkottai</option>
                 <option value="Ramanathapuram">Ramanathapuram</option>
                 <option value="Ranipet">Ranipet</option>
                 <option value="Salem">Salem</option>
                 <option value="Sivaganga">Sivaganga</option>
                 <option value="Tenkasi">Tenkasi</option>
                 <option value="Thanjavur">Thanjavur</option>
                 <option value="The Nilgiris">The Nilgiris</option>
                 <option value="Theni">Theni</option>
                 <option value="Thiruvallur">Thiruvallur</option>
                 <option value="Thiruvarur">Thiruvarur</option>
                 <option value="Tiruchirappalli">Tiruchirappalli</option>
                 <option value="Tirunelveli">Tirunelveli</option>
                 <option value="Tirupathur">Tirupathur</option>
                 <option value="Tiruppur">Tiruppur</option>
                 <option value="Tiruvannamalai">Tiruvannamalai</option>
                 <option value="Tuticorin">Tuticorin</option>
                 <option value="Vellore">Vellore</option>
                 <option value="Villupuram">Villupuram</option>
                 <option value="Virudhunagar">Virudhunagar</option>
            </select>
          )}
        </div>

        <div className="flex justify-between mt-4">
          <button type="button" onClick={() => navigate("/order")} className="py-3 text-white rounded bg-gradient-to-r from-purple-600 to-green-500 px-7">Back</button>
          <button type="submit" className="py-3 text-white rounded bg-gradient-to-r from-purple-600 to-green-500 px-7">{id ? "Update Order" : "Add Order"}</button>
        </div>
      </form>
    </div>
  );
};

export default Addorder;