/* eslint-disable react/prop-types */
import { Dialog } from "primereact/dialog";

export default function Adduser ({dialogVisible, setDialogVisible, userForm, handleChange, isEditMode, dialogFooter}) {

    return (
        <>
         <Dialog
        header={
          <div className="pb-2 border-b">
            <h2 className="text-xl font-semibold text-gray-800">
              {isEditMode ? "Update User" : "Add New User"}
            </h2>
          </div>
        }
        visible={dialogVisible}
        className="w-[95vw] sm:w-[80vw] md:w-[60vw] lg:w-[50vw] max-h-[90vh] overflow-y-auto"
        footer={dialogFooter}
        onHide={() => setDialogVisible(false)}
      >
        <form className="px-2 mt-4 space-y-4 sm:mt-6 sm:px-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
            <div>
              <label className="block text-xs font-medium text-gray-700 sm:text-sm">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="Name"
                value={userForm.Name}
                onChange={handleChange}
                placeholder="Name"
                className="block w-full px-2 py-1 mt-1 text-xs border border-gray-300 rounded-md shadow-sm sm:px-3 sm:py-2 focus:outline-none focus:ring-purple-700 focus:ring-2 sm:text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 sm:text-sm">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={userForm.email}
                onChange={handleChange}
                placeholder="Email"
                className="block w-full px-2 py-1 mt-1 text-xs border rounded-md shadow-sm sm:px-3 sm:py-2 focus:outline-none focus:ring-purple-700 focus:ring-2 sm:text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 sm:text-sm">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={userForm.password}
                onChange={handleChange}
                placeholder="Password"
                className="block w-full px-2 py-1 mt-1 text-xs border rounded-md shadow-sm sm:px-3 sm:py-2 focus:outline-none focus:ring-purple-700 focus:ring-2 sm:text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 sm:text-sm">
                Contact No <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                maxLength="10"
                name="ContactNo"
                value={userForm.ContactNo}
                onChange={(e) => {
                  if (e.target.value.length <= 10) {
                    handleChange(e);
                  }
                }}
                placeholder="Contact Number"
                className="block w-full px-2 py-1 mt-1 text-xs border rounded-md shadow-sm sm:px-3 sm:py-2 focus:outline-none focus:ring-purple-700 focus:ring-2 sm:text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 sm:text-sm">
                Date of Birth (DOB)
              </label>
              <input
                type="date"
                name="Dob"
                value={userForm.Dob}
                onChange={handleChange}
                className="block w-full px-2 py-1 mt-1 text-xs border rounded-md shadow-sm sm:px-3 sm:py-2 focus:outline-none focus:ring-purple-700 focus:ring-2 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 sm:text-sm">
                Date of Joining (DOJ)
              </label>
              <input
                type="date"
                name="Doj"
                value={userForm.Doj}
                onChange={handleChange}
                className="block w-full px-2 py-1 mt-1 text-xs border rounded-md shadow-sm sm:px-3 sm:py-2 focus:outline-none focus:ring-purple-700 focus:ring-2 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 sm:text-sm">
                Role
              </label>
              <select
                name="role"
                value={userForm.role}
                onChange={handleChange}
                className="block w-full px-2 py-1 mt-1 text-xs border rounded-md shadow-sm sm:px-3 sm:py-2 focus:outline-none focus:ring-purple-700 focus:ring-2 sm:text-sm"
              >
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
                <option value="manager">Manager</option>
                <option value="subdistributor">Sub Distributor</option>
                <option value="deliveryman">Delivery man</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 sm:text-sm">
                Region
              </label>
              <select
                name="region"
                value={userForm.region}
                onChange={handleChange}
                className="block w-full px-2 py-1 mt-1 text-xs border rounded-md shadow-sm sm:px-3 sm:py-2 focus:outline-none focus:ring-purple-700 focus:ring-2 sm:text-sm"
              >
                <option value="">Select Region</option>
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
            </div>
            <div className="col-span-1 sm:col-span-2">
              <label className="block text-xs font-medium text-gray-700 sm:text-sm">
                Status
              </label>
              <select
                name="status"
                value={userForm.status}
                onChange={handleChange}
                className="block w-full px-2 py-1 mt-1 text-xs border rounded-md shadow-sm sm:px-3 sm:py-2 focus:outline-none focus:ring-purple-700 focus:ring-2 sm:text-sm"
              >
                <option value="">Select Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </form>
      </Dialog>
        </>
    )
}