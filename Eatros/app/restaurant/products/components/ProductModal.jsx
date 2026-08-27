"use client";

import React, { useState, useEffect } from "react";
import { X, UploadCloud } from "lucide-react";

const ProductModal = ({ setProductModal, selectedProduct }) => {


  const isEdit = Boolean(selectedProduct);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (isEdit) {
      setName(selectedProduct.name);
      setPrice(selectedProduct.price);
      setImagePreview(selectedProduct.image);
    }
  }, [isEdit, selectedProduct]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Blurry background */}
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-md"
          onClick={() => setProductModal(false)}
        />

        {/* Modal */}
        <div className="relative z-50 w-[90%] max-w-md rounded-2xl bg-white shadow-xl p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              {isEdit ? "Edit Product" : "Add Product"}
            </h2>
            <button
              onClick={() => setProductModal(false)}
              className="text-gray-500 hover:text-red-500 transition"
            >
              <X />
            </button>
          </div>

          {/* Image Upload */}
          <label className="flex flex-col items-center justify-center w-full h-50 border-2 border-dashed rounded-xl cursor-pointer hover:border-[#A31621] transition mb-4">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              <>
                <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">
                  Click to upload product image
                </p>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>

          {/* Product Name */}
          <div className="mb-3">
            <label className="text-sm text-gray-600">Product Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Product name"
              className="w-full mt-1 px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#A31621]"
            />
          </div>

          {/* Price */}
          <div className="mb-5">
            <label className="text-sm text-gray-600">Price (₦)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Price (₦)"
              className="w-full mt-1 px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#A31621]"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => setProductModal(false)}
              className="w-full py-2 rounded-full border text-gray-600 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button className="w-full py-2 rounded-full bg-green-600 text-white  transition">
            {isEdit ? "Update Product" : "Add Product"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductModal;
