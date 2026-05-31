import { useRef, useState } from 'react';
import { uploadImage } from '../api';

export default function ProductImagesField({ images, onChange, password }) {
  const [linkInput, setLinkInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileRef = useRef(null);

  const addLink = () => {
    const url = linkInput.trim();
    if (!url) return;
    onChange([...images, url]);
    setLinkInput('');
  };

  const removeImage = (index) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Choisissez une image (JPG, PNG, WEBP, GIF)');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setUploadError('Image trop grande (max 8 Mo)');
      return;
    }

    setUploading(true);
    setUploadError('');

    try {
      const url = await uploadImage(file, password);
      onChange([...images, url]);
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">Photos du produit</label>

      <div className="flex gap-2">
        <input
          type="url"
          className="input-field"
          placeholder="Coller un lien photo (https://...)"
          value={linkInput}
          onChange={(e) => setLinkInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addLink())}
        />
        <button
          type="button"
          onClick={addLink}
          className="shrink-0 rounded-2xl border border-brand-200 bg-brand-50 px-4 text-sm font-semibold text-brand-700 hover:bg-brand-100"
        >
          Ajouter
        </button>
      </div>

      <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white px-4 py-6 transition-colors hover:border-brand-300 hover:bg-brand-50/50">
        <span className="text-2xl">📷</span>
        <span className="mt-2 text-sm font-medium text-gray-700">
          {uploading ? 'Téléversement en cours...' : 'Téléverser une photo depuis votre appareil'}
        </span>
        <span className="mt-1 text-xs text-gray-500">JPG, PNG, WEBP, GIF — max 8 Mo</span>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          disabled={uploading}
          onChange={handleFileChange}
        />
      </label>

      {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {images.map((url, index) => (
            <div key={`${url}-${index}`} className="group relative aspect-square overflow-hidden rounded-xl bg-gray-100">
              <img src={url} alt="" className="h-full w-full object-cover" />
              {index === 0 && (
                <span className="absolute left-1 top-1 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  Principale
                </span>
              )}
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Supprimer la photo"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-500">
        La première photo sera l'image principale sur la boutique.
      </p>
    </div>
  );
}
