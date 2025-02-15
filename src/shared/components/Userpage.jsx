import React from "react";

const Userpage = ({filteredUsers,selectedRole,navigate,edituser,handleRoleChange}) => {
 
  return (
    <>
      <div className="w-full mx-auto p-4 sm:p-6 bg-white shadow-lg rounded-sm border border-gray-200">
        <div className="flex justify-between  items-center ">
          <h2 className="text-xl sm:text-2xl font-medium">User List</h2>

          {/* Role Filter Dropdown */}
         <div className="flex items-center justify-between gap-10"> 
          <h1 className="text-xl font-medium">Apply Filter</h1>         
         <select
            className="px-2 py-2 border rounded-md text-[16px] bg-purple-700 text-white"
            value={selectedRole}
            onChange={handleRoleChange}
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="user">User</option>
            <option value="subdistributor">Distributor</option>
            <option value="deliveryman">Deliveryman</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>

          </select>
          <button
            onClick={() => navigate("/Adduser")}
            className="px-4 py-2 bg-purple-700 text-white rounded-md text-[16px]   hover:bg-purple-800 transition-all duration-300"
          >
            +Add User
          </button>
          </div>

          
        </div>
        <hr className="mt-4" />

        <div className="mt-4 overflow-x-auto" style={{ maxHeight: "650px"}}>
          <div className="min-w-full bg-white shadow-lg rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
        
                {["No","Name","Email","Password","ContactNo","Dob","Doj","Role","Region","Status","Action"].map((header)=>(
                    <th key={header} className="px-4 py-2 text-left font-medium text-gray-500 uppercase" >
                        {header}
                    </th>
                ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr key={index}  className="hover:bg-gray-100 *:px-4">
                    <td className="py-3 whitespace-nowrap">{index + 1}</td>
                    <td className="py-3 whitespace-nowrap text-indigo-600">{user.Name}</td>
                    <td className="py-3 whitespace-nowrap">{user.email}</td>
                    <td className="py-3 whitespace-nowrap">{user.password}</td>
                    <td className="py-3 whitespace-nowrap">{user.ContactNo}</td>
                    <td className="py-3 whitespace-nowrap">{user.Dob}</td>
                    <td className="py-3 whitespace-nowrap">{user.Doj}</td>
                    <td className="py-3 whitespace-nowrap">{user.role}</td>
                    <td className="py-3 whitespace-nowrap">{user.region}</td>
                    <td className="py-3 whitespace-nowrap">
                      <button className="text-green-700 font-medium bg-green-200 rounded-lg px-2">
                        {user.status}
                      </button>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap space-x-2  ">
                      <button className="text-blue-600 hover:text-blue-900 " onClick={() => edituser({ _id: user._id })}>
                        Edit
                      </button>
                      {/* <button className="text-red-600 hover:text-red-900">Delete</button> */}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="11" className="text-center py-10">
                    <div className="flex flex-col items-center">
                      <p className="text-gray-600 mt-4 font-semibold text-2xl">No User List Found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>

            </table>
          </div>
        </div>
        {/* <div className="flex items-center gap-2 mr-4"><span className="text-sm text-gray-600">Total Users:{user.length} </span></div> */}
        
      </div>
    </>
  );
};

export default Userpage;
