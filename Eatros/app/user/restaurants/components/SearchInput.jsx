import React from 'react'
import GlassBG from '../../layout/GlassBG'
import { Search } from 'lucide-react'

const SearchInput = () => {
  return (
    <GlassBG className="flex items-center gap-2 px-4 py-2 mx-5 rounded-full ">
    <Search className="text-gray-600" />
    <input
      type="text"
      placeholder="Search..."
      className="bg-transparent outline-none text-gray-700 placeholder-gray-700 w-full"
    />
  </GlassBG>
  
  )
}

export default SearchInput