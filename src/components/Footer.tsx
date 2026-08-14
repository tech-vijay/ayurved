import { Leaf, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { navigate } from '@/lib/router';

export default function Footer() {
  return (
    <footer className="bg-emerald-900 text-emerald-50 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg">जय भारत बुद्ध वैदिकी</h3>
                <p className="text-xs text-emerald-300">प्रामाणिक आयुर्वेदिक उपचार केंद्र</p>
              </div>
            </div>
            <p className="text-sm text-emerald-200 leading-relaxed">
              हम आयुर्वेद के प्राचीन ज्ञान के आधार पर शुद्ध और प्रभावी औषधियां प्रदान करते हैं। आपके स्वास्थ्य हमारी प्राथमिकता है।
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-amber-300">त्वरित लिंक</h4>
            <ul className="space-y-2 text-sm text-emerald-200">
              <li><button onClick={() => navigate('/')} className="hover:text-white transition-colors">होम</button></li>
              <li><button onClick={() => navigate('/medicines')} className="hover:text-white transition-colors">औषधियां</button></li>
              <li><button onClick={() => navigate('/categories')} className="hover:text-white transition-colors">श्रेणियां</button></li>
              <li><button onClick={() => navigate('/appointment')} className="hover:text-white transition-colors">अपॉइंटमेंट</button></li>
              <li><button onClick={() => navigate('/admin')} className="hover:text-white transition-colors">व्यवस्थापक</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-amber-300">संपर्क जानकारी</h4>
            <ul className="space-y-3 text-sm text-emerald-200">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>मुख्य बाजार, बुद्ध चौक, भारत</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>info@jbvaishdik.in</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-amber-300">समय</h4>
            <ul className="space-y-2 text-sm text-emerald-200">
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span>सोम - शनि: सुबह 9 - शाम 8</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span>रविवार: सुबह 10 - दोपहर 2</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-emerald-800 mt-10 pt-6 text-center text-sm text-emerald-300">
          <p>© 2026 जय भारत बुद्ध वैदिकी। सर्वाधिकार सुरक्षित।</p>
        </div>
      </div>
    </footer>
  );
}
