import React from 'react'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'
import Header from './Header'

function Main() {
  return (
    <div>
        <Header/>
        <Sidebar/>
        <main className="w-full pt-10 lg:pt-5 px-4 sm:px-6 md:px-8 lg:ps-24">
            <Outlet/>
        </main>
    </div>
  )
}

export default Main