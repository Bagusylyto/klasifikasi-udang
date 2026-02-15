import React from "react";
import { CheckCircle, BarChart3, Camera } from "lucide-react";
import { CLASS_COLORS } from "../utils/constants";

const PredictionResults = ({ prediction, getConfidenceColor, handleReset }) => {
  const formatClassName = (className) => {
    return className
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (!prediction) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-12 border border-gray-200 text-center">
        <div className="flex justify-center mb-4">
          <Camera className="w-16 h-16 text-gray-300" />
        </div>
        <h3 className="text-lg font-semibold text-gray-400 mb-2">Belum Ada Hasil</h3>
        <p className="text-sm text-gray-500">Upload, ambil foto, atau klasifikasi gambar udang untuk melihat hasilnya</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 space-y-6">
      <div className="flex items-center space-x-3">
        <CheckCircle className="w-6 h-6 text-green-500" />
        <h2 className="text-xl font-semibold text-gray-900">Hasil Klasifikasi</h2>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-6 border-2 border-blue-200">
        <p className="text-sm text-gray-600 mb-2">Jenis Udang Terdeteksi:</p>
        <h3 className="text-3xl font-bold text-gray-900 mb-3">{formatClassName(prediction.class_name)}</h3>

        <div className="flex items-center space-x-2 mb-3">
          <span className="text-sm text-gray-600">Tingkat Kepercayaan:</span>
          <span className={`text-2xl font-bold ${getConfidenceColor(prediction.confidence)}`}>{prediction.confidence}%</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-500 ${prediction.confidence >= 80 ? "bg-green-500" : prediction.confidence >= 60 ? "bg-yellow-500" : "bg-red-500"}`} style={{ width: `${prediction.confidence}%` }} />
        </div>

        {prediction.description && <p className="mt-4 text-sm text-gray-600 bg-white rounded-lg p-3 border border-gray-200">{prediction.description}</p>}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
          Detail Probabilitas
        </h3>
        <div className="space-y-3">
          {Object.entries(prediction.all_predictions).map(([className, confidence]) => {
            const displayName = formatClassName(className);

            return (
              <div key={className} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">{displayName}</span>
                  <span className="text-sm font-bold text-gray-900">{confidence}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ${CLASS_COLORS[className] || "bg-gray-400"}`} style={{ width: `${confidence}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button onClick={handleReset} className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all shadow-md hover:shadow-lg">
        Klasifikasi Gambar Lain
      </button>
    </div>
  );
};

export default PredictionResults;
