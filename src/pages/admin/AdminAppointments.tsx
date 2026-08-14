import { useState, useEffect } from 'react';
import { Calendar, Phone, Mail, MapPin, X, User, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Appointment } from '@/lib/types';
import { formatDate, formatDateTime } from '@/lib/format';
import { showToast } from '@/components/Toast';

const STATUSES = [
  { value: 'pending', label: 'लंबित', bg: 'bg-amber-100', text: 'text-amber-700' },
  { value: 'confirmed', label: 'कन्फर्म', bg: 'bg-blue-100', text: 'text-blue-700' },
  { value: 'completed', label: 'पूर्ण', bg: 'bg-emerald-100', text: 'text-emerald-700' },
  { value: 'cancelled', label: 'रद्द', bg: 'bg-red-100', text: 'text-red-700' },
];

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState<Appointment | null>(null);

  const load = async () => {
    const { data } = await supabase.from('appointments').select('*').order('created_at', { ascending: false });
    setAppointments(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = filter === 'all' ? appointments : appointments.filter(a => a.status === filter);

  const updateStatus = async (apt: Appointment, status: string) => {
    const { error } = await supabase.from('appointments').update({ status }).eq('id', apt.id);
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
          सभी ({appointments.length})
        </button>
        {STATUSES.map(s => (
          <button key={s.value} onClick={() => setFilter(s.value)} className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${filter === s.value ? 'bg-emerald-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {s.label} ({appointments.filter(a => a.status === s.value).length})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-400 text-sm">कोई अपॉइंटमेंट नहीं</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(apt => (
            <div key={apt.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelected(apt)}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-gray-800">{apt.patient_name}</h3>
                  <p className="text-xs text-gray-500">{apt.phone}</p>
                </div>
                {statusBadge(apt.status)}
              </div>
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">{apt.problem}</p>
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formatDate(apt.preferred_date)}</span>
                <span>•</span>
                <Clock className="w-3.5 h-3.5" />
                <span>{apt.preferred_time}</span>
              </div>
              <p className="text-xs text-gray-400">{formatDateTime(apt.created_at)}</p>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
              <h2 className="font-bold text-gray-800">अपॉइंटमेंट विवरण</h2>
              <button onClick={() => setSelected(null)} className="p-2 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                {statusBadge(selected.status)}
                <span className="text-xs text-gray-400">{formatDateTime(selected.created_at)}</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="font-medium text-gray-800">{selected.patient_name}</span>
                  {selected.age && <span className="text-gray-500">({selected.age} वर्ष)</span>}
                  {selected.gender && <span className="text-gray-500">• {selected.gender === 'male' ? 'पुरुष' : selected.gender === 'female' ? 'महिला' : 'अन्य'}</span>}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4 text-gray-400" /> {selected.phone}
                </div>
                {selected.email && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4 text-gray-400" /> {selected.email}
                  </div>
                )}
                {selected.address && (
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5" /> {selected.address}
                  </div>
                )}
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm font-medium text-gray-700 mb-1">समस्या</p>
                <p className="text-sm text-gray-600">{selected.problem}</p>
              </div>

              <div className="bg-emerald-50 rounded-xl p-4">
                <p className="text-sm font-medium text-emerald-700 mb-1">पसंदीदा समय</p>
                <p className="text-sm text-gray-700">{formatDate(selected.preferred_date)} • {selected.preferred_time}</p>
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
