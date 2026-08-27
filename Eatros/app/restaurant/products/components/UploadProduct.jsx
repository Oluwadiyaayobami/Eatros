"use client"

import React from 'react'
import { Plus } from 'lucide-react'
import Link from 'next/link'

const UploadProduct = () => {
    return (
        <div className='m-5'>
            <div className='flex justify-end'>
            <Link href="/restaurant/products/create" className='bg-[#A31621] text-white py-2 px-10 rounded-full flex justify-center items-center gap-1 hover:bg-red-800 transition'>
                <Plus size={20} />
                Upload A Product
            </Link>
            </div>
        </div>
    )
}

export default UploadProduct