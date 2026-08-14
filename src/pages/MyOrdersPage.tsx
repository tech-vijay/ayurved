import { useState, useEffect } from 'react';
import { Package, ChevronRight, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useUserAuth } from '@/context/UserAuthContext';
import type { Order, OrderItem } from '@/lib/types';
import { formatPrice, formatDateTime } from '@/lib/format';
import { navigate } from '@/lib/router';

const statusLabels: Record<string, { bg: string; text: string; label: string }> = {
  pending: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'लंबित' },
  confirmed: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'कन्फर्म' },
  shipped: { bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'भेजा गया' },
  delivered: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'डिलीवर' },
  cancelled: { bg: 'bg-red-100', text: 'text-red-700', label: 'रद्द' },
};

export default function MyOrdersPage() {
  const { user } = useUserAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);

  useEffect(() => {
    if (!user?.email) { setLoading(false); return; }
    (async () => {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('email', user.email)
        .order('created_at', { ascending: false });
      setOrders(data ?? []);
      setLoading(false);
    })();
  }, [user]);

  const openOrder = async (ord: Order) => {
    setSelected(ord);
    const { data } = await supabase.from('order_items').select('*').eq('order_id', ord.id);
    setItems(data ?? []);
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500 mb-4">ऑर्डर देखने के लिए लॉगिन करें</p>
        <button onClick={() => navigate('/login')} className="text-emerald-700 font-medium">लॉगिन करें</button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-emerald-900 mb-6">मेरे ऑर्डर</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-400 text-sm">अभी कोई ऑर्डर नहीं</p>
          <button onClick={() => navigate('/medicines')} className="mt-4 text-emerald-700 font-medium text-sm">औषधियां देखें</button>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map(ord => {
            const s = statusLabels[ord.status] || statusLabels.pending;
            return (
              <div
                key={ord.id}
                onClick={() => openOrder(ord)}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow"
              >
                <div>
                  <p className="font-bold text-emerald-700 text-sm">{ord.order_number}</p>
                  <p className="text-xs text-gray-500 mt-1">{formatDateTime(ord.created_at)}</p>
                  <p className="text-xs text-gray-500">{ord.customer_name}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-bold text-gray-800">{formatPrice(ord.total)}</p>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-md text-xs font-medium ${s.bg} ${s.text}`}>{s.label}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
              <h2 className="font-bold text-gray-800">ऑर्डर विवरण</h2>
              <button onClick={() => setSelected(null)} className="p-2 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-700">{selected.order_number}</span>
                <span className={`px-2 py-1 rounded-md text-xs font-medium ${(statusLabels[selected.status] || statusLabels.pending).bg} ${(statusLabels[selected.status] || statusLabels.pending).text}`}>
                  {(statusLabels[selected.status] || statusLabels.pending).label}
                </span>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p><span className="font-medium text-gray-800">नाम:</span> {selected.customer_name}</p>
                <p><span className="font-medium text-gray-800">फोन:</span> {selected.phone}</p>
                <p><span className="font-medium text-gray-800">पता:</span> {selected.address}, {selected.city} - {selected.pincode}</p>
                <p><span className="font-medium text-gray-800">भुगतान:</span> {selected.payment_method === 'cod' ? 'कैश ऑन डिलीवरी' : 'UPI'}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                {items.map(item => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                      {item.medicine_image && <img src={item.medicine_image} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{item.medicine_name}</p>
                      <p className="text-xs text-gray-500">{item.quantity} × {formatPrice(item.price)}</p>
                    </div>
                    <span className="text-sm font-medium text-gray-800">{formatPrice(item.subtotal)}</span>
                  </div>
                ))}
                <div className="border-t border-gray-200 pt-3 space-y-1 text-sm">
                  <div className="flex justify-between text-gray-600"><span>उप-योग</span><span>{formatPrice(selected.subtotal)}</span></div>
                  <div className="flex justify-between text-gray-600"><span>डिलीवरी</span><span>{selected.shipping === 0 ? 'निःशुल्क' : formatPrice(selected.shipping)}</span></div>
                  <div className="flex justify-between font-bold text-gray-800 pt-1"><span>कुल</span><span className="text-emerald-700">{formatPrice(selected.total)}</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
