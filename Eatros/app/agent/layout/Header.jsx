import React from 'react'
import GlassBG from './GlassBG'
import Image from 'next/image'
import { Menu } from 'lucide-react'

const Header = () => {
  return (
    <div className='w-screen'>
  <GlassBG className='w-full'>
    <div className='py-3 flex justify-between items-center px-5 '>
    <Menu className='text-gray-600'/>
    <div className="relative w-12 h-12">
        <Image src='https://img.freepik.com/free-vector/young-man-with-short-hair_1308-174666.jpg?uid=R212574146&ga=GA1.1.982884454.1747171613&semt=ais_hybrid&w=740&q=80'
          alt="Profile picture"
          fill
          className="rounded-full object-cover"
          />
        
    </div>

    </div>
    </GlassBG>
    </div>
  

  )
}

export default Header