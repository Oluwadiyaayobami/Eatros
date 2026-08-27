"use client";
import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, ChevronDown, ChevronUp, FileText, X, AlertTriangle } from "lucide-react";
import AppLayout from "../layout/AppLayout";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/utils/api";
import toast from "react-hot-toast";
import { uploadImageToCloudinary } from "@/utils/cloudinary";
import { Loader2 } from "lucide-react";

export default function FoodMenu() {
  const router = useRouter();
  
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [collectionImage, setCollectionImage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  
  const fileInputRef = React.useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [collectionToDelete, setCollectionToDelete] = useState(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const fetchProducts = async () => {
    try {
      // Fetch products
      const data = await fetchApi('/vendor/my-products');
      const products = data.products || [];
      
      // Fetch vendor profile for saved collections
      const collectionsData = await fetchApi('/vendor/collections');
      const savedCollections = collectionsData.collections || [];
      
      // Group products by category
      const grouped = {};
      products.forEach(p => {
        const cat = p.category || "Uncategorized";
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push(p);
      });

      // Build categories list from saved collections first
      const formattedCategories = savedCollections.map(c => ({
        id: c.name,
        name: c.name,
        image: c.image,
        items: (grouped[c.name] || []).map(p => ({
           id: p._id,
           name: p.name,
           price: p.price,
           image: p.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80"
        })),
        isExpanded: true
      }));

      // Find any categories that have products but aren't in savedCollections (fallback)
      Object.keys(grouped).forEach(catName => {
        if (!formattedCategories.find(c => c.name === catName)) {
           formattedCategories.push({
             id: catName,
             name: catName,
             image: "",
             items: grouped[catName].map(p => ({
                id: p._id,
                name: p.name,
                price: p.price,
                image: p.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80"
             })),
             isExpanded: true
           });
        }
      });

      setCategories(formattedCategories);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  // Load from API
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get("new_collection") === "true") {
      setIsModalOpen(true);
      window.history.replaceState({}, '', window.location.pathname);
    }
    fetchProducts();
  }, []);

  const toggleCategory = (id) => {
    setCategories(categories.map((cat) =>
      cat.id === id ? { ...cat, isExpanded: !cat.isExpanded } : cat
    ));
  };

  const handleCreateCollection = async (e) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;

    const newColName = newCollectionName.trim();

    const newCol = {
      id: newColName,
      name: newColName,
      image: collectionImage,
      items: [],
      isExpanded: true,
    };

    try {
      await fetchApi('/vendor/collections', {
        method: 'POST',
        body: JSON.stringify({ name: newColName, image: collectionImage })
      });

      setCategories([...categories, newCol]);
      setNewCollectionName("");
      setCollectionImage("");
      setIsModalOpen(false);
      toast.success("Collection created successfully!");
    } catch (err) {
      toast.error("Failed to save collection to database");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadImageToCloudinary(file);
      setCollectionImage(url);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteCollection = (e, id, name) => {
    e.stopPropagation();
    setCollectionToDelete({ id, name });
    setDeleteConfirmText("");
    setDeleteModalOpen(true);
  };

  const confirmDeleteCollection = async () => {
    if (!collectionToDelete) return;
    if (deleteConfirmText !== collectionToDelete.name) {
      toast.error("Collection name doesn't match");
      return;
    }
    
    const { id, name } = collectionToDelete;
    const toastId = toast.loading(`Deleting ${name}...`);
    try {
      await fetchApi(`/vendor/products/category/${encodeURIComponent(name)}`, {
        method: 'DELETE',
      });
      
      const updated = categories.filter(c => c.id !== id);
      setCategories(updated);
      
      setDeleteModalOpen(false);
      setCollectionToDelete(null);
      setDeleteConfirmText("");
      toast.success(`Collection ${name} deleted successfully!`, { id: toastId });
    } catch (error) {
      toast.error(`Failed to delete ${name}`, { id: toastId });
      console.error(error);
    }
  };

  return (
    <AppLayout>
      <div className="p-4 md:p-8 lg:px-12 xl:px-16 pb-24">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-[28px] font-extrabold text-gray-900 tracking-tight">Food Menu</h1>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-md text-sm font-semibold text-gray-700 hover:bg-gray-50 shadow-sm transition-colors">
              <FileText size={16} className="text-gray-500" />
              Import from CSV
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-[#ED4A60] text-white rounded-md text-sm font-semibold hover:bg-rose-600 shadow-sm transition-colors"
            >
              <Plus size={16} />
              Add new collection
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-4 max-w-5xl">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-gray-200 border-t-[#ED4A60] rounded-full animate-spin"></div>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500">No collections found. Create one to get started!</p>
            </div>
          ) : categories.map((category) => (
            <div key={category.id} className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 overflow-hidden">
              
              {/* Category Header */}
              <div 
                className="flex items-center justify-between p-5 cursor-pointer select-none"
                onClick={() => toggleCategory(category.id)}
              >
                <div className="flex items-center gap-4">
                  <h2 className="text-lg font-bold text-gray-900">{category.name}</h2>
                  <span className="text-[13px] font-medium text-gray-400">{category.items.length} {category.items.length === 1 ? 'item' : 'items'}</span>
                </div>
                
                <div className="flex items-center gap-4">
                  {category.items.length === 0 ? (
                    <button 
                      onClick={(e) => { e.stopPropagation(); router.push(`/restaurant/products/create?collectionId=${category.id}`); }}
                      className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded text-[13px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Plus size={14} className="text-gray-500" /> Add item
                    </button>
                  ) : (
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3 text-gray-400">
                        <Plus 
                          size={18} 
                          className="cursor-pointer hover:text-gray-700 transition-colors" 
                          onClick={(e) => { e.stopPropagation(); router.push(`/restaurant/products/create?collectionId=${category.id}`); }} 
                        />
                        <Edit size={18} className="cursor-pointer hover:text-gray-700 transition-colors" onClick={(e) => e.stopPropagation()} />
                        <Trash2 size={18} className="cursor-pointer hover:text-red-500 transition-colors" onClick={(e) => handleDeleteCollection(e, category.id, category.name)} />
                      </div>
                      <div className="text-gray-400">
                        {category.isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Category Expanded Content */}
              {category.isExpanded && category.items.length > 0 && (
                <div className="p-5 pt-0 border-t border-gray-100 mt-1">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 mt-5">
                    
                    {category.items.map((item) => (
                      <div key={item.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <img src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80"} alt={item.name} className="w-full h-36 object-cover" />
                        <div className="p-4">
                          <h3 className="font-bold text-[15px] text-gray-900 truncate">{item.name}</h3>
                          <p className="text-sm font-semibold text-[#ED4A60] mt-1">₦{Number(item.price).toLocaleString('en-NG')}</p>
                        </div>
                      </div>
                    ))}

                    {/* Add Item Placeholder */}
                    <div 
                      onClick={() => router.push(`/restaurant/products/create?collectionId=${category.id}`)}
                      className="bg-gray-50/50 rounded-xl border border-gray-100 flex flex-col items-center justify-center min-h-[190px] cursor-pointer hover:bg-gray-50 transition-colors group"
                    >
                      <div className="w-14 h-14 bg-[#ED4A60] rounded-full flex items-center justify-center text-white mb-3 shadow-md group-hover:scale-105 transition-transform">
                        <Plus size={24} />
                      </div>
                      <span className="font-bold text-[15px] text-gray-900">Add item</span>
                    </div>

                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Create Collection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Create New Collection</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreateCollection} className="p-5">
              <p className="text-xs text-gray-500 mb-5 bg-orange-50 text-orange-700 p-3 rounded-lg border border-orange-100">
                <strong>Note:</strong> Make sure all products you add to this collection are related to it!
              </p>
              
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Collection Name</label>
                <input 
                  type="text" 
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  placeholder="e.g. Ice Creams, Pasta..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-[#ED4A60] focus:ring-1 focus:ring-[#ED4A60] transition-shadow"
                  autoFocus
                  required
                />
              </div>

              {/* Collection Image Upload */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Collection Image</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors relative overflow-hidden h-32"
                >
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleImageUpload} 
                  />
                  {isUploading ? (
                    <div className="flex flex-col items-center text-gray-400">
                      <Loader2 size={24} className="animate-spin mb-2" />
                      <span className="text-xs font-medium">Uploading...</span>
                    </div>
                  ) : collectionImage ? (
                    <img src={collectionImage} alt="Collection Preview" className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <>
                      <div className="w-10 h-10 bg-rose-100 text-[#ED4A60] rounded-full flex items-center justify-center mb-2">
                        <Plus size={20} />
                      </div>
                      <p className="text-xs font-medium text-gray-600">Tap to upload image</p>
                    </>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-[#ED4A60] text-white font-bold rounded-xl hover:bg-rose-600 shadow-md shadow-rose-500/20 transition-colors"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && collectionToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in zoom-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="bg-red-50 p-6 flex flex-col items-center border-b border-red-100">
              <div className="bg-red-100 p-3 rounded-full mb-4">
                <AlertTriangle size={32} className="text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-red-700 text-center">Delete Collection</h2>
              <p className="text-red-600 text-sm mt-2 text-center font-medium">
                Warning: This will permanently delete <strong>{collectionToDelete.name}</strong> and <span className="underline">ALL products inside it</span>. This action cannot be undone.
              </p>
            </div>
            
            <div className="p-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Type <strong>{collectionToDelete.name}</strong> to confirm
              </label>
              <input
                type="text"
                placeholder={collectionToDelete.name}
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              />
              
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setDeleteModalOpen(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteCollection}
                  disabled={deleteConfirmText !== collectionToDelete.name}
                  className={`flex-1 px-4 py-3 text-white rounded-xl font-semibold transition-colors ${
                    deleteConfirmText === collectionToDelete.name
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-red-300 cursor-not-allowed"
                  }`}
                >
                  Delete Forever
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}