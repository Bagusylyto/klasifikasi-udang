import React from "react";
import { Upload, X, AlertCircle, BarChart3, Video, Camera, XCircle } from "lucide-react";

const UploadArea = ({ previewUrl, dragActive, handleDrag, handleDrop, handleFileInput, handleReset, error, loading, handlePredict, selectedImage, prediction, cameraActive, videoRef, canvasRef, startCamera, stopCamera, capturePhoto }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
        <Upload className="w-5 h-5 mr-2 text-blue-600" />
        Upload atau Ambil Gambar Udang
      </h2>

      {/* Camera View */}
      {cameraActive && (
        <div className="space-y-4">
          <div className="relative bg-black rounded-lg overflow-hidden" style={{ minHeight: "300px" }}>
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-auto max-h-96 object-cover" style={{ transform: "scaleX(1)" }} />
            <canvas ref={canvasRef} className="hidden" />
          </div>
          <div className="flex space-x-3">
            <button onClick={capturePhoto} className="flex-1 py-3 px-6 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-md flex items-center justify-center">
              <Camera className="w-5 h-5 mr-2" />
              Ambil Foto
            </button>
            <button onClick={stopCamera} className="py-3 px-6 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-md flex items-center justify-center">
              <XCircle className="w-5 h-5 mr-2" />
              Batal
            </button>
          </div>
          <p className="text-xs text-center text-gray-500">Arahkan kamera ke udang dan klik "Ambil Foto"</p>
        </div>
      )}

      {/* Upload Area - Only show when camera is not active */}
      {!cameraActive && (
        <>
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400 bg-gray-50"}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input type="file" id="file-upload" className="hidden" accept="image/jpeg,image/jpg,image/png" onChange={handleFileInput} />

            {!previewUrl ? (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <Upload className="w-16 h-16 text-gray-400" />
                </div>
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <label htmlFor="file-upload" className="cursor-pointer inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md">
                      <Upload className="w-5 h-5 mr-2" />
                      Pilih Gambar
                    </label>
                    <button onClick={startCamera} type="button" className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md">
                      <Video className="w-5 h-5 mr-2" />
                      Buka Kamera
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">atau drag & drop gambar di sini</p>
                </div>
                <p className="text-xs text-gray-500">Format: JPG, JPEG, PNG (Maks. 5MB)</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative inline-block">
                  <img src={previewUrl} alt="Preview" className="max-h-64 rounded-lg shadow-md" />
                  <button onClick={handleReset} className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-600 font-medium">{selectedImage?.name}</p>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="flex space-x-3">
            <button
              onClick={handlePredict}
              disabled={!selectedImage || loading}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all shadow-md ${!selectedImage || loading ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg"}`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Memproses...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Klasifikasi Sekarang
                </span>
              )}
            </button>

            {(prediction || previewUrl) && (
              <button onClick={handleReset} className="py-3 px-6 rounded-lg font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors">
                Reset
              </button>
            )}
          </div>
        </>
      )}

      {/* Error display when camera is active */}
      {cameraActive && error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
};

export default UploadArea;
