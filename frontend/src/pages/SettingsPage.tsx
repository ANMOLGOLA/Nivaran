import React from 'react';
import type { AppUser } from '../App';
import { Bell, Shield, Languages } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const SettingsPage: React.FC<{ user: AppUser }> = () => {
  const { t, language, setLanguage } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-2xl font-black text-[#0B1F3A] mb-8">{t('settings' as any) || 'Settings'}</h1>

      <div className="space-y-6">
        {/* Language Settings */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#FF9933] flex items-center justify-center flex-shrink-0">
              <Languages className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Language Preferences</h2>
              <p className="text-sm text-gray-500 mt-1">Choose your preferred language for the Nivaran platform interface.</p>
            </div>
          </div>
          <div className="flex gap-4 ml-16">
            <button 
              onClick={() => setLanguage('en')}
              className={`px-6 py-3 rounded-xl font-bold transition-all border-2 ${language === 'en' ? 'border-[#FF9933] bg-orange-50 text-[#FF9933]' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
            >
              English
            </button>
            <button 
              onClick={() => setLanguage('hi')}
              className={`px-6 py-3 rounded-xl font-bold transition-all border-2 ${language === 'hi' ? 'border-[#FF9933] bg-orange-50 text-[#FF9933]' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
            >
              हिंदी (Hindi)
            </button>
          </div>
        </div>

        {/* Notifications (Mock) */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8 opacity-70">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <Bell className="w-6 h-6" />
            </div>
            <div className="flex-grow">
              <h2 className="text-lg font-bold text-gray-900">Notifications <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full ml-2">Coming Soon</span></h2>
              <p className="text-sm text-gray-500 mt-1">Manage SMS and Email alerts for your complaints and schemes.</p>
            </div>
            <div className="w-12 h-6 bg-gray-200 rounded-full cursor-not-allowed"></div>
          </div>
        </div>

        {/* Security (Mock) */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8 opacity-70">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-green-50 text-[#138840] flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Security & Privacy <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full ml-2">Coming Soon</span></h2>
              <p className="text-sm text-gray-500 mt-1">Your account is secured by Google Authentication.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
