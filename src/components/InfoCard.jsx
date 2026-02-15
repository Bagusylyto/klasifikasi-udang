import React from "react";
import { Info } from "lucide-react";
import { CLASS_COLORS } from "../utils/constants";

const shrimpTypes = [
  { key: "udang_windu", name: "Udang Windu" },
  { key: "udang_putih", name: "Udang Putih" },
  { key: "udang_keto", name: "Udang Keto" },
  { key: "udang_ronggeng", name: "Udang Ronggeng" },
];

const InfoCard = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl shadow-md p-6 border border-blue-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
        <Info className="w-5 h-5 mr-2 text-blue-600" />
        Jenis Udang yang Dapat Dikenali
      </h3>
      <div className="space-y-2">
        {shrimpTypes.map(({ key, name }) => (
          <div key={key} className="flex items-center space-x-3 bg-white rounded-lg p-3 shadow-sm">
            <div className={`w-3 h-3 ${CLASS_COLORS[key]} rounded-full`}></div>
            <span className="text-sm font-medium text-gray-700">{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfoCard;
