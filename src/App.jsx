// Komponen utama App - sekarang lebih ringkas sebagai container
import React from "react";
import { Camera } from "lucide-react";
import { useImageUpload } from "./hooks/useImageUpload";
import UploadArea from "./components/uploadArea";
import PredictionResults from "./components/predictionResults";
import InfoCard from "./components/infoCard";

function App() {
  const {
    selectedImage,
    previewUrl,
    prediction,
    loading,
    error,
    dragActive,
    cameraActive,
    videoRef,
    canvasRef,
    handleDrag,
    handleDrop,
    handleFileInput,
    handleReset,
    handlePredict,
    getConfidenceColor,
    startCamera,
    stopCamera,
    capturePhoto,
  } = useImageUpload();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <Camera className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Klasifikasi Jenis Udang</h1>
              <p className="text-sm text-gray-600 mt-1">Sistem klasifikasi menggunakan Convolutional Neural Network (CNN)</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <UploadArea
              previewUrl={previewUrl}
              dragActive={dragActive}
              handleDrag={handleDrag}
              handleDrop={handleDrop}
              handleFileInput={handleFileInput}
              handleReset={handleReset}
              error={error}
              loading={loading}
              handlePredict={handlePredict}
              selectedImage={selectedImage}
              prediction={prediction}
              cameraActive={cameraActive}
              videoRef={videoRef}
              canvasRef={canvasRef}
              startCamera={startCamera}
              stopCamera={stopCamera}
              capturePhoto={capturePhoto}
            />
            <InfoCard />
          </div>

          {/* Results Section */}
          <div>
            <PredictionResults prediction={prediction} getConfidenceColor={getConfidenceColor} handleReset={handleReset} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-600">Sistem Klasifikasi Udang menggunakan CNN | Skripsi 2026</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
