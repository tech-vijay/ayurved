import React, { useState, useRef } from 'react';
import { Upload, X, CheckCircle, Image as ImageIcon, Loader2, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { uploadToImageKit, getImageKitConfig } from '@/lib/imagekit';
import { showToast } from '@/components/Toast';

interface ImageKitUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
}

export default function ImageKitUpload({
  value,
  onChange,
  folder = '/ayurved/medicines',
  label = 'छवि (ImageKit CDN)'
}: ImageKitUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('कृपया केवल छवि (Image) फ़ाइल चुनें', 'error');
      return;
    }

    // Limit file size to 10MB
    if (file.size > 10 * 1024 * 1024) {
      showToast('फ़ाइल का आकार 10MB से कम होना चाहिए', 'error');
      return;
    }

    const config = getImageKitConfig();
    if (!config.publicKey || config.publicKey.includes('your_imagekit_public_key')) {
      showToast('कृपया .env फ़ाइल में अपने असली ImageKit Keys दर्ज करें', 'error');
      return;
    }

    setUploading(true);
    try {
      const res = await uploadToImageKit(file, file.name, folder);
      onChange(res.url);
      showToast('ImageKit पर छवि सफलता से अपलोड हुई!', 'success');
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'अपलोड विफल रहा';
      showToast(errorMsg, 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const config = getImageKitConfig();
  const isMissingKeys = !config.publicKey || config.publicKey.includes('your_imagekit_public_key');

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-xs text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
        >
          <LinkIcon className="w-3 h-3" />
          {showUrlInput ? 'फाइल अपलोडर' : 'URL दर्ज करें'}
        </button>
      </div>

      {isMissingKeys && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 flex items-start gap-2">
          <span className="font-bold text-amber-600 text-sm">⚠️</span>
          <div>
            <p className="font-semibold text-amber-900 mb-0.5">ImageKit Setup आवश्यक है!</p>
            <p>
              अपलोड के लिए अपनी <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-900 font-mono text-[11px]">.env</code> फ़ाइल में असली ImageKit Keys डालें।
              (ImageKit Dashboard ➔ Developer options ➔ API keys)
            </p>
          </div>
        </div>
      )}

      {showUrlInput ? (
        <div className="flex gap-2">
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://ik.imagekit.io/..."
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
          />
          {value && (
            <button
              type="button"
              onClick={handleRemove}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      ) : (
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
            accept="image/*"
            className="hidden"
          />

          {value ? (
            <div className="relative group border border-emerald-200 bg-emerald-50/50 rounded-xl p-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-white border border-gray-200 flex-shrink-0 relative">
                  <img src={value} alt="Preview" className="w-full h-full object-cover" />
                </div>
                <div className="overflow-hidden text-ellipsis">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                    <CheckCircle className="w-3.5 h-3.5" /> ImageKit CDN पर उपलब्ध
                  </div>
                  <a
                    href={value}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-gray-500 hover:text-emerald-600 truncate block flex items-center gap-1 mt-0.5"
                  >
                    {value.substring(0, 35)}... <ExternalLink className="w-3 h-3 inline" />
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1.5 bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 text-xs font-medium rounded-lg transition-colors"
                >
                  बदलें
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="p-1.5 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                  title="हटाएं"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => !uploading && fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-emerald-500 bg-emerald-50/80 scale-[1.01]'
                  : 'border-gray-200 hover:border-emerald-400 bg-gray-50/50 hover:bg-emerald-50/30'
              }`}
            >
              {uploading ? (
                <div className="flex flex-col items-center justify-center py-2">
                  <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-2" />
                  <p className="text-sm font-medium text-gray-700">ImageKit CDN पर अपलोड हो रहा है...</p>
                  <p className="text-xs text-gray-400 mt-1">MongoDB डेटाबेस का स्टोरेज सुरक्षित रखा जा रहा है</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2">
                    <Upload className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-medium text-gray-800 mb-0.5">
                    छवि अपलोड करें या खींचकर लाएं (Drag & Drop)
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, WEBP (अधिकतम 10MB)</p>
                  <div className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium bg-emerald-100/60 px-2 py-0.5 rounded-full mt-2">
                    <ImageIcon className="w-3 h-3" /> Managed by ImageKit CDN
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
