import { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Menu, X, Phone, Calendar, Leaf, User as UserIcon, LogOut, Package } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useUserAuth } from '@/context/UserAuthContext';
import { navigate, useHashRoute } from '@/lib/router';

export default function Header() {
  const { totalItems } = useCart();
  const { user, signOut } = useUserAuth();
  const path = useHashRoute();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navLinks = [
    { label: 'होम', path: '/' },
    { label: 'औषधियां', path: '/medicines' },
    { label: 'श्रेणियां', path: '/categories' },
    { label: 'अपॉइंटमेंट', path: '/appointment' },
    { label: 'संपर्क', path: '/contact' },
  ];

  const isActive = (p: string) => {
    if (p === '/') return path === '/' || path === '';
    return path.startsWith(p);
  };

  const go = (p: string) => {
    navigate(p);
    setMobileOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    setUserMenuOpen(false);
    navigate('/');
  };

  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'यूज़र';

  return (
    <>
      <div className="bg-emerald-900 text-emerald-50 text-sm py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
          <span className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5" />
            <span>+91 98765 43210</span>
          </span>
          <span className="hidden sm:flex items-center gap-2 text-emerald-200">
            <Leaf className="w-3.5 h-3.5" />
            शुद्ध आयुर्वेदिक औषधियां • विश्वसनीय सेवा
          </span>
        </div>
      </div>

      <header className={`sticky top-0 z-50 bg-white transition-all duration-300 ${scrolled ? 'shadow-lg' : 'shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            <button onClick={() => go('/')} className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-lg md:text-xl font-bold text-emerald-800 leading-tight">जय भारत बुद्ध वैदिकी</h1>
                <p className="text-xs text-gray-500 hidden sm:block">प्रामाणिक आयुर्वेदिक उपचार केंद्र</p>
              </div>
            </button>

            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <button
                  key={link.path}
                  onClick={() => go(link.path)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive(link.path)
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-emerald-700'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <button
                onClick={() => go('/cart')}
                className="relative p-2.5 rounded-lg hover:bg-emerald-50 transition-colors"
                aria-label="कार्ट"
              >
                <ShoppingCart className="w-5 h-5 text-emerald-700" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-amber-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>

              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-emerald-50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                      <UserIcon className="w-4 h-4 text-emerald-700" />
                    </div>
                    <span className="hidden md:block text-sm font-medium text-gray-700 max-w-24 truncate">{userName}</span>
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-50">
                        <p className="text-sm font-medium text-gray-800 truncate">{userName}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={() => { go('/my-orders'); setUserMenuOpen(false); }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        <Package className="w-4 h-4" /> मेरे ऑर्डर
                      </button>
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> लॉगआउट
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => go('/login')}
                  className="hidden md:flex items-center gap-2 border border-emerald-200 text-emerald-700 hover:bg-emerald-50 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                >
                  <UserIcon className="w-4 h-4" />
                  लॉगिन
                </button>
              )}

              <button
                onClick={() => go('/appointment')}
                className="hidden lg:flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                <Calendar className="w-4 h-4" />
                अपॉइंटमेंट
              </button>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2.5 rounded-lg hover:bg-gray-100"
                aria-label="मेनू"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            <nav className="px-4 py-3 space-y-1">
              {navLinks.map(link => (
                <button
                  key={link.path}
                  onClick={() => go(link.path)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive(link.path)
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </button>
              ))}
              {user ? (
                <>
                  <button
                    onClick={() => go('/my-orders')}
                    className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
                  >
                    मेरे ऑर्डर
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50"
                  >
                    लॉगआउट
                  </button>
                </>
              ) : (
                <button
                  onClick={() => go('/login')}
                  className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-emerald-700 hover:bg-emerald-50"
                >
                  लॉगिन / साइनअप
                </button>
              )}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
