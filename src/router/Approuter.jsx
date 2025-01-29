import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Dashboardpage from '../components/Dashboardpage/Dashboardpage'
import Main from '../core/Main'
import Homepage from '../components/Home/Homepage'
import Orderpage from '../components/orderpage/Orderpage'
import Addorder from '../shared/components/Addorder'
import Weightmanagementpage from '../components/Weightmanagementpage/Weightmanagementpage'
import Deliveredmanpage from '../components/deliveredpage/deliverpage'


function Approuter() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route element={<Main />}>
            <Route path="/" element={<Homepage />}></Route>
            <Route path="/dashboard" element={<Dashboardpage />}></Route>
            <Route path="/Order" element={<Orderpage />}></Route>
            <Route path="/Addorder/:id?" element={<Addorder />} />
            <Route path="/Weightmanagementpage" element={<Weightmanagementpage />}></Route>
           <Route path="/delivered" element={<Deliveredmanpage/>}></Route>

            
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default Approuter;
