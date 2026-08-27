"use client";

import React, { useState } from "react";
import { ChevronLeft, UploadCloud, CheckCircle2, FileText, Camera } from "lucide-react";
import { useRouter } from "next/navigation";
import { uploadStrictlyPrivateImage } from "../../../utils/cloudinary";
import { fetchApi } from "../../../utils/api";
import toast from "react-hot-toast";

const KycPage = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [docType, setDocType] = useState("");
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [selfieImage, setSelfieImage] = useState(null);
  const [vehicleType, setVehicleType] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [operatingZone, setOperatingZone] = useState("");
  
  const [isUploading, setIsUploading] = useState(false);
  const [kycStatus, setKycStatus] = useState("none");
  const [submittedData, setSubmittedData] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  React.useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchApi('/agent/profile');
        if (data.user?.agentDetails) {
          setKycStatus(data.user.agentDetails.kycStatus || "none");
          setSubmittedData(data.user.agentDetails);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoadingData(false);
      }
    };
    loadProfile();
  }, []);

  const handleFileChange = (e, setter) => {
    if (e.target.files && e.target.files[0]) {
      setter(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsUploading(true);
      toast.loading("Uploading documents securely...", { id: "kyc" });

      // 1. Upload files securely to Cloudinary as private
      const frontUrl = await uploadStrictlyPrivateImage(frontImage);
      const backUrl = await uploadStrictlyPrivateImage(backImage);
      const selfieUrl = await uploadStrictlyPrivateImage(selfieImage);

      await fetchApi('/agent/kyc', {
        method: 'POST',
        body: JSON.stringify({
          idType: docType,
          idDocumentUrl: frontUrl, 
          idDocumentBackUrl: backUrl,
          selfieUrl: selfieUrl,
          vehicleType,
          licensePlate,
          operatingZone
        })
      });

      toast.success("Documents submitted successfully!", { id: "kyc" });
      setKycStatus("pending");
      setSubmittedData({
        idType: docType,
        idDocumentUrl: frontUrl,
        idDocumentBackUrl: backUrl,
        selfieUrl: selfieUrl,
        vehicleType,
        licensePlate,
        operatingZone
      });
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to submit KYC documents", { id: "kyc" });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-[#F8F9FA] min-h-screen w-full font-sans flex flex-col">
      {/* Header */}
      <div className="px-6 pt-12 pb-4 flex items-center justify-between sticky top-0 bg-[#F8F9FA]/90 backdrop-blur-md z-10">
        <button 
          onClick={() => {
            if(step > 1) setStep(step - 1);
            else router.push("/agent/home_dashboard");
          }}
          className="p-2 -ml-2 active:scale-95 transition-transform"
        >
          <ChevronLeft size={24} className="text-gray-900" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Identity Verification</h1>
        <div className="w-8"></div>
      </div>

      <div className="px-6 flex-1 flex flex-col">
        {isLoadingData ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500 font-medium">Loading...</p>
          </div>
        ) : kycStatus === "approved" ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in duration-300">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 size={48} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Verified Agent</h2>
            <p className="text-gray-500 mb-8 px-4">Your identity has been verified. You now have full access to all dashboard features.</p>
            <button 
              onClick={() => router.push("/agent/home_dashboard")}
              className="w-full bg-[#111] hover:bg-black active:scale-95 transition-all text-white font-bold text-lg py-5 rounded-2xl shadow-lg mt-auto mb-8"
            >
              Go to Dashboard
            </button>
          </div>
        ) : kycStatus === "pending" ? (
          <div className="flex-1 flex flex-col items-center pt-8 text-center animate-in slide-in-from-bottom duration-300">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-sm">
              <FileText size={32} className="text-orange-500" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Awaiting Admin Review</h2>
            <p className="text-gray-500 text-sm mb-8 px-4">Your documents have been submitted securely and are currently being reviewed by our team.</p>
            
            <div className="w-full bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-left mb-6">
              <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Submitted Data</h3>
              
              <div className="mb-4">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">ID Type</p>
                <p className="text-gray-900 font-medium">{submittedData?.idType || "ID Document"}</p>
              </div>

              {submittedData?.idDocumentUrl && (
                <div className="mb-4">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">ID Front</p>
                  <div className="w-full h-40 bg-gray-100 rounded-2xl overflow-hidden relative border border-gray-200">
                    <img 
                      src={submittedData.idDocumentUrl} 
                      alt="Submitted ID Front" 
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                      <span className="bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-green-500" /> Secure
                      </span>
                    </div>
                  </div>
                </div>
              )}
              
              {submittedData?.idDocumentBackUrl && (
                <div className="mb-4">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">ID Back</p>
                  <div className="w-full h-40 bg-gray-100 rounded-2xl overflow-hidden relative border border-gray-200">
                    <img 
                      src={submittedData.idDocumentBackUrl} 
                      alt="Submitted ID Back" 
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                      <span className="bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-green-500" /> Secure
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {submittedData?.idDocumentBackUrl && (
                <div className="mb-4">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">ID Back</p>
                  <div className="w-full h-40 bg-gray-100 rounded-2xl overflow-hidden relative border border-gray-200">
                    <img 
                      src={submittedData.idDocumentBackUrl} 
                      alt="Submitted ID Back" 
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                      <span className="bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-green-500" /> Secure
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {submittedData?.selfieUrl && (
                <div className="mb-4">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Selfie</p>
                  <div className="w-full h-40 bg-gray-100 rounded-2xl overflow-hidden relative border border-gray-200">
                    <img 
                      src={submittedData.selfieUrl} 
                      alt="Submitted Selfie" 
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                      <span className="bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-green-500" /> Secure
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {submittedData?.vehicleType && (
                <div className="mb-4">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Vehicle Type</p>
                  <p className="text-gray-900 font-medium">{submittedData.vehicleType}</p>
                </div>
              )}

              {submittedData?.operatingZone && (
                <div className="mb-4">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Operating Zone</p>
                  <p className="text-gray-900 font-medium">{submittedData.operatingZone}</p>
                </div>
              )}
            </div>

            <button 
              onClick={() => router.push("/agent/home_dashboard")}
              className="w-full bg-[#111] hover:bg-black active:scale-95 transition-all text-white font-bold text-lg py-5 rounded-2xl shadow-lg mt-auto mb-8"
            >
              Back to Dashboard
            </button>
          </div>
        ) : (
          <>
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 h-1.5 rounded-full mb-8 mt-2 overflow-hidden">
              <div 
                className="h-full bg-[#FFCC00] transition-all duration-300 rounded-full"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>

            {step === 1 && (
              <div className="animate-in slide-in-from-right duration-300 flex-1 flex flex-col">
                <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mb-6">
                  <FileText size={32} className="text-yellow-600" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-2">Select ID Type</h2>
                <p className="text-gray-500 mb-8">Please select the type of official document you wish to upload.</p>
                
                <div className="space-y-4">
                  {['National ID Card', 'Driver\'s License', 'International Passport'].map((type) => (
                    <button 
                      key={type}
                      onClick={() => setDocType(type)}
                      className={`w-full p-5 rounded-2xl border-2 text-left transition-all font-bold ${
                        docType === type 
                          ? 'border-[#FFCC00] bg-yellow-50 text-gray-900' 
                          : 'border-gray-100 bg-white text-gray-700 hover:border-gray-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                
                <div className="mt-auto pb-8 pt-8">
                  <button 
                    onClick={() => setStep(2)}
                    disabled={!docType}
                    className="w-full bg-[#111] hover:bg-black disabled:bg-gray-300 active:scale-95 transition-all text-white font-bold text-lg py-5 rounded-2xl shadow-lg"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="animate-in slide-in-from-right duration-300 flex-1 flex flex-col">
                <h2 className="text-2xl font-black text-gray-900 mb-2">Upload Document</h2>
                <p className="text-gray-500 mb-8">Take a clear picture of the front and back of your {docType}.</p>
                
                <div className="space-y-4">
                  <label className="border-2 border-dashed border-gray-300 bg-white rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors">
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, setFrontImage)} />
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <UploadCloud size={24} className="text-gray-500" />
                    </div>
                    <p className="font-bold text-gray-900">{frontImage ? frontImage.name : "Upload Front Side"}</p>
                    <p className="text-xs text-gray-500 mt-1">{frontImage ? "Tap to change" : "Tap to open camera/gallery"}</p>
                  </label>

                  <label className="border-2 border-dashed border-gray-300 bg-white rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors">
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, setBackImage)} />
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <UploadCloud size={24} className="text-gray-500" />
                    </div>
                    <p className="font-bold text-gray-900">{backImage ? backImage.name : "Upload Back Side"}</p>
                    <p className="text-xs text-gray-500 mt-1">{backImage ? "Tap to change" : "Tap to open camera/gallery"}</p>
                  </label>
                </div>
                
                <div className="mt-auto pb-8 pt-8">
                  <button 
                    onClick={() => setStep(3)}
                    disabled={!frontImage || !backImage}
                    className="w-full bg-[#111] hover:bg-black disabled:bg-gray-300 active:scale-95 transition-all text-white font-bold text-lg py-5 rounded-2xl shadow-lg"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="animate-in slide-in-from-right duration-300 flex-1 flex flex-col">
                <h2 className="text-2xl font-black text-gray-900 mb-2">Take a Selfie</h2>
                <p className="text-gray-500 mb-8">We need to match your face with your uploaded ID.</p>
                
                <label className="border-2 border-dashed border-gray-300 bg-white rounded-[32px] p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors">
                  <input type="file" accept="image/*" capture="user" className="hidden" onChange={(e) => handleFileChange(e, setSelfieImage)} />
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 relative">
                    {selfieImage ? (
                      <CheckCircle2 size={40} className="text-green-500" />
                    ) : (
                      <>
                        <Camera size={40} className="text-gray-500" />
                        <div className="absolute top-0 right-0 w-6 h-6 bg-[#FFCC00] border-2 border-white rounded-full"></div>
                      </>
                    )}
                  </div>
                  <p className="font-bold text-gray-900 text-lg">{selfieImage ? "Selfie captured" : "Tap to take selfie"}</p>
                  <p className="text-sm text-gray-500 mt-2">Ensure you are in a well-lit area and your face is fully visible.</p>
                </label>
                
                <div className="mt-auto pb-8 pt-8">
                  <button 
                    onClick={() => setStep(4)}
                    disabled={!selfieImage}
                    className="w-full bg-[#111] hover:bg-black disabled:bg-gray-300 active:scale-95 transition-all text-white font-bold text-lg py-5 rounded-2xl shadow-lg"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="animate-in slide-in-from-right duration-300 flex-1 flex flex-col">
                <h2 className="text-2xl font-black text-gray-900 mb-2">Vehicle & Zone</h2>
                <p className="text-gray-500 mb-8">Provide your vehicle information and primary operating zone.</p>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-bold text-gray-900 mb-1 block">Vehicle Type</label>
                    <div className="grid grid-cols-3 gap-3">
                      {['Bike', 'Car', 'Bicycle'].map((type) => (
                        <button 
                          key={type}
                          onClick={() => setVehicleType(type)}
                          className={`p-3 rounded-2xl border-2 transition-all font-bold text-center ${
                            vehicleType === type 
                              ? 'border-[#FFCC00] bg-yellow-50 text-gray-900' 
                              : 'border-gray-100 bg-white text-gray-700 hover:border-gray-200'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-bold text-gray-900 mb-1 block mt-2">License Plate</label>
                    <input 
                      type="text" 
                      value={licensePlate}
                      onChange={(e) => setLicensePlate(e.target.value)}
                      placeholder="e.g. TN-38 BR 1234" 
                      className="w-full p-4 rounded-2xl border border-gray-200 focus:outline-none focus:border-[#FFCC00] font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-bold text-gray-900 mb-1 block mt-2">Operating Zone</label>
                    <input 
                      type="text" 
                      value={operatingZone}
                      onChange={(e) => setOperatingZone(e.target.value)}
                      placeholder="e.g. Akure, Ondo State" 
                      className="w-full p-4 rounded-2xl border border-gray-200 focus:outline-none focus:border-[#FFCC00] font-bold"
                    />
                    <p className="text-xs text-orange-500 mt-1">* Zone must be within Akure, Ondo State</p>
                  </div>
                </div>
                
                <div className="mt-auto pb-8 pt-8">
                  <button 
                    onClick={handleSubmit}
                    disabled={!vehicleType || !licensePlate || !operatingZone || isUploading}
                    className="w-full bg-[#111] hover:bg-black disabled:bg-gray-300 active:scale-95 transition-all text-white font-bold text-lg py-5 rounded-2xl shadow-lg"
                  >
                    {isUploading ? "Uploading..." : "Submit for Verification"}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default KycPage;
