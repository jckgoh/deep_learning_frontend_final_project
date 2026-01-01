import React, { useState } from 'react';
import { Heart, Activity, Shield, ArrowRight, Upload, AlertCircle, X, ImageIcon, ServerCrash, CheckCircle } from 'lucide-react';

const Navbar = ({ changeView }) => (
  <nav className="bg-white shadow-sm sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16 items-center">
        <div className="flex items-center cursor-pointer" onClick={() => changeView('home')}>
          <Heart className="h-8 w-8 text-pink-600 fill-current" />
          <span className="ml-2 text-xl font-bold text-gray-800">BreastCancer<span className="text-pink-600">Classification</span></span>
        </div>
        <div className="hidden md:flex space-x-8">
          <button onClick={() => changeView('home')} className="text-gray-600 hover:text-pink-600 transition">Beranda</button>
          <button onClick={() => changeView('detect')} className="text-gray-600 hover:text-pink-600 transition">Scan Histology</button>
        </div>
      </div>
    </div>
  </nav>
);

const HeroSection = ({ changeView }) => (
  <div className="bg-gradient-to-br from-pink-50 to-white min-h-[90vh] flex items-center relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center relative z-10">
      <div className="md:w-1/2 mb-10 md:mb-0">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-pink-100 text-pink-600 text-sm font-semibold mb-6">
          <Shield className="w-4 h-4 mr-2" /> AI Image Classification
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
          Upload Histology,<br />
          <span className="text-pink-600">Dapatkan Hasilnya.</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-lg">
          Hubungkan hasil pencitraan medis Anda langsung dengan model Deep Learning kami untuk deteksi dini.
        </p>
        <button 
          onClick={() => changeView('detect')}
          className="flex items-center bg-pink-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-pink-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          Mulai Upload <ArrowRight className="ml-2 w-5 h-5" />
        </button>
      </div>
      <div className="md:w-1/2 flex justify-center relative">
        <div className="relative bg-white p-6 rounded-2xl shadow-2xl border border-pink-100 max-w-sm">
           <div className="bg-gray-100 rounded-lg h-48 w-full flex items-center justify-center mb-4 overflow-hidden relative">
              <ImageIcon className="text-gray-300 w-16 h-16" />
           </div>
           <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-xs">Upload Histology!</p>
                <p className="text-lg font-bold text-gray-800 flex items-center gap-2">Dan Dapatkan Hasilnya!</p>
              </div>
              <div className="bg-green-100 text-green-700 p-2 rounded-full">
                <Activity className="w-6 h-6" />
              </div>
           </div>
        </div>
      </div>
    </div>
  </div>
);

const ImageUploadForm = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  console.log('API URL:', API_URL)
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null); 
      setErrorMsg(null);
    }
  };

 

  const removeImage = () => {
    setImage(null);
    setPreview(null);
    setResult(null);
    setErrorMsg(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return;

    setLoading(true);
    setErrorMsg(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', image); 

    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setResult(data);

    } catch (err) {
      console.error("Gagal connect ke backend:", err);
      setErrorMsg("Gagal terhubung ke Server Backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="bg-pink-600 px-8 py-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <ImageIcon className="mr-3" /> Analisis Citra Medis
            </h2>
            <p className="text-pink-100 mt-2">Upload gambar untuk dikirim ke Backend.</p>
          </div>
          <div className="p-8">
            {errorMsg && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
                <ServerCrash className="w-5 h-5 mr-2" />
                {errorMsg}
              </div>
            )}
            {!result ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {!preview ? (
                  <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:bg-gray-50 transition cursor-pointer relative">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600 justify-center">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-pink-600 hover:text-pink-500">
                          <span>Upload gambar</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">Format: JPG, PNG, JPEG</p>
                    </div>
                  </div>
                ) : (
                  <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-md">
                     <img src={preview} alt="Preview" className="w-full h-64 object-cover object-center" />
                     <button type="button" onClick={removeImage} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition">
                       <X className="w-5 h-5" />
                     </button>
                  </div>
                )}
                <button 
                  type="submit" 
                  disabled={!image || loading}
                  className={`w-full py-4 rounded-xl font-bold text-white shadow-md transition flex justify-center items-center
                    ${!image || loading ? 'bg-gray-300 cursor-not-allowed text-gray-500' : 'bg-pink-600 hover:bg-pink-700'}`}
                >
                  {loading ? 'Sedang Mengirim ke API...' : 'Analisis Gambar'}
                </button>
              </form>
            ) : (
              <div className="animate-fade-in">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="md:w-1/3">
                    <p className="text-sm font-semibold text-gray-500 mb-2">Input:</p>
                    <img src={preview} alt="Analyzed" className="rounded-lg shadow-sm border border-gray-200 w-full" />
                  </div>
                  <div className="md:w-2/3">
                     <h3 className="text-2xl font-bold text-gray-900 mb-4">Hasil Prediksi Model</h3>
                     <div className={`p-6 rounded-xl border-l-8 ${['malignant', 'ganas'].some(k => result.prediction?.toLowerCase().includes(k)) ? 'bg-red-50 border-red-500' : 'bg-green-50 border-green-500'} mb-6`}>
                        <p className="text-sm uppercase tracking-wider font-bold text-gray-500">Diagnosis</p>
                        <p className="text-4xl font-extrabold text-gray-800 mt-1">
                          {result.prediction || "Unknown"}
                        </p>
                        <div className="mt-4">
                          <p className="text-sm text-gray-500">Confidence Score</p>
                          <p className="text-xl font-bold text-gray-800">
                             {typeof result.confidence === 'number' 
                               ? (result.confidence * 100).toFixed(2) + '%' 
                               : result.confidence}
                          </p>
                        </div>
                     </div>
                     <button onClick={() => { setResult(null); setErrorMsg(null); }} className="mt-6 w-full py-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-semibold transition">Scan Ulang</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [currentView, setCurrentView] = useState('home');
  return (
    <div className="font-sans text-gray-900 bg-gray-50 min-h-screen flex flex-col">
      <Navbar changeView={setCurrentView} />
      <main className="flex-grow">
        {currentView === 'home' ? <HeroSection changeView={setCurrentView} /> : <ImageUploadForm />}
      </main>
    </div>
  );
}

export default App;