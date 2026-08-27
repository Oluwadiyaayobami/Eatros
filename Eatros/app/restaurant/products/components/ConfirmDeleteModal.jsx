"use client";

import React from "react";
import { X, Trash2 } from "lucide-react";

const ConfirmDeleteModal = ({ product, setDeleteModal }) => {
  const handleDelete = () => {
    console.log("Deleting product:", product);
    // 👉 Call API / Firebase delete here
    setDeleteModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-md"
        onClick={() => setDeleteModal(false)}
      />

      {/* Modal */}
      <div className="relative z-50 w-[90%] max-w-sm bg-white rounded-2xl p-6 shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-gray-800">
            Confirm Delete
          </h2>
          <button onClick={() => setDeleteModal(false)}>
            <X className="text-gray-500 hover:text-red-500" />
          </button>
        </div>

        {/* Content */}
        <p className="text-sm text-gray-600 mb-5">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-gray-800">
            {product?.name}
          </span>
          ? This action cannot be undone.
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => setDeleteModal(false)}
            className="w-full py-2 rounded-full cursor-pointer border text-gray-600 hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            className="w-full py-2 rounded-full cursor-pointer bg-red-600 text-white flex items-center justify-center gap-2 hover:bg-red-700 transition"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
