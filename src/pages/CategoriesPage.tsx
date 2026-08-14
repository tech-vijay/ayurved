import { useState, useEffect } from 'react';
import { Leaf, Activity, ShieldCheck, Heart, Sprout, Star, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Category, Medicine } from '@/lib/types';
import { navigate } from '@/lib/router';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [{ data: catData }, { data: medData }] = await Promise.all([
        supabase.from('categories').select('*').order('sort_order'),
        supabase.from('medicines').select('category_id').eq('is_active', true),
      ]);
      setCategories(catData ?? []);
      const c: Record<string, number> = {};
      (medData ?? []).forEach(m => {
        if (m.category_id) c[m.category_id] = (c[m.category_id] || 0) + 1;
      });
      setCounts(c);
      setLoading(false);
    })();
  }, []);

  const icons: Record<string, React.ReactNode> = {
    leaf: <Leaf className="w-10 h-10" />,
    pill: <Activity className="w-10 h-10" />,
    droplet: <ShieldCheck className="w-10 h-10" />,
    droplets: <Heart className="w-10 h-10" />,
    coffee: <Sprout className="w-10 h-10" />,
    jar: <Star className="w-10 h-10" />,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-2xl md:text-3xl font-bold text-emerald-900 mb-2">औषधि श्रेणियां</h1>
        <p className="text-gray-500">अपनी ज़रूरत के अनुसार श्रेणी चुनें</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm animate-pulse p-6 h-40" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => navigate(`/medicines?category=${cat.id}`)}
              className="group bg-white rounded-xl shadow-sm hover:shadow-xl border border-gray-100 hover:border-emerald-200 p-6 text-left transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-emerald-50 group-hover:bg-emerald-100 flex items-center justify-center text-emerald-600 transition-colors flex-shrink-0">
                  {icons[cat.icon || 'leaf'] || <Leaf className="w-10 h-10" />}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 mb-1">{cat.name_hi}</h3>
                  <p className="text-sm text-gray-500 mb-2">{cat.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-emerald-600 font-medium">{counts[cat.id] || 0} औषधियां</span>
                    <ArrowRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
