import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/format';
import { navigate } from '@/lib/router';

export default function CartPage() {
  const { items, updateQty, removeItem, subtotal, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-10 h-10 text-gray-300" />
        </div>
        <h1 className="text-2xl font-bold text-gray-700 mb-2">आपका कार्ट खाली है</h1>
        <p className="text-gray-500 mb-6">अभी तक कोई औषधि कार्ट में नहीं है</p>
        <button
          onClick={() => navigate('/medicines')}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
        >
          औषधियां देखें <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const shipping = subtotal >= 500 ? 0 : 49;
  const total = subtotal + shipping;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-emerald-900 mb-6">मेरा कार्ट</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {items.map(item => (
            <div key={item.medicine.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex gap-4">
              <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                {item.medicine.image_url ? (
                  <img src={item.medicine.image_url} alt={item.medicine.name_hi} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex justify-between gap-2">
                  <h3 className="font-semibold text-gray-800">{item.medicine.name_hi}</h3>
                  <button onClick={() => removeItem(item.medicine.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-1 line-clamp-1">{item.medicine.description}</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button onClick={() => updateQty(item.medicine.id, item.quantity - 1)} className="px-3 py-1.5 hover:bg-gray-50">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-1.5 font-medium text-sm">{item.quantity}</span>
                    <button onClick={() => updateQty(item.medicine.id, item.quantity + 1)} className="px-3 py-1.5 hover:bg-gray-50">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="font-bold text-emerald-700">{formatPrice(item.medicine.price * item.quantity)}</span>
                </div>
              </div>
            </div>
          ))}

          <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-600 font-medium mt-2">
            कार्ट साफ़ करें
          </button>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <h2 className="font-bold text-gray-800 mb-4 text-lg">बिल सारांश</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>उप-योग ({items.length} वस्तुएं)</span>
                <span className="font-medium text-gray-800">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>डिलीवरी शुल्क</span>
                <span className="font-medium text-gray-800">{shipping === 0 ? 'निःशुल्क' : formatPrice(shipping)}</span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-emerald-600 bg-emerald-50 rounded-lg p-2">
                  ₹{formatPrice(500 - subtotal).replace('₹', '')} और खरीदें और डिलीवरी निःशुल्क पाएं
                </p>
              )}
              <div className="border-t border-gray-100 pt-3 flex justify-between">
                <span className="font-bold text-gray-800">कुल</span>
                <span className="font-bold text-emerald-700 text-lg">{formatPrice(total)}</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/checkout')}
              className="w-full mt-5 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-medium transition-colors"
            >
              चेकआउट <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/medicines')}
              className="w-full mt-2 text-emerald-700 hover:text-emerald-800 text-sm font-medium py-2"
            >
              और खरीदें
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
