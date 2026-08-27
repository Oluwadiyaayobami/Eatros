"use client"

import React from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import GlassBG from "./GlassBG"

const pendingOrders = [
  {
    id: 1,
    name: "Jollof Rice & Chicken",
    image:
      "https://plus.unsplash.com/premium_photo-1694141252774-c937d97641da?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=600",
    quantity: "2 plates",
    price: "₦3,200",
  },
  {
    id: 2,
    name: "Spaghetti Bolognese",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_d7U7azBd3LeDGooqwgaiZwK_NT20IrciB21AXbwCwORu641xipHgOaIUebwQJTlX_kw&usqp=CAU",
    quantity: "1 plate",
    price: "₦2,500",
  },
  {
    id: 3,
    name: "Fried Rice & Turkey",
    image:
      "https://images.unsplash.com/photo-1553621042-f6e147245754?w=800&q=80",
    quantity: "3 plates",
    price: "₦4,500",
  },
  {
    id: 4,
    name: "Yam & Egg Sauce",
    image:
      "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800&q=80",
    quantity: "1 plate",
    price: "₦1,800",
  },
  {
    id: 5,
    name: "Pounded Yam & Egusi",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvJm3oF0NEj2-3iQUvoStknLqRXZL3AclnzgOFGPLzO4pFnLKsOqjTFQe7Iw8ZmxRb7EI&usqp=CAU",
    quantity: "2 plates",
    price: "₦3,000",
  },
  {
    id: 6,
    name: "Beans & Plantain",
    image:
      "https://media.istockphoto.com/id/1198712283/photo/chile.webp?a=1&b=1&s=612x612&w=0&k=20&c=YunbqqErACUq3_jlV0xDsfTz2IrAZ5S3AUTFUfPvRFA=",
    quantity: "1 plate",
    price: "₦1,500",
  },
]

const completedOrders = [
  {
    id: 1,
    name: "Pounded Yam & Egusi",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvJm3oF0NEj2-3iQUvoStknLqRXZL3AclnzgOFGPLzO4pFnLKsOqjTFQe7Iw8ZmxRb7EI&usqp=CAU",
    quantity: "1 plate",
    price: "₦2,800",
  },
  {
    id: 2,
    name: "Fried Rice & Turkey",
    image:
      "https://images.unsplash.com/photo-1553621042-f6e147245754?w=800&q=80",
    quantity: "2 plates",
    price: "₦4,000",
  },
  {
    id: 3,
    name: "Beans & Plantain",
    image:
      "https://media.istockphoto.com/id/1198712283/photo/chile.webp?a=1&b=1&s=612x612&w=0&k=20&c=YunbqqErACUq3_jlV0xDsfTz2IrAZ5S3AUTFUfPvRFA=",
    quantity: "3 plates",
    price: "₦4,500",
  },
  {
    id: 4,
    name: "Jollof Rice & Chicken",
    image:
      "https://plus.unsplash.com/premium_photo-1694141252774-c937d97641da?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=600",
    quantity: "2 plates",
    price: "₦3,200",
  },
  {
    id: 5,
    name: "Spaghetti Bolognese",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_d7U7azBd3LeDGooqwgaiZwK_NT20IrciB21AXbwCwORu641xipHgOaIUebwQJTlX_kw&usqp=CAU",
    quantity: "1 plate",
    price: "₦2,500",
  },
  {
    id: 6,
    name: "Yam & Egg Sauce",
    image:
      "https://media.istockphoto.com/id/1198712283/photo/chile.webp?a=1&b=1&s=612x612&w=0&k=20&c=YunbqqErACUq3_jlV0xDsfTz2IrAZ5S3AUTFUfPvRFA=",
    quantity: "1 plate",
    price: "₦1,800",
  },
]

const OrdersTab = ({ activeTab, setActiveTab }) => {
  const data = activeTab === "pending" ? pendingOrders : completedOrders

  return (
    <div className="px-5 mt-10 mb-26">
      {/* Toggle Tabs */}
      <div className="relative grid grid-cols-2 border-b border-gray-700/20 pb-0.5 mb-6">
        {/* Buttons */}
        <button
          onClick={() => setActiveTab("pending")}
          className={`pb-2 text-base font-medium transition-colors ${activeTab === "pending"
              ? "text-[#A31621]"
              : "text-gray-700/70 hover:text-[#A31621]"
            }`}
        >
          Pending Orders
        </button>

        <button
          onClick={() => setActiveTab("completed")}
          className={`pb-2 text-base font-medium transition-colors ${activeTab === "completed"
              ? "text-[#A31621]"
              : "text-gray-700/70 hover:text-[#A31621]"
            }`}
        >
          Completed Orders
        </button>

        {/* Sliding underline */}
        <span
          className={`absolute bottom-0 left-0 w-1/2 h-[2px] bg-[#A31621] transition-transform duration-300 ease-in-out ${activeTab === "completed" ? "translate-x-full" : "translate-x-0"
            }`}
        />
      </div>


      {/* Orders List */}
      <h1 className="text-2xl text-[#A31621] font-medium mb-6">
        {activeTab === "pending" ? "Pending Orders" : "Completed Orders"}
      </h1>

      {data.map((order) => (
        <Link key={order.id} href={`/restaurant/orders/${activeTab === "pending" ? 'pending' : 'completed'}/${order.id}`}>
          <GlassBG className="flex items-center gap-4 transition mb-2 rounded-xl pr-2">
            <img
              src={order.image}
              alt={order.name}
              className="w-24 h-24 object-cover rounded-l-xl"
            />
            <div className="flex flex-col flex-1">
              <h2 className="text-lg font-semibold text-[#A31621]">
                {order.name}
              </h2>
              <p className="text-white text-sm pb-3">
                {order.quantity} • {order.price}
              </p>
              <p
                className={`text-[10px] rounded-full w-fit px-2 py-0.5 ${activeTab === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                  }`}
              >
                {activeTab === "pending" ? "Pending" : "Completed"}
              </p>
            </div>
            <ChevronRight size={18} className="text-gray-600" />
          </GlassBG>
        </Link>
      ))}
    </div>
  )
}

export default OrdersTab
