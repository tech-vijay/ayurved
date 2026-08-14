import { useState, useEffect } from 'react';
import { Calendar, Truck, ShieldCheck, Leaf, ArrowRight, Star, Heart, Activity, Sprout } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Medicine, Category } from '@/lib/types';
import MedicineCard from '@/components/MedicineCard';
import { navigate } from '@/lib/router';

export default function HomePage() {
  const [featured, setFeatured] = useState<Medicine[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [{ data: medData }, { data: catData }] = await Promise.all([
        supabase.from('medicines').select('*').eq('is_active', true).eq('is_featured', true).limit(8),
        supabase.from('categories').select('*').order('sort_order'),
      ]);
      setFeatured(medData ?? []);
      setCategories(catData ?? []);
      setLoading(false);
    })();
  }, []);

  const categoryIcons: Record<string, React.ReactNode> = {
    leaf: <Leaf className="w-8 h-8" />,
    pill: <Activity className="w-8 h-8" />,
    droplet: <ShieldCheck className="w-8 h-8" />,
    droplets: <Heart className="w-8 h-8" />,
    coffee: <Sprout className="w-8 h-8" />,
    jar: <Star className="w-8 h-8" />,
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-50 via-teal-50 to-amber-50 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-300 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Leaf className="w-4 h-4" />
                प्रामाणिक आयुर्वेदिक उपचार
              </span>
              <h1 className="text-3xl md:text-5xl font-bold text-emerald-900 leading-tight mb-4">
                प्राकृतिक चिकित्सा,<br />
                <span className="text-amber-600">शुद्ध आयुर्वेद</span> से
              </h1>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                जय भारत बुद्ध वैदिकी में आपको मिलेंगी शुद्ध और प्रभावी आयुर्वेदिक औषधियां।
                अपॉइंटमेंट बुक करें या ऑनलाइन औषधियां मंगाएं — घर बैठे स्वास्थ्य लाभ पाएं।
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate('/appointment')}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3.5 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
                >
                  <Calendar className="w-5 h-5" />
                  अपॉइंटमेंट बुक करें
                </button>
                <button
                  onClick={() => navigate('/medicines')}
                  className="flex items-center gap-2 bg-white hover:bg-gray-50 text-emerald-700 border-2 border-emerald-200 px-6 py-3.5 rounded-xl font-medium transition-all"
                >
                  औषधियां देखें
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.pexels.com/photos/5480035/pexels-photo-5480035.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                  alt="आयुर्वेदिक औषधियां"
                  className="w-full h-80 md:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/30 to-transparent" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-xl p-4 flex items-center gap-3 hidden md:flex">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-800">100% शुद्ध</p>
                  <p className="text-xs text-gray-500">प्राकृतिक औषधियां</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <Truck className="w-6 h-6" />, title: 'घर पर डिलीवरी', desc: 'तेज़ और सुरक्षित' },
              { icon: <ShieldCheck className="w-6 h-6" />, title: '100% शुद्ध', desc: 'प्रामाणिक औषधियां' },
              { icon: <Calendar className="w-6 h-6" />, title: 'अपॉइंटमेंट', desc: 'विशेषज्ञ से मिलें' },
              { icon: <Leaf className="w-6 h-6" />, title: 'आयुर्वेदिक', desc: 'प्राचीन ज्ञान' },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
                  {f.icon}
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-800">{f.title}</p>
                  <p className="text-xs text-gray-500">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-emerald-900 mb-2">औषधि श्रेणियां</h2>
          <p className="text-gray-500">अपनी ज़रूरत के अनुसार श्रेणी चुनें</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => navigate(`/medicines?category=${cat.id}`)}
              className="group bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-lg border border-gray-100 hover:border-emerald-200 transition-all"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-50 group-hover:bg-emerald-100 flex items-center justify-center text-emerald-600 mx-auto mb-3 transition-colors">
                {categoryIcons[cat.icon || 'leaf'] || <Leaf className="w-8 h-8" />}
              </div>
              <h3 className="font-semibold text-sm text-gray-800">{cat.name_hi}</h3>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Medicines */}
      <section className="bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-emerald-900 mb-2">विशेष औषधियां</h2>
              <p className="text-gray-500">हमारी सबसे लोकप्रिय आयुर्वेदिक औषधियां</p>
            </div>
            <button
              onClick={() => navigate('/medicines')}
              className="hidden md:flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-medium text-sm"
            >
              सभी देखें <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm animate-pulse">
                  <div className="aspect-square bg-gray-200 rounded-t-xl" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-full" />
                    <div className="h-8 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {featured.map(med => (
                <MedicineCard key={med.id} medicine={med} />
              ))}
            </div>
          )}

          <div className="text-center mt-8 md:hidden">
            <button
              onClick={() => navigate('/medicines')}
              className="inline-flex items-center gap-1 text-emerald-700 font-medium text-sm"
            >
              सभी औषधियां देखें <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-r from-emerald-700 to-teal-700 rounded-2xl overflow-hidden relative">
          <div className="absolute inset-0 opacity-20">
            <img
              src="https://images.pexels.com/photos/38494113/pexels-photo-38494113.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative px-6 md:px-12 py-10 md:py-14 text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">विशेषज्ञ वैद्य से परामर्श लें</h2>
            <p className="text-emerald-100 mb-6 max-w-xl">
              अपनी समस्या बताएं और हमारे अनुभवी आयुर्वेदिक वैद्य से अपॉइंटमेंट बुक करें।
              उचित परामर्श और प्रभावी उपचार की गारंटी।
            </p>
            <button
              onClick={() => navigate('/appointment')}
              className="inline-flex items-center gap-2 bg-white text-emerald-700 hover:bg-emerald-50 px-6 py-3 rounded-xl font-medium transition-colors"
            >
              <Calendar className="w-5 h-5" />
              अभी अपॉइंटमेंट बुक करें
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
