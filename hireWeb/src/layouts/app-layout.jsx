import { Header } from '@/components/header'
import React from 'react'
import { Outlet } from 'react-router-dom'

const AppLayout = () => {
  return (
    <>
      <div>
        <div className='grid-background'></div>
        <main className='min-h-screen h-1 container pr-8 pl-8'>
          <Header />
          <Outlet />
        </main>
        <footer className=' p-5 text-center bg-gray-800 mt-10'>Built by Maaz Amir</footer>
      </div>
    </>
  )
}

export default AppLayout