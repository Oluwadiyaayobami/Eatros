"use client"

import React from "react"
import { ArrowDownLeft, ArrowUpRight } from "lucide-react"
import GlassBG from "./GlassBG"

const MoneyIn_Out = () => {
  return (
    <div className="mx-5 mb-5">
      <GlassBG className="rounded-md">
        <div className="p-5 space-y-4">

          {/* Header */}
          <div className="flex items-center justify-between">
            <p className="text-gray-700/80 text-xs font-outfit">
              Money Flow
            </p>
            <span className="text-[10px] text-white/90">
              This week
            </span>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-2 gap-4">

            {/* Money In */}
            <div className="rounded-xl bg-green-500/10 border border-green-500/20 p-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-green-500/20">
                  <ArrowDownLeft size={16} className="text-green-700" />
                </div>
                <p className="text-xs text-white/70">Money In</p>
              </div>

              <p className="mt-3 text-lg font-semibold text-green-700">
                ₦320,500
              </p>
              <p className="text-[11px] text-white/50 mt-1">
                Orders & tips
              </p>
            </div>

            {/* Money Out */}
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500/20">
                  <ArrowUpRight size={16} className="text-red-700" />
                </div>
                <p className="text-xs text-white/70">Money Out</p>
              </div>

              <p className="mt-3 text-lg font-semibold text-red-700">
                ₦105,000
              </p>
              <p className="text-[11px] text-white/50 mt-1">
                Withdrawals
              </p>
            </div>

          </div>
        </div>
      </GlassBG>
    </div>
  )
}

export default MoneyIn_Out
