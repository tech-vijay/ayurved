import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Medicine, Category } from '@/lib/types';
import MedicineCard from '@/components/MedicineCard';
import { useHashRoute, parseRoute } from '@/lib/router';

export default function MedicinesPage() {
  const path = useHashRoute();
  const { query } = parseRoute(path);
  const initialCategory = query.category || '';

  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    (async () => {
      const [{ data: medData }, { data: catData }] = await Promise.all([
        supabase.from('medicines').select('*').eq('is_active', true).order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('sort_order'),
      ]);
      setMedicines(medData ?? []);
      setCategories(catData ?? []);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    setSelectedCategory(query.category || '');
  }, [query.category]);

  let filtered = medicines;
  if (selectedCategory) {
    filtered = filtered.filter(m => m.category_id === selectedCategory);
  }
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(m =>
      m.name_hi.toLowerCase().includes(q) || m.name.toLowerCase().includes(q)
    );
  }
  if (sortBy === 'price-low') filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sortBy === 'price-high') filtered = [...filtered].sort((a, b) => b.price - a.price);
  if (sortBy === 'name') filtered = [...filtered].sort((a, b) => a.name_hi.localeCompare(b.name_hi));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-emerald-900 mb-2">आयुर्वेदिक औषधियां</h1>
        <p className="text-gray-500">शुद्ध और प्रामाणिक औषधियां — अपनी ज़रूरत चुनें</p>
      </div>

      {/* Search & Sort Bar */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="औषधि खोजें..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-sm font-medium text-gray-700"
        >
          <option value="newest">नई पहले</option>
          <option value="price-low">कम कीमत</option>
          <option value="price-high">अधिक कीमत</option>
          <option value="name">नाम क्रमानुसार</option>
        </select>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden p-3 border border-gray-200 rounded-xl hover:bg-gray-50"
        >
          <SlidersHorizontal className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="flex gap-6">
        {/* Category Sidebar */}
        <aside className={`${showFilters ? 'fixed inset-0 z-50 bg-black/40' : 'hidden'} md:block md:relative md:inset-auto md:bg-transparent md:z-auto w-64 flex-shrink-0`}>
          {showFilters && (
            <div className="absolute inset-0 md:hidden" onClick={() => setShowFilters(false)} />
          )}
          <div className={`relative bg-white md:bg-transparent w-64 h-full md:h-auto ${showFilters ? 'ml-auto' : ''}`}>
            <div className="flex items-center justify-between md:hidden p-4 border-b">
              <h3 className="font-bold">श्रेणियां</h3>
              <button onClick={() => setShowFilters(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="p-4 md:p-0">
              <h3 className="font-bold text-gray-800 mb-3 hidden md:block">श्रेणियां</h3>
              <div className="space-y-1">
                <button
                  onClick={() => { setSelectedCategory(''); setShowFilters(false); }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    !selectedCategory ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  सभी औषधियां
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => { setSelectedCategory(cat.id); setShowFilters(false); }}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === cat.id ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {cat.name_hi}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Medicine Grid */}
        <div className="flex-1">
          <p className="text-sm text-gray-500 mb-4">{filtered.length} औषधियां मिलीं</p>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm animate-pulse">
                  <div className="aspect-square bg-gray-200 rounded-t-xl" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-8 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">कोई औषधि नहीं मिली</p>
              <p className="text-gray-400 text-sm mt-1">दूसरी श्रेणी या खोज आज़माएं</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map(med => (
                <MedicineCard key={med.id} medicine={med} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
