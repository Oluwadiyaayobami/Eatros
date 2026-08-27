"use client"
import React, { useState, useEffect, Suspense } from 'react'
import AppLayout from '../../layout/AppLayout'
import { Camera, Save, ArrowLeft } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { fetchApi } from '@/utils/api'
import toast from 'react-hot-toast'
import { uploadImageToCloudinary } from '@/utils/cloudinary'
import { Loader2 } from 'lucide-react'

const ProductForm = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const collectionId = searchParams.get('collectionId')

  const [loading, setLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [productImage, setProductImage] = useState("")
  const fileInputRef = React.useRef(null)

  const [collections, setCollections] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discountPrice: '',
    category: '', // will be set dynamically
    status: 'Published',
    availability: 'Available',
    stock: ''
  })

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const data = await fetchApi('/vendor/my-products');
        const products = data.products || [];
        
        // Extract unique categories
        const uniqueCategories = [...new Set(products.map(p => p.category))].filter(Boolean);
        
        // Fetch user collections
        const profileData = await fetchApi('/vendor/collections');
        const savedCollections = profileData.collections || [];
        
        // Add saved collections to unique categories if not present
        savedCollections.forEach(sc => {
          if (!uniqueCategories.includes(sc.name)) {
             uniqueCategories.push(sc.name);
          }
        });

        const formatted = uniqueCategories.map(name => ({ id: name, name }));
        setCollections(formatted);
        
        if (collectionId && formatted.find(c => c.id === collectionId)) {
           setFormData(prev => ({...prev, category: collectionId}));
        } else if (formatted.length > 0) {
           setFormData(prev => ({...prev, category: formatted[0].id}));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCollections();
  }, [collectionId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.category) {
      toast.error("Please select or create a collection first.");
      return;
    }
    
    if (!productImage) {
      toast.error("Please upload a product image.");
      return;
    }

    setLoading(true)
    
    try {
      await fetchApi('/vendor/products', {
        method: 'POST',
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: Number(formData.price),
          category: formData.category,
          imageUrl: productImage,
          isAvailable: formData.availability === 'Available'
        })
      });
      toast.success("Product created successfully!");
      router.push('/restaurant/products');
    } catch (err) {
      toast.error("Failed to create product");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadImageToCloudinary(file);
      setProductImage(url);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="px-5 py-4 pb-20">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="p-2 bg-white rounded-full shadow-sm">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-gray-800">Add New Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload Area */}
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="bg-white/60 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-white/40 flex flex-col items-center justify-center min-h-[160px] border-dashed border-2 border-gray-300 cursor-pointer hover:bg-gray-50 transition-colors relative overflow-hidden"
        >
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
          />
          {isUploading ? (
            <div className="flex flex-col items-center text-gray-400 z-10">
              <Loader2 size={32} className="animate-spin mb-3 text-[#ED4A60]" />
              <span className="text-sm font-medium">Uploading...</span>
            </div>
          ) : productImage ? (
            <img src={productImage} alt="Product Preview" className="absolute inset-0 w-full h-full object-contain bg-gray-50 rounded-xl" />
          ) : (
            <>
              <div className="w-12 h-12 bg-rose-100 text-[#ED4A60] rounded-full flex items-center justify-center mb-3">
                <Camera size={24} />
              </div>
              <p className="text-sm font-medium text-gray-600">Tap to upload images</p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
            </>
          )}
        </div>

        <div className="bg-white/60 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-white/40 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="e.g. Vanilla Ice Cream" className="w-full bg-white border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#ED4A60]" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="3" placeholder="Describe the item..." className="w-full bg-white border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#ED4A60]"></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₦)</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} required placeholder="0.00" className="w-full bg-white border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#ED4A60]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discount (₦)</label>
              <input type="number" name="discountPrice" value={formData.discountPrice} onChange={handleChange} placeholder="Optional" className="w-full bg-white border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#ED4A60]" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Collection</label>
            <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#ED4A60]">
              {collections.length === 0 && <option value="">No collections available</option>}
              {collections.map(col => (
                <option key={col.id} value={col.id}>{col.name}</option>
              ))}
            </select>
            {collections.length === 0 && (
               <p className="text-xs text-red-500 mt-1">Please go back and create a collection first.</p>
            )}
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-white/40 space-y-4">
          <h3 className="font-semibold text-gray-800">Inventory & Status</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
            <select name="availability" value={formData.availability} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#ED4A60]">
              <option value="Available">Available</option>
              <option value="Out of stock">Out of stock</option>
              <option value="Temporarily unavailable">Temporarily unavailable</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#ED4A60]">
              <option value="Published">Publish Immediately</option>
              <option value="Draft">Save as Draft</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
            <input type="number" name="stock" value={formData.stock} onChange={handleChange} placeholder="Leave empty for unlimited" className="w-full bg-white border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#ED4A60]" />
          </div>
        </div>

        <button disabled={loading} type="submit" className="w-full bg-[#ED4A60] text-white rounded-xl p-4 font-semibold shadow-md flex items-center justify-center gap-2 hover:bg-rose-600 transition">
          {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Save size={20} />}
          {loading ? "Saving Product..." : "Save Product"}
        </button>
      </form>
    </div>
  )
}

const CreateProduct = () => {
  return (
    <AppLayout>
      <Suspense fallback={<div className="p-10 flex justify-center"><div className="animate-spin w-8 h-8 border-4 border-[#ED4A60] border-t-transparent rounded-full"></div></div>}>
        <ProductForm />
      </Suspense>
    </AppLayout>
  )
}

export default CreateProduct
