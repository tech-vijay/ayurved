import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Search, Package } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Medicine, Category } from '@/lib/types';
import { formatPrice } from '@/lib/format';
import { showToast } from '@/components/Toast';

const emptyForm = {
  name: '', name_hi: '', description: '', benefits: '', ingredients: '', dosage: '',
  price: '', compare_at_price: '', stock: '', image_url: '', category_id: '', is_featured: false,
};

export default function AdminMedicines() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Medicine | null>(null);
  const [form, setForm] = useState<typeof emptyForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const [{ data: medData }, { data: catData }] = await Promise.all([
      supabase.from('medicines').select('*').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('sort_order'),
    ]);
    setMedicines(medData ?? []);
    setCategories(catData ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = medicines.filter(m =>
    m.name_hi.toLowerCase().includes(search.toLowerCase()) || m.name.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (med: Medicine) => {
    setEditing(med);
    setForm({
      name: med.name, name_hi: med.name_hi, description: med.description || '', benefits: med.benefits || '',
      ingredients: med.ingredients || '', dosage: med.dosage || '', price: String(med.price),
      compare_at_price: med.compare_at_price ? String(med.compare_at_price) : '', stock: String(med.stock),
      image_url: med.image_url || '', category_id: med.category_id || '', is_featured: med.is_featured,
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        name_hi: form.name_hi,
        description: form.description || null,
        benefits: form.benefits || null,
        ingredients: form.ingredients || null,
        dosage: form.dosage || null,
        price: parseFloat(form.price) || 0,
        compare_at_price: form.compare_at_price ? parseFloat(form.compare_at_price) : null,
        stock: parseInt(form.stock) || 0,
        image_url: form.image_url || null,
        category_id: form.category_id || null,
        is_featured: form.is_featured,
        is_active: true,
      };

      if (editing) {
        const { error } = await supabase.from('medicines').update(payload).eq('id', editing.id);
        if (error) throw error;
        showToast('औषधि अपडेट हुई', 'success');
      } else {
        const { error } = await supabase.from('medicines').insert(payload);
        if (error) throw error;
        showToast('नई औषधि जोड़ी गई', 'success');
      }
      setShowModal(false);
      load();
    } catch {
      showToast('सहेजने में त्रुटि', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (med: Medicine) => {
    if (!confirm(`क्या "${med.name_hi}" को हटाना निश्चित है?`)) return;
    const { error } = await supabase.from('medicines').delete().eq('id', med.id);
    if (error) {
      showToast('हटाने में त्रुटि', 'error');
    } else {
      showToast('औषधि हटाई गई', 'success');
      load();
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            placeholder="खोजें..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
          />
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" /> नई औषधि
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">औषधि</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 hidden md:table-cell">श्रेणी</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">कीमत</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 hidden sm:table-cell">स्टॉक</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 hidden lg:table-cell">विशेष</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600">क्रिया</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(med => {
                  const cat = categories.find(c => c.id === med.category_id);
                  return (
                    <tr key={med.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            {med.image_url && <img src={med.image_url} alt="" className="w-full h-full object-cover" />}
                          </div>
                          <div>
                            <p className="font-medium text-sm text-gray-800">{med.name_hi}</p>
                            <p className="text-xs text-gray-500">{med.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">{cat?.name_hi || '-'}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-800">{formatPrice(med.price)}</td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className={`text-sm font-medium ${med.stock <= 0 ? 'text-red-600' : med.stock < 10 ? 'text-amber-600' : 'text-emerald-600'}`}>
                          {med.stock}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        {med.is_featured ? <span className="text-amber-500 text-xs font-medium">हां</span> : <span className="text-gray-400 text-xs">नहीं</span>}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1">
                          <button onClick={() => openEdit(med)} className="p-2 rounded-lg hover:bg-emerald-50 text-emerald-600 transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(med)} className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">कोई औषधि नहीं मिली</p>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
              <h2 className="font-bold text-gray-800">{editing ? 'औषधि संपादित करें' : 'नई औषधि जोड़ें'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">नाम (हिंदी) *</label>
                  <input required value={form.name_hi} onChange={e => setForm({ ...form, name_hi: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">नाम (अंग्रेज़ी) *</label>
                  <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">श्रेणी</label>
                  <select value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-white">
                    <option value="">चुनें</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name_hi}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">छवि URL</label>
                  <input value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} placeholder="https://..."
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">कीमत (₹) *</label>
                  <input required type="number" step="0.01" min="0" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">तुलना कीमत (₹)</label>
                  <input type="number" step="0.01" min="0" value={form.compare_at_price} onChange={e => setForm({ ...form, compare_at_price: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">स्टॉक *</label>
                  <input required type="number" min="0" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm" />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.is_featured} onChange={e => setForm({ ...form, is_featured: e.target.checked })} className="w-4 h-4 text-emerald-600 rounded" />
                    <span className="text-sm font-medium text-gray-700">विशेष औषधि</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">विवरण</label>
                <textarea rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">लाभ</label>
                <textarea rows={2} value={form.benefits} onChange={e => setForm({ ...form, benefits: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">सामग्री</label>
                  <input value={form.ingredients} onChange={e => setForm({ ...form, ingredients: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">सेवन विधि</label>
                  <input value={form.dosage} onChange={e => setForm({ ...form, dosage: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-700 py-2.5 rounded-lg text-sm font-medium transition-colors">
                  रद्द करें
                </button>
                <button type="submit" disabled={saving} className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white py-2.5 rounded-lg text-sm font-medium transition-colors">
                  {saving ? 'सहेज रहे हैं...' : 'सहेजें'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
