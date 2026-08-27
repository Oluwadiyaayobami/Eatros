"use client"
import React from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

import { fetchApi } from "@/utils/api"

const TopOrders = () => {
  const [pendingOrders, setPendingOrders] = React.useState([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await fetchApi('/orders/vendor')
        const allOrders = data.orders || []
        const pending = allOrders.filter(o => o.status === 'PENDING' || o.status === 'ACCEPTED_BY_VENDOR')
        setPendingOrders(pending.slice(0, 3))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  if (loading) {
     return <div className="p-4 text-center text-sm text-gray-500">Loading orders...</div>
  }

  return (
    <div className="pb-10">
      {/* Pending Orders */}
      <div className="mb-4">
        <h1 className="text-[22px] text-black font-bold mb-5 tracking-tight px-1">
          Pending Orders
        </h1>

        <div className="flex flex-col gap-6">
          {pendingOrders.length === 0 ? (
            <p className="text-gray-500 text-sm px-1">No pending orders at the moment.</p>
          ) : (
            pendingOrders.map((order) => (
              <Link key={order._id} href={`/restaurant/live-orders`}>
                <div className="flex gap-4 transition bg-transparent pr-2 border-b border-gray-100 pb-5 last:border-0 last:pb-0">
                  <div className="w-[100px] h-[100px] shrink-0 rounded-2xl overflow-hidden bg-gray-50 shadow-sm border border-gray-100/50">
                    <img
                      src={order.items[0]?.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80"}
                      alt="Order Item"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col flex-1 justify-between py-0.5 relative">
                    <div>
                      <div className="flex justify-between items-start mb-1.5">
                        <h2 className="text-[15px] font-bold text-gray-900 leading-snug tracking-tight">
                          {order.items[0]?.name || "Order Item"} {order.items.length > 1 && `+${order.items.length - 1} more`}
                        </h2>
                        <span className="text-gray-600 text-[13px] font-semibold">
                          ₦{(order.totalAmount || 0).toLocaleString('en-NG')}
                        </span>
                      </div>
                      <p className="text-gray-400 text-[13px] font-medium">
                        Total Items: {order.items.reduce((acc, item) => acc + (item.quantity || 1), 0)}
                      </p>
                    </div>
                    <div className="flex justify-between items-end mt-2">
                      <span className="text-[10px] font-bold bg-[#fff7d1] text-[#b48924] rounded-full px-3 py-1 w-fit">
                        {order.status === 'PENDING' ? 'Pending' : 'Accepted'}
                      </span>
                      <ChevronRight size={18} className="text-gray-400 hover:text-gray-700 transition" strokeWidth={2.5} />
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        <div className="flex justify-center mt-8">
          <Link href="/restaurant/orders" className="text-center text-black text-sm font-bold underline cursor-pointer hover:text-gray-700 transition">
            See More
          </Link>
        </div>
      </div>
    </div>
  )
}

export default TopOrders
