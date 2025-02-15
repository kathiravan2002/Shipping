import React, { useState } from 'react'
import { BrowserRouter, Route, Routes} from 'react-router-dom'
import Dashboardpage from '../components/Dashboardpage/Dashboardpage'
import Main from '../core/Main'
import Homepage from '../components/Home/Homepage'
import Orderpage from '../components/Orderpage/Orderpage'
import Addorder from '../shared/components/Addorder'
import Weightmanagementpage from '../components/Weightmanagementpage/Weightmanagementpage'
import { toast } from "react-toastify";
import LoginPage from '../core/LoginPage';
import ProtectedRoute from './ProtectedRoute';
import User from '../components/User/User';
import Adduser from '../shared/components/Adduser'
import Header from '../core/Header'
import Dispatchpage from '../components/Dispatchedpage/Dispatchpage'
import Outdeliverypage from '../components/Outdeliverypage/Outdeliverypage'
import Deliverpage from '../components/deliveredpage/deliverpage'
import Trackorder from '../shared/components/Trackorder'
import { Myorder } from '../shared/components/Myorder'

 
function Approuter() {
   
   
  const [isLoggedIn, setIsLoggedIn] = useState(
    // localStorage.getItem("isLoggedIn") === "true"
    localStorage.getItem("authToken") ? true : false
  );
 
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");
    localStorage.removeItem("authToken");
    localStorage.removeItem("Region");
    localStorage.removeItem('tokenExpiresAt');
    setIsLoggedIn(false);
      // window.location.href = "/login";
    toast.success("Logout successfully!"); 
  
  };



  return (
    <div>
    <BrowserRouter>
    <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <Routes>
           
          <Route path="/" element={<Homepage isLoggedIn={isLoggedIn} onLogout={handleLogout} />}/>
          <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn}  onLogout={handleLogout}/>} />
          <Route path='/Trackorder' element={<Trackorder/>} />
          {/* <Route path='/header' element={ <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />} /> */}
          <Route element={ <ProtectedRoute  isLoggedIn={isLoggedIn} onLogout={handleLogout}  ><Main />  </ProtectedRoute> }>
              <Route path="/dashboard" element={<Dashboardpage /> } />
              <Route path="/Order" element={ <Orderpage />  } />
              <Route path="/Addorder/:id?" element={<Addorder />} />
              <Route path="/Weightmanagementpage" element={<Weightmanagementpage />}></Route>
              <Route path="/User" element={<User />}></Route>
              <Route path='/Adduser/:id?' element={<Adduser />} /> 
              <Route path="/delivered" element={<Deliverpage/>} />
              <Route path="/dispatched" element={<Dispatchpage/>} />
              <Route path="/outfordelivery" element={<Outdeliverypage/>} />
              <Route path="/Myorder" element={ <Myorder />  } />
        </Route>
      </Routes> 
    </BrowserRouter>
  </div>
  );
}

export default Approuter;
