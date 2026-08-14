import { useState, useEffect } from 'react';
import { Calendar, CheckCircle, Clock, User, Phone, Mail, MapPin, Heart } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useUserAuth } from '@/context/UserAuthContext';
import { showToast } from '@/components/Toast';

const TIME_SLOTS = [
  'सुबह 9:00 - 10:00',
  'सुबह 10:00 - 11:00',
  'सुबह 11:00 - 12:00',
  'दोपहर 12:00 - 1:00',
  'शाम 5:00 - 6:00',
  'शाम 6:00 - 7:00',
  'शाम 7:00 - 8:00',
];

export default function AppointmentPage() {
  const { user } = useUserAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    patient_name: '',
    phone: '',
    email: '',
    age: '',
    gender: '',
    address: '',
    problem: '',
    preferred_date: '',
    preferred_time: '',
  });

  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        patient_name: user.user_metadata?.name || prev.patient_name,
        email: user.email || prev.email,
      }));
    }
  }, [user]);

  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from('appointments').insert({
        patient_name: form.patient_name,
        phone: form.phone,
        email: form.email || null,
        age: form.age ? parseInt(form.age) : null,
        gender: form.gender || null,
        address: form.address || null,
        problem: form.problem,
        preferred_date: form.preferred_date,
        preferred_time: form.preferred_time,
        status: 'pending',
      });
      if (error) throw error;
      setSuccess(true);
      showToast('अपॉइंटमेंट सफलतापूर्वक बुक हुई!', 'success');
    } catch {
      showToast('अपॉइंटमेंट बुक करने में त्रुटि। पुनः प्रयास करें।', 'error');
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
        <h1 className="text-2xl font-bold text-emerald-900 mb-2">अपॉइंटमेंट बुक हो गई!</h1>
        <p className="text-gray-600 mb-6">हमारी टीम जल्द ही आपके मोबाइल नंबर पर संपर्क करेगी और अपॉइंटमेंट कन्फर्म करेगी। धन्यवाद!</p>
        <button onClick={() => setSuccess(false)} className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition-colors">
          नई अपॉइंटमेंट बुक करें
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-5 gap-8">
        {/* Info Side */}
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-emerald-700 to-teal-800 rounded-2xl p-8 text-white">
            <h1 className="text-2xl font-bold mb-3">वैद्य से अपॉइंटमेंट बुक करें</h1>
            <p className="text-emerald-100 mb-6">अपनी समस्या बताएं और हमारे अनुभवी आयुर्वेदिक वैद्य से परामर्श पाएं।</p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">अनुभवी वैद्य</p>
                  <p className="text-sm text-emerald-200">वर्षों का अनुभव</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">व्यक्तिगत उपचार</p>
                  <p className="text-sm text-emerald-200">आपकी समस्या के अनुसार</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">लचीला समय</p>
                  <p className="text-sm text-emerald-200">सुबह 9 से शाम 8 तक</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-emerald-600 space-y-2 text-sm">
              <p className="flex items-center gap-2"><Phone className="w-4 h-4" /> +91 98765 43210</p>
              <p className="flex items-center gap-2"><Mail className="w-4 h-4" /> info@jbvaishdik.in</p>
              <p className="flex items-center gap-2"><MapPin className="w-4 h-4" /> मुख्य बाजार, बुद्ध चौक, भारत</p>
            </div>
          </div>
        </div>

        {/* Form Side */}
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-5">
            <h2 className="text-xl font-bold text-gray-800 mb-2">अपनी जानकारी भरें</h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">रोगी का नाम *</label>
                <input required value={form.patient_name} onChange={e => setForm({ ...form, patient_name: e.target.value })}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">उम्र</label>
                <input type="number" min="1" max="120" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">लिंग</label>
                <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
                  <option value="">चुनें</option>
                  <option value="male">पुरुष</option>
                  <option value="female">महिला</option>
                  <option value="other">अन्य</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">पता</label>
                <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">अपनी समस्या बताएं *</label>
              <textarea required rows={3} value={form.problem} onChange={e => setForm({ ...form, problem: e.target.value })}
                placeholder="जैसे — पेट की समस्या, जोड़ों का दर्द, त्वचा संबंधी..."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">पसंदीदा तारीख *</label>
                <input required type="date" min={today} value={form.preferred_date} onChange={e => setForm({ ...form, preferred_date: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">पसंदीदा समय *</label>
                <select required value={form.preferred_time} onChange={e => setForm({ ...form, preferred_time: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
                  <option value="">समय चुनें</option>
                  {TIME_SLOTS.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white py-3.5 rounded-xl font-medium transition-colors"
            >
              <Calendar className="w-5 h-5" />
              {loading ? 'बुक हो रहा है...' : 'अपॉइंटमेंट बुक करें'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
