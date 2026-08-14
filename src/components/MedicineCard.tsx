import { ShoppingCart, Eye } from 'lucide-react';
import type { Medicine } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/format';
import { navigate } from '@/lib/router';
import { showToast } from '@/components/Toast';

export default function MedicineCard({ medicine }: { medicine: Medicine }) {
  const { addItem } = useCart();

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (medicine.stock <= 0) {
      showToast('यह औषधि अभी स्टॉक में नहीं है', 'error');
      return;
    }
    addItem(medicine);
    showToast(`${medicine.name_hi} कार्ट में जोड़ी गई`, 'success');
  };

  const discount = medicine.compare_at_price && medicine.compare_at_price > medicine.price
    ? Math.round(((medicine.compare_at_price - medicine.price) / medicine.compare_at_price) * 100)
    : 0;

  return (
    <div
      onClick={() => navigate(`/medicine/${medicine.id}`)}
      className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        {medicine.image_url ? (
          <img
            src={medicine.image_url}
            alt={medicine.name_hi}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <ShoppingCart className="w-12 h-12" />
          </div>
        )}
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-md">
            {discount}% छूट
          </span>
        )}
        {medicine.stock <= 0 && (
          <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
            स्टॉक खत्म
          </span>
        )}
        {medicine.is_featured && medicine.stock > 0 && (
          <span className="absolute top-3 right-3 bg-emerald-600 text-white text-xs font-bold px-2 py-1 rounded-md">
            विशेष
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1">{medicine.name_hi}</h3>
        <p className="text-xs text-gray-500 mb-2 line-clamp-2 h-8">{medicine.description}</p>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-emerald-700">{formatPrice(medicine.price)}</span>
          {medicine.compare_at_price && discount > 0 && (
            <span className="text-sm text-gray-400 line-through">{formatPrice(medicine.compare_at_price)}</span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleAdd}
            disabled={medicine.stock <= 0}
            className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            कार्ट में जोड़ें
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/medicine/${medicine.id}`); }}
            className="p-2.5 border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 rounded-lg transition-colors"
            aria-label="विवरण देखें"
          >
            <Eye className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  );
}
