import React from 'react'
import AppLayout from '@/app/restaurant/layout/AppLayout'
import Hero from '@/app/user/restaurants/components/Hero'
import GlassBG from '@/app/restaurant/layout/GlassBG'
import FoodSwiper from '../../components/FoodSwiper'

const page = async({params}) => {

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

  const { id } = await params;

  const completedOrder = completedOrders.find(
      (order) => order.id === parseInt(id)
  );

  if (!completedOrder) return <p className="text-white">Order not found</p>;

  return (
    <>
  <AppLayout>
  <Hero bgImage={completedOrder.image} route="/agent/orders">
    <div className="py-16 px-5 text-white">
      <h2 className="text-3xl font-semibold">
        Completed Order
      </h2>
      <p className="text-sm opacity-80 mt-1">
        Order ID #{completedOrder.id}
      </p>
    </div>
  </Hero>

  {/* Order Summary */}
  <div className="mx-5 mt-6 mb-3">
    <h2 className="text-xl font-semibold text-gray-900">
      Order Details
    </h2>
  </div>

  <GlassBG className="mb-24 rounded-2xl mx-5 p-5 space-y-6">

    {/* Status Badge */}
    <div className="flex items-center justify-between">
      <p className="text-sm text-gray-600">Order Status</p>
      <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
        Completed
      </span>
    </div>

    {/* Food Ordered */}
    <div className="space-y-2">
      <p className="text-sm font-medium text-[#A31621]">
        Food Ordered
      </p>
      <FoodSwiper />
    </div>

    {/* Divider */}
    <div className="border-t border-white/20" />

    {/* Buyer & Payment Info */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
      <p>
        <span className="text-[#A31621]">Buyer’s Name:</span>{" "}
        Isaac Bami
      </p>
      <p>
        <span className="text-[#A31621]">Buyer’s ID:</span>{" "}
        ETR4060
      </p>
      <p>
        <span className="text-[#A31621]">Time Ordered:</span>{" "}
        10:40 pm
      </p>
      <p>
        <span className="text-[#A31621]">Total Amount:</span>{" "}
        {completedOrder.price}
      </p>
    </div>

    {/* Divider */}
    <div className="border-t border-white/20" />

    {/* Pickup Info */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
      <p>
        <span className="text-[#A31621]">Pickup Agent:</span>{" "}
        Salami Lauo
      </p>
      <p>
        <span className="text-[#A31621]">Agent ID:</span>{" "}
        ETRA4060
      </p>
    </div>
  </GlassBG>
</AppLayout>


</>
  )
}

export default page