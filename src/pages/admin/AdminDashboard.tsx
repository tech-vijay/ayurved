import { useState, useEffect } from 'react';
import { Package, Calendar, ShoppingCart, TrendingUp, Clock, CheckCircle, XCircle, IndianRupee } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatPrice, formatDateTime } from '@/lib/format';
import { navigate } from '@/lib/router';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    medicines: 0,
    appointments: 0,
    pendingAppointments: 0,
    orders: 0,
    pendingOrders: 0,
    revenue: 0,
  });
  const [recentAppointments, setRecentAppointments] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [{ count: medCount }, { count: aptCount }, { count: ordCount }, { data: apts }, { data: ords }] = await Promise.all([
        supabase.from('medicines').select('*', { count: 'exact', head: true }),
        supabase.from('appointments').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('appointments').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5),
      ]);

      const pendingApts = (apts ?? []).filter((a: any) => a.status === 'pending').length;
      const pendingOrds = (ords ?? []).filter((o: any) => o.status === 'pending').length;
      const revenue = (ords ?? []).filter((o: any) => o.status === 'delivered' || o.status === 'confirmed').reduce((sum: number, o: any) => sum + Number(o.total), 0);

      setStats({
        medicines: medCount || 0,
        appointments: aptCount || 0,
        pendingAppointments: pendingApts,
        orders: ordCount || 0,
        pendingOrders: pendingOrds,
        revenue,
      });
      setRecentAppointments(apts ?? []);
      setRecentOrders(ords ?? []);
      setLoading(false);
    })();
  }, []);

  const statCards = [
    { label: 'कुल औषधियां', value: stats.medicines, icon: <Package className="w-6 h-6" />, color: 'emerald' },
    { label: 'कुल अपॉइंटमेंट', value: stats.appointments, icon: <Calendar className="w-6 h-6" />, color: 'blue' },
    { label: 'कुल ऑर्डर', value: stats.orders, icon: <ShoppingCart className="w-6 h-6" />, color: 'amber' },
    { label: 'कुल आय', value: formatPrice(stats.revenue), icon: <IndianRupee className="w-6 h-6" />, color: 'teal' },
  ];

  const colorMap: Record<string, string> = {
    emerald: 'bg-emerald-50 text-emerald-600',
    blue: 'bg-blue-50 text-blue-600',
    amber: 'bg-amber-50 text-amber-600',
    teal: 'bg-teal-50 text-teal-600',
  };

  const statusBadge = (status: string) => {
    const map: Record<string, { bg: string; text: string; label: string }> = {
      pending: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'लंबित' },
      confirmed: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'कन्फर्म' },
      completed: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'पूर्ण' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-700', label: 'रद्द' },
      delivered: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'डिलीवर' },
    };
    const s = map[status] || map.pending;
    return <span className={`px-2 py-1 rounded-md text-xs font-medium ${s.bg} ${s.text}`}>{s.label}</span>;
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${colorMap[card.color]}`}>
              {card.icon}
            </div>
            <p className="text-2xl font-bold text-gray-800">{card.value}</p>
            <p className="text-sm text-gray-500 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Pending Alerts */}
      {(stats.pendingAppointments > 0 || stats.pendingOrders > 0) && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
          <Clock className="w-5 h-5 text-amber-600" />
          <p className="text-sm text-amber-800">
            {stats.pendingAppointments} लंबित अपॉइंटमेंट और {stats.pendingOrders} लंबित ऑर्डर आपकी कार्रवाई का इंतज़ार कर रहे हैं।
          </p>
        </div>
      )}

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Appointments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-800">हाल की अपॉइंटमेंट</h2>
            <button onClick={() => navigate('/admin/appointments')} className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">सभी देखें</button>
          </div>
          <div className="divide-y divide-gray-50">
            {recentAppointments.length === 0 ? (
              <p className="p-5 text-sm text-gray-400 text-center">कोई अपॉइंटमेंट नहीं</p>
            ) : (
              recentAppointments.map((apt: any) => (
                <div key={apt.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm text-gray-800">{apt.patient_name}</p>
                    <p className="text-xs text-gray-500">{apt.preferred_date} • {apt.preferred_time}</p>
                  </div>
                  {statusBadge(apt.status)}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-800">हाल के ऑर्डर</h2>
            <button onClick={() => navigate('/admin/orders')} className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">सभी देखें</button>
          </div>
          <div className="divide-y divide-gray-50">
            {recentOrders.length === 0 ? (
              <p className="p-5 text-sm text-gray-400 text-center">कोई ऑर्डर नहीं</p>
            ) : (
              recentOrders.map((ord: any) => (
                <div key={ord.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm text-gray-800">{ord.order_number}</p>
                    <p className="text-xs text-gray-500">{ord.customer_name} • {formatPrice(ord.total)}</p>
                  </div>
                  {statusBadge(ord.status)}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
