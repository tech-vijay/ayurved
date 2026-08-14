import { useState, useEffect } from 'react';
import { ShoppingCart, Phone, MapPin, X, Package, IndianRupee } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Order, OrderItem } from '@/lib/types';
import { formatPrice, formatDateTime } from '@/lib/format';
import { showToast } from '@/components/Toast';

const STATUSES = [
  { value: 'pending', label: 'लंबित', bg: 'bg-amber-100', text: 'text-amber-700' },
  { value: 'confirmed', label: 'कन्फर्म', bg: 'bg-blue-100', text: 'text-blue-700' },
  { value: 'shipped', label: 'भेजा गया', bg: 'bg-indigo-100', text: 'text-indigo-700' },
  { value: 'delivered', label: 'डिलीवर', bg: 'bg-emerald-100', text: 'text-emerald-700' },
  { value: 'cancelled', label: 'रद्द', bg: 'bg-red-100', text: 'text-red-700' },
];

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);

  const load = async () => {
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    setOrders(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  const openOrder = async (ord: Order) => {
    setSelected(ord);
    const { data } = await supabase.from('order_items').select('*').eq('order_id', ord.id);
    setItems(data ?? []);
  };

  const updateStatus = async (ord: Order, status: string) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', ord.id);
    if (error) {
      showToast('अपडेट में त्रुटि', 'error');
    } else {
      showToast('स्थिति अपडेट हुई', 'success');
      load();
      setSelected(prev => prev ? { ...prev, status } : null);
    }
  };

  const statusBadge = (status: string) => {
    const s = STATUSES.find(s => s.value === status) || STATUSES[0];
    return <span className={`px-2 py-1 rounded-md text-xs font-medium ${s.bg} ${s.text}`}>{s.label}</span>;
  };

  return (
    <div>
      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${filter === 'all' ? 'bg-emerald-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
          सभी ({orders.length})
        </button>
        {STATUSES.map(s => (
          <button key={s.value} onClick={() => setFilter(s.value)} className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${filter === s.value ? 'bg-emerald-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {s.label} ({orders.filter(o => o.status === s.value).length})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-400 text-sm">कोई ऑर्डर नहीं</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">ऑर्डर नंबर</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 hidden sm:table-cell">ग्राहक</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">कुल</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 hidden md:table-cell">भुगतान</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">स्थिति</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 hidden lg:table-cell">तारीख</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(ord => (
                  <tr key={ord.id} onClick={() => openOrder(ord)} className="hover:bg-gray-50 cursor-pointer">
                    <td className="px-4 py-3 text-sm font-medium text-emerald-700">{ord.order_number}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 hidden sm:table-cell">{ord.customer_name}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{formatPrice(ord.total)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">{ord.payment_method === 'cod' ? 'कैश ऑन डिलीवरी' : 'UPI'}</td>
                    <td className="px-4 py-3">{statusBadge(ord.status)}</td>
                    <td className="px-4 py-3 text-xs text-gray-500 hidden lg:table-cell">{formatDateTime(ord.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
                <span className="font-bold text-emerald-700 text-lg">{selected.order_number}</span>
                {statusBadge(selected.status)}
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-600"><span className="font-medium text-gray-800">ग्राहक:</span> {selected.customer_name}</p>
                <p className="flex items-center gap-2 text-sm text-gray-600"><Phone className="w-4 h-4 text-gray-400" /> {selected.phone}</p>
                {selected.email && <p className="text-sm text-gray-600">{selected.email}</p>}
                <p className="flex items-start gap-2 text-sm text-gray-600"><MapPin className="w-4 h-4 text-gray-400 mt-0.5" /> {selected.address}, {selected.city} - {selected.pincode}</p>
                <p className="text-sm text-gray-600"><span className="font-medium text-gray-800">भुगतान:</span> {selected.payment_method === 'cod' ? 'कैश ऑन डिलीवरी' : 'UPI / ऑनलाइन'}</p>
              </div>

              {/* Items */}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2"><Package className="w-4 h-4" /> औषधियां</p>
                <div className="space-y-3">
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
                </div>
                <div className="border-t border-gray-200 mt-3 pt-3 space-y-1 text-sm">
                  <div className="flex justify-between text-gray-600"><span>उप-योग</span><span>{formatPrice(selected.subtotal)}</span></div>
                  <div className="flex justify-between text-gray-600"><span>डिलीवरी</span><span>{selected.shipping === 0 ? 'निःशुल्क' : formatPrice(selected.shipping)}</span></div>
                  <div className="flex justify-between font-bold text-gray-800 pt-1"><span>कुल</span><span className="text-emerald-700">{formatPrice(selected.total)}</span></div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">स्थिति बदलें</label>
                <div className="flex flex-wrap gap-2">
                  {STATUSES.map(s => (
                    <button
                      key={s.value}
                      onClick={() => updateStatus(selected, s.value)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${selected.status === s.value ? `${s.bg} ${s.text} ring-2 ring-offset-1 ring-current` : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
