import { useState, useEffect } from 'react';
import { ShoppingCart, ArrowLeft, Check, Leaf, Package, Heart } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Medicine } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/format';
import { navigate } from '@/lib/router';
import { showToast } from '@/components/Toast';

export default function MedicineDetailPage({ id }: { id: string }) {
  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [related, setRelated] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await supabase.from('medicines').select('*').eq('id', id).maybeSingle();
      setMedicine(data);
      if (data?.category_id) {
        const { data: rel } = await supabase
          .from('medicines')
          .select('*')
          .eq('is_active', true)
          .eq('category_id', data.category_id)
          .neq('id', id)
          .limit(4);
        setRelated(rel ?? []);
      }
      setLoading(false);
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 animate-pulse">
          <div className="aspect-square bg-gray-200 rounded-xl" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-12 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!medicine) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-400 text-lg">औषधि नहीं मिली</p>
        <button onClick={() => navigate('/medicines')} className="mt-4 text-emerald-700 font-medium">औषधियां देखें</button>
      </div>
    );
  }

  const discount = medicine.compare_at_price && medicine.compare_at_price > medicine.price
    ? Math.round(((medicine.compare_at_price - medicine.price) / medicine.compare_at_price) * 100)
    : 0;

  const handleAdd = () => {
    if (medicine.stock <= 0) {
      showToast('यह औषधि अभी स्टॉक में नहीं है', 'error');
      return;
    }
    addItem(medicine, qty);
    showToast(`${medicine.name_hi} कार्ट में जोड़ी गई`, 'success');
  };

  const handleBuyNow = () => {
    if (medicine.stock <= 0) {
      showToast('यह औषधि अभी स्टॉक में नहीं है', 'error');
      return;
    }
    addItem(medicine, qty);
    navigate('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button onClick={() => navigate('/medicines')} className="flex items-center gap-1 text-gray-500 hover:text-emerald-700 mb-6 text-sm">
        <ArrowLeft className="w-4 h-4" /> औषधियां पर वापस
      </button>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative rounded-xl overflow-hidden bg-gray-50 shadow-md">
          {medicine.image_url ? (
            <img src={medicine.image_url} alt={medicine.name_hi} className="w-full h-full object-cover aspect-square" />
          ) : (
            <div className="w-full aspect-square flex items-center justify-center text-gray-300">
              <Package className="w-24 h-24" />
            </div>
          )}
          {discount > 0 && (
            <span className="absolute top-4 left-4 bg-amber-500 text-white text-sm font-bold px-3 py-1.5 rounded-md">
              {discount}% छूट
            </span>
          )}
        </div>

        <div>
          {medicine.is_featured && (
            <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-medium mb-3">
              <Heart className="w-3.5 h-3.5" /> विशेष औषधि
            </span>
          )}
          <h1 className="text-2xl md:text-3xl font-bold text-emerald-900 mb-3">{medicine.name_hi}</h1>
          <p className="text-gray-600 leading-relaxed mb-4">{medicine.description}</p>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl font-bold text-emerald-700">{formatPrice(medicine.price)}</span>
            {medicine.compare_at_price && discount > 0 && (
              <span className="text-lg text-gray-400 line-through">{formatPrice(medicine.compare_at_price)}</span>
            )}
          </div>

          <div className="flex items-center gap-2 mb-6">
            {medicine.stock > 0 ? (
              <span className="inline-flex items-center gap-1 text-emerald-600 text-sm font-medium">
                <Check className="w-4 h-4" /> स्टॉक में उपलब्ध ({medicine.stock} शेष)
              </span>
            ) : (
              <span className="text-red-500 text-sm font-medium">स्टॉक खत्म</span>
            )}
          </div>

          {medicine.stock > 0 && (
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-3 hover:bg-gray-50 text-lg">−</button>
                <span className="px-6 py-3 font-medium">{qty}</span>
                <button onClick={() => setQty(Math.min(medicine.stock, qty + 1))} className="px-4 py-3 hover:bg-gray-50 text-lg">+</button>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <button
              onClick={handleAdd}
              disabled={medicine.stock <= 0}
              className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white py-3.5 rounded-xl font-medium transition-colors"
            >
              <ShoppingCart className="w-5 h-5" /> कार्ट में जोड़ें
            </button>
            <button
              onClick={handleBuyNow}
              disabled={medicine.stock <= 0}
              className="flex-1 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 text-white py-3.5 rounded-xl font-medium transition-colors"
            >
              अभी खरीदें
            </button>
          </div>

          {/* Details */}
          <div className="space-y-4 border-t border-gray-100 pt-6">
            {medicine.benefits && (
              <div className="bg-emerald-50 rounded-xl p-4">
                <h3 className="font-semibold text-emerald-800 mb-2 flex items-center gap-2">
                  <Leaf className="w-4 h-4" /> लाभ
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">{medicine.benefits}</p>
              </div>
            )}
            {medicine.ingredients && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">सामग्री</h3>
                <p className="text-sm text-gray-600">{medicine.ingredients}</p>
              </div>
            )}
            {medicine.dosage && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">सेवन विधि</h3>
                <p className="text-sm text-gray-600">{medicine.dosage}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl font-bold text-emerald-900 mb-4">संबंधित औषधियां</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map(m => (
              <div key={m.id} onClick={() => navigate(`/medicine/${m.id}`)} className="cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden">
                <div className="aspect-square overflow-hidden bg-gray-50">
                  {m.image_url && <img src={m.image_url} alt={m.name_hi} className="w-full h-full object-cover hover:scale-105 transition-transform" />}
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-sm text-gray-800 line-clamp-1">{m.name_hi}</h3>
                  <p className="text-emerald-700 font-bold text-sm mt-1">{formatPrice(m.price)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
