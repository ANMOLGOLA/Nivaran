import React from 'react';
import type { AppUser } from '../App';
import { Shield, Mail, Phone, Calendar } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const ProfilePage: React.FC<{ user: AppUser }> = ({ user }) => {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-2xl font-black text-[#0B1F3A] mb-8">{t('profile' as any) || 'My Profile'}</h1>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden relative">
        <div className="h-32 bg-gradient-to-r from-[#FF9933] via-orange-400 to-[#138840] opacity-90"></div>
        
        <div className="px-6 sm:px-10 pb-10 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-16 mb-8">
            <div className="relative">
              {user.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt={user.name} 
                  referrerPolicy="no-referrer"
                  className="w-32 h-32 rounded-full border-4 border-white shadow-xl bg-white object-cover" 
                />
              ) : (
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl bg-[#0B1F3A] flex items-center justify-center">
                  <span className="text-white font-black text-4xl">{user.name?.[0]?.toUpperCase()}</span>
                </div>
              )}
              <div className="absolute bottom-1 right-1 bg-green-500 w-6 h-6 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
                <Shield className="w-3 h-3 text-white" />
              </div>
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-3xl font-black text-gray-900">{user.name}</h2>
              <p className="text-gray-500 font-medium">{user.role === 'CITIZEN' ? 'Verified Citizen' : user.role}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
              <div className="flex items-center gap-3 text-gray-500 mb-1">
                <Mail className="w-4 h-4" />
                <span className="text-sm font-semibold uppercase tracking-wider">Email Address</span>
              </div>
              <p className="text-lg font-medium text-gray-900">{user.email || 'Not provided'}</p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
              <div className="flex items-center gap-3 text-gray-500 mb-1">
                <Phone className="w-4 h-4" />
                <span className="text-sm font-semibold uppercase tracking-wider">Phone Number</span>
              </div>
              <p className="text-lg font-medium text-gray-900">{user.phone || 'Not provided'}</p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 md:col-span-2">
              <div className="flex items-center gap-3 text-gray-500 mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-semibold uppercase tracking-wider">Account ID</span>
              </div>
              <p className="text-sm font-mono text-gray-900 bg-gray-200 p-2 rounded-lg inline-block mt-1">{user.id}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
