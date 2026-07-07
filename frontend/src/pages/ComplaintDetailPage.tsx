import React from 'react';
import { useParams } from 'react-router-dom';
import type { AppUser } from '../App';

interface Props { user: AppUser }

export const ComplaintDetailPage: React.FC<Props> = ({ user: _user }) => {
  const { id } = useParams<{ id: string }>();
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <a href="/my-complaints" className="text-sm text-gray-500 hover:text-gray-800 font-semibold">← Back to My Complaints</a>
      <div className="mt-6 bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center">
        <div className="text-4xl mb-4">🔍</div>
        <h2 className="text-xl font-black text-gray-900">Complaint #{id}</h2>
        <p className="text-gray-500 mt-2 text-sm">Full detail view — route to <strong>MyComplaintsPage</strong> timeline for full tracking.</p>
      </div>
    </div>
  );
};
