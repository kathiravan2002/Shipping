import React from 'react'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'
import Header from './Header'

function Main() {
  return (
    <div>

        <Sidebar/>
        <Header />
        <main className="w-full pt-4 lg:pt-5 px-4 sm:px-6 md:px-8l lg:ps-24 md:ps-24 sm:ps-24 ps-20 ">
            <Outlet/>
        </main>
    </div>
  )
}

export default Main