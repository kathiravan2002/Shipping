import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Dashboardpage from '../components/Dashboardpage/Dashboardpage'
import Main from '../core/Main'
import Homepage from '../components/Home/Homepage'

function Approuter() {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route element={<Main />}>
                    <Route path='/' element={<Homepage />}> </Route>

                        <Route path='/dashboard' element={<Dashboardpage />}> </Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default Approuter