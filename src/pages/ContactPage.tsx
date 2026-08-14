import { Phone, Mail, MapPin, Clock, Leaf } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-2xl md:text-3xl font-bold text-emerald-900 mb-2">संपर्क करें</h1>
        <p className="text-gray-500">हमसे जुड़ें — आपकी हर चिंता हमारी</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {[
          { icon: <Phone className="w-6 h-6" />, title: 'फोन', value: '+91 98765 43210', sub: 'सोम-शनि, 9 बजे - 8 बजे' },
          { icon: <Mail className="w-6 h-6" />, title: 'ईमेल', value: 'info@jbvaishdik.in', sub: '24 घंटे में उत्तर' },
          { icon: <MapPin className="w-6 h-6" />, title: 'पता', value: 'मुख्य बाजार, बुद्ध चौक', sub: 'भारत' },
        ].map((c, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 mx-auto mb-4">
              {c.icon}
            </div>
            <h3 className="font-bold text-gray-800 mb-1">{c.title}</h3>
            <p className="text-gray-700 font-medium">{c.value}</p>
            <p className="text-sm text-gray-500 mt-1">{c.sub}</p>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 md:p-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="w-6 h-6 text-emerald-600" />
              <h2 className="text-xl font-bold text-emerald-900">जय भारत बुद्ध वैदिकी</h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              हम आयुर्वेद के प्राचीन ज्ञान के आधार पर शुद्ध और प्रभावी औषधियां प्रदान करते हैं।
              आपके स्वास्थ्य और भलाई हमारी प्राथमिकता है।
            </p>
            <div className="space-y-2 text-sm text-gray-600">
              <p className="flex items-center gap-2"><Clock className="w-4 h-4 text-emerald-600" /> सोम - शनि: सुबह 9 - शाम 8</p>
              <p className="flex items-center gap-2"><Clock className="w-4 h-4 text-emerald-600" /> रविवार: सुबह 10 - दोपहर 2</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">संदेश भेजें</h3>
            <div className="space-y-3">
              <input placeholder="आपका नाम" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              <input placeholder="मोबाइल नंबर" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              <textarea rows={3} placeholder="आपका संदेश" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-medium transition-colors">
                संदेश भेजें
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
