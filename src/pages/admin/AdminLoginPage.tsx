import { useState, FormEvent } from 'react';
import { Lock, Mail, ArrowRight, AlertCircle, LogOut } from 'lucide-react';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { navigate } from '@/lib/router';
import { showToast } from '@/components/Toast';
import logoImg from '@/images/logo.png';

export default function AdminLoginPage() {
  const { signIn, signOut, session, isAdmin } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      if (error.toLowerCase().includes('email not confirmed')) {
        showToast('ईमेल की पुष्टि नहीं हुई है! कृपया अपना ईमेल इनबॉक्स चेक करें और कन्फर्मेशन लिंक पर क्लिक करें।', 'error');
      } else if (error.toLowerCase().includes('invalid login credentials')) {
        showToast('गलत ईमेल या पासवर्ड', 'error');
      } else {
        showToast(error, 'error');
      }
    } else {
      showToast('व्यवस्थापक लॉगिन सफल', 'success');
      navigate('/admin/dashboard');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    showToast('लॉगआउट हो गया', 'info');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div
            onClick={() => navigate('/')}
            className="bg-white p-3 rounded-2xl shadow-md border border-gray-100 inline-block mb-3 cursor-pointer transition-transform hover:scale-105"
          >
            <img
              src={logoImg}
              alt="जय भारत बुद्ध वैदिकी"
              className="h-14 md:h-16 w-auto object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-emerald-900">व्यवस्थापक लॉगिन</h1>
          <p className="text-gray-500 text-sm mt-1">जय भारत बुद्ध वैदिकी प्रबंधन</p>
        </div>

        {session && !isAdmin && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 text-amber-800 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">आपके पास एडमिन अधिकार नहीं हैं</p>
              <p className="text-xs text-amber-700 mt-1">
                वर्तमान उपयोगकर्ता ({session.user.email}) एडमिन के रूप में अधिकृत नहीं है। एडमिन खाते से प्रवेश करें।
              </p>
              <button
                onClick={handleSignOut}
                className="mt-3 flex items-center gap-1.5 bg-amber-200 hover:bg-amber-300 text-amber-900 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" /> लॉगआउट करें
              </button>
            </div>
          </div>
        )}

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
