import { useState, useCallback, useRef, useEffect } from "react";
import { API_URL, VALID_IMAGE_TYPES, MAX_FILE_SIZE } from "../utils/constants";

export const useImageUpload = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [stream, setStream] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Cleanup camera stream saat component unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  // Effect untuk set video stream ke video element
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileInput = useCallback((e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, []);

  const handleFile = useCallback((file) => {
    if (!VALID_IMAGE_TYPES.includes(file.type)) {
      setError("Format file tidak valid. Gunakan JPG, JPEG, atau PNG.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("Ukuran file terlalu besar. Maksimal 5MB.");
      return;
    }
    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setPrediction(null);
    setError(null);
  }, []);

  // Fungsi untuk mendeteksi apakah perangkat mobile
  const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  // Fungsi untuk membuka kamera
  const startCamera = useCallback(async () => {
    try {
      // Tentukan facingMode berdasarkan perangkat
      const facingMode = isMobileDevice() ? "environment" : "user";

      const constraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);

      setStream(mediaStream);
      setCameraActive(true);
      setError(null);

      // Set stream ke video element akan di-handle oleh useEffect
    } catch (err) {
      console.error("Error accessing camera:", err);

      // Coba lagi dengan constraints yang lebih sederhana jika gagal
      try {
        const simpleStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(simpleStream);
        setCameraActive(true);
        setError(null);
      } catch (retryErr) {
        console.error("Retry error:", retryErr);
        setError("Tidak dapat mengakses kamera. Pastikan Anda memberikan izin kamera dan tidak ada aplikasi lain yang menggunakan kamera.");
      }
    }
  }, []);

  // Fungsi untuk menutup kamera
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setCameraActive(false);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, [stream]);

  // Fungsi untuk mengambil foto dari kamera
  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) {
      setError("Video atau canvas tidak tersedia");
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;

    // Pastikan video sudah ready
    if (video.readyState !== video.HAVE_ENOUGH_DATA) {
      setError("Video belum siap. Tunggu sebentar dan coba lagi.");
      return;
    }

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to blob
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], `camera-capture-${Date.now()}.jpg`, { type: "image/jpeg" });
          setSelectedImage(file);
          setPreviewUrl(URL.createObjectURL(blob));
          setPrediction(null);
          setError(null);
          stopCamera();
        } else {
          setError("Gagal mengambil foto. Coba lagi.");
        }
      },
      "image/jpeg",
      0.95
    );
  }, [stopCamera]);

  const handlePredict = useCallback(async () => {
    if (!selectedImage) {
      setError("Pilih gambar terlebih dahulu");
      return;
    }
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", selectedImage);
    try {
      const response = await fetch(`${API_URL}/api/predict`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        setPrediction(data.prediction);
      } else {
        setError(data.error || "Prediksi gagal");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Tidak dapat terhubung ke server. Pastikan Flask backend berjalan di http://localhost:5000");
    } finally {
      setLoading(false);
    }
  }, [selectedImage]);

  const handleReset = useCallback(() => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setPrediction(null);
    setError(null);
    if (cameraActive) {
      stopCamera();
    }
  }, [cameraActive, stopCamera]);

  const getConfidenceColor = useCallback((confidence) => {
    if (confidence >= 80) return "text-green-600";
    if (confidence >= 60) return "text-yellow-600";
    return "text-red-600";
  }, []);

  return {
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
    handlePredict,
    handleReset,
    getConfidenceColor,
    startCamera,
    stopCamera,
    capturePhoto,
  };
};
