/* eslint-disable react/prop-types */
export default function ConsignerDetails({formData, handleOrderInputChange, states, consignerDistricts, consignerPincodes}) {

    return (
        <>
            <div>
          <h2 className="mb-6 text-xl font-semibold">1. Consigner Details</h2>
          <div className="grid gap-2 lg:grid-cols-5">
            <input type="text" name="ConsignerName" value={formData.orderDetails.ConsignerName} onChange={handleOrderInputChange} placeholder="Consigner Name" className="w-full p-4 mb-2 border-2 rounded bg-purple-50 focus:outline-none focus:ring-purple-400 focus:ring-2" required  />
            <input type="tel" name="consignermobileNumber" value={formData.orderDetails.consignermobileNumber} onChange={(e) => handleOrderInputChange({ target: { name: e.target.name, value: e.target.value.replace(/\D/g, "").slice(0, 10) } })} placeholder="Mobile Number" className="w-full p-4 mb-2 border-2 rounded bg-purple-50 focus:outline-none focus:ring-purple-400 focus:ring-2" required />
            <input type="text" name="consignerAddress" value={formData.orderDetails.consignerAddress} onChange={handleOrderInputChange} placeholder="Address" className="w-full p-4 mb-2 border-2 rounded bg-purple-50 focus:outline-none focus:ring-purple-400 focus:ring-2" required />
            <input type="text" name="consignercity" value={formData.orderDetails.consignercity} onChange={handleOrderInputChange} placeholder="City" className="w-full p-4 mb-2 border-2 rounded bg-purple-50 focus:outline-none focus:ring-purple-400 focus:ring-2" required />
            <input type="email" name="consignermail" value={formData.orderDetails.consignermail} onChange={handleOrderInputChange} placeholder="Email (optional)" className="w-full p-4 mb-2 border-2 rounded bg-purple-50 focus:outline-none focus:ring-purple-400 focus:ring-2" />
            <select name="consignerstate" value={formData.orderDetails.consignerstate} onChange={handleOrderInputChange} className="w-full p-4 mb-2 border-2 rounded bg-purple-50 focus:outline-none focus:ring-purple-400 focus:ring-2" required>
              <option value="">Select State</option>
              {states.map((state, idx) => (<option key={idx} value={state}>{state}</option>))}
            </select>
            <select name="consignerdistrict" value={formData.orderDetails.consignerdistrict} onChange={handleOrderInputChange} className="w-full p-4 mb-2 border-2 rounded bg-purple-50 focus:outline-none focus:ring-purple-400 focus:ring-2" required>
              <option value="">Select District</option>
              {consignerDistricts.map((district, idx) => (<option key={idx} value={district}>{district}</option>))}
            </select>
            <select name="consignerpincode" value={formData.orderDetails.consignerpincode} onChange={handleOrderInputChange} className="w-full p-4 mb-2 border-2 rounded bg-purple-50 focus:outline-none focus:ring-purple-400 focus:ring-2" required>
              <option value="">Select Pincode</option>
              {consignerPincodes.map((pincode, idx) => (<option key={idx} value={`${pincode.pincode}-${pincode.officename}`}>{pincode.pincode} - {pincode.officename}</option>))}
            </select>
          </div>
        </div>
        </>
    )
}