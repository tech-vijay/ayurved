import { ReactNode, useState } from 'react';
import { LayoutDashboard, Package, Tags, Calendar, ShoppingCart, LogOut, Menu, X, Home } from 'lucide-react';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { navigate, useHashRoute, parseRoute } from '@/lib/router';
import { showToast } from '@/components/Toast';
import logoImg from '@/images/logo.png';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { signOut } = useAdminAuth();
  const path = useHashRoute();
  const { segments } = parseRoute(path);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { label: 'डैशबोर्ड', path: '/admin/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: 'औषधियां', path: '/admin/medicines', icon: <Package className="w-5 h-5" /> },
    { label: 'श्रेणियां', path: '/admin/categories', icon: <Tags className="w-5 h-5" /> },
    { label: 'अपॉइंटमेंट', path: '/admin/appointments', icon: <Calendar className="w-5 h-5" /> },
    { label: 'ऑर्डर', path: '/admin/orders', icon: <ShoppingCart className="w-5 h-5" /> },
  ];

  const isActive = (p: string) => path.startsWith(p);
  const currentLabel = menuItems.find(m => isActive(m.path))?.label || 'डैशबोर्ड';

  const handleSignOut = async () => {
    await signOut();
    showToast('लॉगआउट हो गया', 'info');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:sticky top-0 left-0 h-screen w-64 bg-emerald-900 text-emerald-50 z-50 transition-transform flex flex-col`}>
        <div className="p-4 border-b border-emerald-800">
          <div className="bg-white p-2.5 rounded-xl shadow-sm border border-emerald-700/20 mb-1.5 inline-block cursor-pointer" onClick={() => navigate('/')}>
            <img
              src={logoImg}
              alt="जय भारत बुद्ध वैदिकी"
              className="h-10 w-auto object-contain"
            />
          </div>
          <p className="text-xs text-emerald-300 font-medium pl-1">व्यवस्थापक पैनल</p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {menuItems.map(item => (
            <button
              key={item.path}
              onClick={() => { navigate(item.path); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive(item.path) ? 'bg-emerald-700 text-white' : 'text-emerald-200 hover:bg-emerald-800'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-emerald-800 space-y-1">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-emerald-200 hover:bg-emerald-800 transition-colors"
          >
            <Home className="w-5 h-5" /> वेबसाइट देखें
          </button>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-300 hover:bg-emerald-800 transition-colors"
          >
            <LogOut className="w-5 h-5" /> लॉगआउट
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <header className="bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden p-2 rounded-lg hover:bg-gray-100">
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h1 className="text-lg font-bold text-gray-800">{currentLabel}</h1>
          </div>
        </header>

        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
