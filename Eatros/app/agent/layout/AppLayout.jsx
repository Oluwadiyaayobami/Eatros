import React from 'react'
import Header from './Header'
import BottomNav from './BottomNav'

const AppLayout = ({ children }) => {
    return (
        <div className='min-h-screen bg-neutral-300  overflow-hidden relative text-black '>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="animated-gradient"></div>
            </div>
            <div className="glass-layer absolute inset-0"></div>
            <div className='relative  pb-[calc(6rem+env(safe-area-inset-bottom))'>
                <Header />
                {children}
            </div>
            <BottomNav />
        </div>
    )
}

export default AppLayout