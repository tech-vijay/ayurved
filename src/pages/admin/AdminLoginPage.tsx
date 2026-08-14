import { useState, FormEvent } from 'react';
import { Lock, Mail, Leaf, ArrowRight } from 'lucide-react';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { navigate } from '@/lib/router';
import { showToast } from '@/components/Toast';

export default function AdminLoginPage() {
  const { signIn } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      showToast('गलत ईमेल या पासवर्ड', 'error');
    } else {
      showToast('व्यवस्थापक लॉगिन सफल', 'success');
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Leaf className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-emerald-900">व्यवस्थापक लॉगिन</h1>
          <p className="text-gray-500 text-sm mt-1">जय भारत बुद्ध वैदिकी प्रबंधन</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ईमेल</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@jbvaishdik.in"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">पासवर्ड</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white py-3.5 rounded-xl font-medium transition-colors"
          >
            {loading ? 'लॉगिन हो रहा है...' : 'लॉगिन करें'}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <button onClick={() => navigate('/')} className="block mx-auto mt-6 text-sm text-gray-500 hover:text-emerald-700">
          वेबसाइट पर वापस जाएं
        </button>
      </div>
    </div>
  );
}
