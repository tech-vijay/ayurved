import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, Truck, CreditCard, Wallet } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useUserAuth } from '@/context/UserAuthContext';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/lib/format';
import { navigate } from '@/lib/router';
import { showToast } from '@/components/Toast';

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useUserAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [form, setForm] = useState({
    customer_name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    pincode: '',
    payment_method: 'cod',
  });

  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        customer_name: user.user_metadata?.name || prev.customer_name,
        email: user.email || prev.email,
      }));
    }
  }, [user]);

  const shipping = subtotal >= 500 ? 0 : 49;
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setLoading(true);

    try {
      const { data: order, error } = await supabase.from('orders').insert({
        customer_name: form.customer_name,
        phone: form.phone,
        email: form.email || null,
        address: form.address,
        city: form.city || null,
        pincode: form.pincode || null,
        payment_method: form.payment_method,
        subtotal,
        shipping,
        total,
        status: 'pending',
      }).select().single();

      if (error) throw error;

      const orderItems = items.map(item => ({
        order_id: order.id,
        medicine_id: item.medicine.id,
        medicine_name: item.medicine.name_hi,
        medicine_image: item.medicine.image_url,
        price: item.medicine.price,
        quantity: item.quantity,
        subtotal: item.medicine.price * item.quantity,
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;

      for (const item of items) {
        await supabase.from('medicines')
          .update({ stock: Math.max(0, item.medicine.stock - item.quantity) })
          .eq('id', item.medicine.id);
      }

      setSuccess(order.order_number);
      clearCart();
      showToast('आपका ऑर्डर सफलतापूर्वक दर्ज हुआ!', 'success');
    } catch (err) {
      showToast('ऑर्डर दर्ज करने में त्रुटि। कृपया पुनः प्रयास करें।', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-emerald-600" />
        </div>
        <h1 className="text-2xl font-bold text-emerald-900 mb-2">ऑर्डर सफल हुआ!</h1>
        <p className="text-gray-600 mb-2">आपका ऑर्डर संख्या: <span className="font-bold text-emerald-700">{success}</span></p>
        <p className="text-gray-500 mb-6">हम जल्द ही आपसे संपर्क करेंगे और आपकी औषधियां घर पर डिलीवर करेंगे।</p>
        <button
          onClick={() => navigate('/medicines')}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
        >
          और औषधियां देखें
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500 mb-4">कार्ट खाली है</p>
        <button onClick={() => navigate('/medicines')} className="text-emerald-700 font-medium">औषधियां देखें</button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button onClick={() => navigate('/cart')} className="flex items-center gap-1 text-gray-500 hover:text-emerald-700 mb-6 text-sm">
        <ArrowLeft className="w-4 h-4" /> कार्ट पर वापस
      </button>

      <h1 className="text-2xl md:text-3xl font-bold text-emerald-900 mb-6">चेकआउट</h1>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5 text-emerald-600" /> डिलीवरी जानकारी
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">पूरा नाम *</label>
                <input required value={form.customer_name} onChange={e => setForm({ ...form, customer_name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">मोबाइल नंबर *</label>
                <input required type="tel" pattern="[0-9]{10}" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ईमेल</label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">पिन कोड *</label>
                <input required value={form.pincode} onChange={e => setForm({ ...form, pincode: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">पूरा पता *</label>
                <textarea required value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} rows={2}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">शहर</label>
                <input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-emerald-600" /> भुगतान विधि
            </h2>
            <div className="space-y-2">
              <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${form.payment_method === 'cod' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'}`}>
                <input type="radio" name="payment" value="cod" checked={form.payment_method === 'cod'} onChange={e => setForm({ ...form, payment_method: e.target.value })} className="text-emerald-600" />
                <Truck className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium text-sm text-gray-800">कैश ऑन डिलीवरी</p>
                  <p className="text-xs text-gray-500">उत्पाद मिलने पर भुगतान करें</p>
                </div>
              </label>
              <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${form.payment_method === 'upi' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'}`}>
                <input type="radio" name="payment" value="upi" checked={form.payment_method === 'upi'} onChange={e => setForm({ ...form, payment_method: e.target.value })} className="text-emerald-600" />
                <CreditCard className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium text-sm text-gray-800">UPI / ऑनलाइन</p>
                  <p className="text-xs text-gray-500">अभी ऑनलाइन भुगतान करें</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <h2 className="font-bold text-gray-800 mb-4">ऑर्डर सारांश</h2>
            <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
              {items.map(item => (
                <div key={item.medicine.id} className="flex gap-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                    {item.medicine.image_url && <img src={item.medicine.image_url} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 text-sm">
                    <p className="font-medium text-gray-800 line-clamp-1">{item.medicine.name_hi}</p>
                    <p className="text-gray-500">{item.quantity} × {formatPrice(item.medicine.price)}</p>
                  </div>
                  <span className="text-sm font-medium text-gray-800">{formatPrice(item.medicine.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>उप-योग</span><span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>डिलीवरी</span><span>{shipping === 0 ? 'निःशुल्क' : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-800 pt-2 border-t border-gray-100">
                <span>कुल</span><span className="text-emerald-700 text-lg">{formatPrice(total)}</span>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white py-3.5 rounded-xl font-medium transition-colors"
            >
              {loading ? 'ऑर्डर दर्ज हो रहा है...' : 'ऑर्डर कन्फर्म करें'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
