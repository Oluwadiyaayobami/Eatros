"use client"

import React, { useState } from "react"
import { ArrowDownLeft, ArrowUpRight, X } from "lucide-react"
import GlassBG from "./GlassBG"

const transactions = [
    {
        id: 1,
        type: "credit",
        title: "Order payment",
        amount: "₦25,000",
        date: "Today • 2:40 PM",
        ref: "ETR-90821",
        status: "Completed",
    },
    {
        id: 2,
        type: "debit",
        title: "Wallet withdrawal",
        amount: "₦15,000",
        date: "Yesterday • 11:10 AM",
        ref: "WDR-77210",
        status: "Processed",
    },
    {
        id: 3,
        type: "credit",
        title: "Tips & bonus",
        amount: "₦8,500",
        date: "2 days ago",
        ref: "TIP-12092",
        status: "Completed",
    },
]

const TransactionHistory = () => {
    const [selectedTx, setSelectedTx] = useState(null)

    return (
        <>
            {/* Transaction List */}
            <div className="mb-28 mx-5">
                <GlassBG className="rounded-md">
                    <div className="p-5">
                        <p className="text-xs text-gray-700/80 font-outfit mb-3">
                            Transaction History
                        </p>

                        <div className="max-h-[260px] overflow-y-auto space-y-3 pr-1">
                            {transactions.map((tx) => (
                                <button
                                    key={tx.id}
                                    onClick={() => setSelectedTx(tx)}
                                    className="w-full flex items-center justify-between p-3 rounded-md bg-white/10 hover:bg-white/10 transition"
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-9 h-9 rounded-full flex items-center justify-center
                        ${tx.type === "credit"
                                                    ? "bg-green-500/20 text-green-700"
                                                    : "bg-red-500/20 text-red-700"
                                                }`}
                                        >
                                            {tx.type === "credit" ? (
                                                <ArrowDownLeft size={16} />
                                            ) : (
                                                <ArrowUpRight size={16} />
                                            )}
                                        </div>

                                        <div className="text-left">
                                            <p className="text-sm text-white">
                                                {tx.title}
                                            </p>
                                            <p className="text-[11px] text-white/70">
                                                {tx.date}
                                            </p>
                                        </div>
                                    </div>

                                    <p
                                        className={`text-sm font-medium ${tx.type === "credit"
                                                ? "text-green-700"
                                                : "text-red-700"
                                            }`}
                                    >
                                        {tx.type === "credit" ? "+" : "-"}
                                        {tx.amount}
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>
                </GlassBG>
            </div>

            {/* Overlay / Modal */}
            {selectedTx && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">

                    {/* Overlay */}
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-md"
                        onClick={() => setSelectedTx(null)}
                    />

                    {/* Receipt Modal */}
                    <div className="relative z-50 w-[90%] max-w-sm rounded-2xl bg-white shadow-xl">
                        <div className="p-5 space-y-5">

                            {/* Header */}
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-semibold text-gray-700">
                                    Transaction Receipt
                                </p>
                                <button
                                    onClick={() => setSelectedTx(null)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Amount */}
                            <div className="text-center">
                                <p
                                    className={`text-2xl font-semibold ${selectedTx.type === "credit"
                                            ? "text-green-600"
                                            : "text-red-600"
                                        }`}
                                >
                                    {selectedTx.type === "credit" ? "+" : "-"}
                                    {selectedTx.amount}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {selectedTx.type === "credit" ? "Credit" : "Debit"}
                                </p>
                            </div>

                            {/* Divider */}
                            <div className="border-t border-dashed border-gray-200" />

                            {/* Details */}
                            <div className="space-y-3 text-sm text-gray-700">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Status</span>
                                    <span>{selectedTx.status}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-500">Reference</span>
                                    <span className="font-mono text-xs">{selectedTx.ref}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-500">Date</span>
                                    <span>{selectedTx.date}</span>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="border-t border-dashed border-gray-200" />

                            {/* Footer */}
                            <p className="text-center text-[11px] text-gray-400">
                                Thank you for using Eatro
                            </p>
                        </div>
                    </div>
                </div>
            )}

        </>
    )
}

export default TransactionHistory
