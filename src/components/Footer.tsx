import { Phone, MapPin, Clock } from 'lucide-react';
import { WhatsAppIcon } from '@/components/WhatsAppIcon';
import { navigate } from '@/lib/router';
import logoImg from '@/images/logo.png';

export default function Footer() {
  return (
    <footer className="bg-emerald-900 text-emerald-50 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="inline-block bg-white p-3 rounded-2xl shadow-sm border border-emerald-700/20 mb-4">
              <img
                src={logoImg}
                alt="जय भारत बुद्ध वैदिकी"
                className="h-12 sm:h-14 w-auto object-contain"
              />
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
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-400" />
                <span>सिकरीगंज, गोरखपुर</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                <a href="tel:9005937956" className="hover:text-white transition-colors">+91 9005937956</a>
              </li>
              <li className="flex items-center gap-2">
                <WhatsAppIcon className="w-4 h-4 flex-shrink-0 text-[#25D366]" />
                <a href="https://wa.me/917317651331" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center gap-1 font-medium">
                  <span>व्हाट्सएप चैट : +91 7317651331</span>
                </a>
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
