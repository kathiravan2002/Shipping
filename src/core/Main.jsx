import React from 'react'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'

function Main() {
  return (
    <div>

        <Sidebar/>
        <main className="w-full pt-10 lg:pt-5 px-4 sm:px-6 md:px-8 lg:ps-[19rem]">
            <Outlet/>
        </main>
    </div>
  )
}

export default Main