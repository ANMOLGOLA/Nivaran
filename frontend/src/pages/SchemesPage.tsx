import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Search, CheckCircle, AlertOctagon, Download } from 'lucide-react';
import type { AppUser } from '../App';

interface Props { user: AppUser }

interface FAQ {
  question: string;
  answer: string;
}

interface Scheme {
  id: string;
  name: string;
  category: 'health' | 'agriculture' | 'housing';
  categoryLabel: string;
  benefits: string;
  eligibility: string;
  requiredDocuments: string[];
  faq: FAQ[];
}

const SCHEMES: Scheme[] = [
  {
    id: 'ayushman-bharat',
    name: 'Ayushman Bharat PM-JAY (Pradhan Mantri Jan Arogya Yojana)',
    category: 'health',
    categoryLabel: 'Healthcare',
    benefits: 'Free health insurance cover of up to Rs. 5 Lakh per family per year for secondary and tertiary care hospitalization across all empaneled public and private hospitals.',
    eligibility: 'Targeted at poor, deprived rural families and identified occupational categories of urban workers families. Families living in one-room houses with kucha walls, landless households, SC/ST households, and manual scavenger families are eligible. No family size limit.',
    requiredDocuments: [
      'Aadhaar Card',
      'Ration Card',
      'PM-JAY Letter / PM-JAY ID Card',
      'Active Mobile Number'
    ],
    faq: [
      { question: 'What is the insurance cover limit?', answer: 'Ayushman Bharat provides a health insurance cover of up to Rs. 5 Lakh per family per year.' },
      { question: 'Are pre-existing conditions covered?', answer: 'Yes, all pre-existing medical conditions are covered from day one of enrollment in the scheme.' }
    ]
  },
  {
    id: 'pm-kisan',
    name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    category: 'agriculture',
    categoryLabel: 'Agriculture',
    benefits: 'Financial benefit of Rs. 6,000 per year in three equal installments of Rs. 2,000 each, directly transferred into the bank accounts of the farmers.',
    eligibility: 'All landholding farmers families having cultivable landholding in their names are eligible. Exclusion criteria include institutional landholders, serving/retired government officers, and individuals who paid income tax in the last assessment year.',
    requiredDocuments: [
      'Aadhaar Card',
      'Landholding documents (Khatauni/Patta)',
      'Bank Account Details',
      'Mobile Number linked with Aadhaar'
    ],
    faq: [
      { question: 'Who is eligible for PM-KISAN?', answer: 'All small and marginal landholding farmer families who own cultivable land in their names are eligible, subject to exclusion criteria like paying income tax.' },
      { question: 'What is the cash benefit amount?', answer: 'The scheme provides a benefit of Rs. 6,000 per year, paid in three installments of Rs. 2,000 every four months.' }
    ]
  },
  {
    id: 'pmay',
    name: 'PMAY (Pradhan Mantri Awas Yojana - Housing for All)',
    category: 'housing',
    categoryLabel: 'Housing',
    benefits: 'Financial assistance of Rs. 1.2 Lakh in plains and Rs. 1.3 Lakh in hilly/difficult areas for constructing a permanent (pucca) house. It also offers interest subsidies on home loans.',
    eligibility: 'Families who do not own a pucca house anywhere in India. Families belonging to Economically Weaker Section (EWS, income up to Rs. 3 Lakh), Low Income Group (LIG, income up to Rs. 6 Lakh), and Middle Income Groups are eligible.',
    requiredDocuments: [
      'Aadhaar Card',
      'Income Certificate',
      'Proof of Land Ownership or Land Lease Agreement',
      'Affidavit stating that no family member owns a pucca house in India',
      'Bank Passbook'
    ],
    faq: [
      { question: 'What is the financial aid amount?', answer: 'For rural beneficiaries, PMAY-G provides direct financial aid of Rs. 1.2 Lakh (plains) or Rs. 1.3 Lakh (hilly areas) directly into bank accounts.' },
      { question: 'Can I apply if I own a kutcha house?', answer: 'Yes, if you own a kutcha house or a temporary shelter, you are eligible to apply for assistance to build a permanent pucca house.' }
    ]
  }
];

export const SchemesPage: React.FC<Props> = () => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'health' | 'agriculture' | 'housing'>('all');
  
  // Checker Modal State
  const [activeScheme, setActiveScheme] = useState<Scheme | null>(null);
  const [checkerAnswers, setCheckerAnswers] = useState<Record<string, any>>({});
  const [checkerResult, setCheckerResult] = useState<{ eligible: boolean; explanation: string } | null>(null);
  
  // Search & Filter filter
  const filteredSchemes = SCHEMES.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                          s.benefits.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || s.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const startEligibilityCheck = (scheme: Scheme) => {
    setActiveScheme(scheme);
    setCheckerAnswers({});
    setCheckerResult(null);
  };

  const handleCheckerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeScheme) return;

    let eligible = true;
    let explanation = '';

    if (activeScheme.id === 'ayushman-bharat') {
      const isDeprived = checkerAnswers.deprived === 'yes';
      const paysTax = checkerAnswers.taxpayer === 'yes';
      
      if (paysTax) {
        eligible = false;
        explanation = 'You are not eligible because members of families paying income tax are excluded from PM-JAY.';
      } else if (!isDeprived) {
        eligible = false;
        explanation = 'PM-JAY is targeted at rural households classified as deprived under SECC 2011 (e.g. kucha walls, landless, SC/ST, manual scavengers).';
      } else {
        explanation = 'Based on your inputs, your household meets the primary deprivation criteria of PM-JAY!';
      }
    } else if (activeScheme.id === 'pm-kisan') {
      const ownsLand = checkerAnswers.land === 'yes';
      const paysTax = checkerAnswers.taxpayer === 'yes';
      const isGovt = checkerAnswers.govt === 'yes';

      if (!ownsLand) {
        eligible = false;
        explanation = 'Only families with cultivable landholdings registered in their names are eligible.';
      } else if (paysTax || isGovt) {
        eligible = false;
        explanation = 'Exclusion criteria apply: Institutional landholders, government employees, and income tax payers are not eligible.';
      } else {
        explanation = 'Based on your inputs, you are eligible for the financial assistance under PM-KISAN!';
      }
    } else if (activeScheme.id === 'pmay') {
      const ownsPucca = checkerAnswers.pucca === 'yes';
      const annualIncome = Number(checkerAnswers.income) || 0;

      if (ownsPucca) {
        eligible = false;
        explanation = 'The scheme is restricted to families who do not own a pucca (permanent) house anywhere in India.';
      } else if (annualIncome > 1800000) {
        eligible = false;
        explanation = 'Your family income exceeds the limit for the Middle Income Group II (maximum Rs. 18 Lakh).';
      } else {
        explanation = 'You are eligible! You fall within the qualifying income brackets for housing assistance.';
      }
    }

    setCheckerResult({ eligible, explanation });
  };

  const downloadChecklist = (scheme: Scheme) => {
    const header = `SMART BHARAT — Scheme Document Checklist\n========================================\n\n`;
    const body = `Scheme Name: ${scheme.name}\nBenefits: ${scheme.benefits}\n\n[ ] Check when you have the document ready:\n\n` +
      scheme.requiredDocuments.map(d => `[ ] ${d}\n   (Required for verification at your local service center)\n`).join('\n') +
      `\nGenerated for: Smart Bharat Citizen\nDate: ${new Date().toLocaleDateString('en-IN')}\n\nDisclaimer: Always carry originals and 2 photocopies to the department.`;

    const blob = new Blob([header + body], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${scheme.id}-checklist.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Document checklist downloaded successfully!');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Government Schemes Directory</h2>
          <p className="text-gray-500 text-sm mt-1">Explore, search, and check eligibility for public welfare programs</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-grow relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search schemes by name or keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border-2 border-gray-200 focus:border-[#FF9933] rounded-2xl pl-12 pr-4 py-3.5 text-sm outline-none transition"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {(['all', 'health', 'agriculture', 'housing'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold capitalize whitespace-nowrap transition ${
                categoryFilter === cat
                  ? 'bg-[#0B1F3A] text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {cat === 'all' ? 'All categories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Catalog Grid */}
      {filteredSchemes.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-gray-100">
          <p className="text-gray-400 text-lg">No schemes match your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredSchemes.map(scheme => (
            <motion.div
              key={scheme.id}
              layout
              className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col justify-between"
            >
              <div className="p-6 space-y-4">
                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  scheme.category === 'health' ? 'bg-red-50 text-red-600' :
                  scheme.category === 'agriculture' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'
                }`}>
                  {scheme.categoryLabel}
                </span>
                <h3 className="font-bold text-gray-900 leading-snug">{scheme.name}</h3>
                <p className="text-gray-500 text-xs line-clamp-3">{scheme.benefits}</p>
                <div className="border-t border-gray-100 pt-3">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Required Documents</p>
                  <div className="flex flex-wrap gap-1.5">
                    {scheme.requiredDocuments.slice(0, 3).map(doc => (
                      <span key={doc} className="bg-gray-50 text-gray-600 text-[10px] px-2.5 py-1 rounded-lg border border-gray-100 font-medium">
                        {doc}
                      </span>
                    ))}
                    {scheme.requiredDocuments.length > 3 && (
                      <span className="text-[10px] text-gray-400 self-center font-bold">
                        +{scheme.requiredDocuments.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-2">
                <button
                  onClick={() => startEligibilityCheck(scheme)}
                  className="flex-1 bg-[#0B1F3A] hover:bg-[#1a3a6e] text-white font-bold py-2.5 px-4 rounded-xl text-xs transition"
                >
                  Check Eligibility
                </button>
                <button
                  onClick={() => downloadChecklist(scheme)}
                  title="Download Document Checklist"
                  className="bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 p-2.5 rounded-xl transition"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Checker Dialog */}
      <AnimatePresence>
        {activeScheme && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-xl font-black text-gray-900 mb-2">Eligibility Checker</h3>
              <p className="text-xs text-gray-500 mb-6">{activeScheme.name}</p>

              {!checkerResult ? (
                <form onSubmit={handleCheckerSubmit} className="space-y-6">
                  {/* Scheme Questions */}
                  {activeScheme.id === 'ayushman-bharat' && (
                    <>
                      <div>
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">
                          Is your family listed in the SECC 2011 database or matches deprivation criteria (SC/ST, landless, or kucha walls)?
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => setCheckerAnswers(a => ({ ...a, deprived: 'yes' }))}
                            className={`py-3 px-4 rounded-xl font-bold text-sm border-2 transition ${
                              checkerAnswers.deprived === 'yes' ? 'border-[#FF9933] bg-amber-50 text-[#FF9933]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            Yes
                          </button>
                          <button
                            type="button"
                            onClick={() => setCheckerAnswers(a => ({ ...a, deprived: 'no' }))}
                            className={`py-3 px-4 rounded-xl font-bold text-sm border-2 transition ${
                              checkerAnswers.deprived === 'no' ? 'border-[#FF9933] bg-amber-50 text-[#FF9933]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            No / Unsure
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">
                          Does any member of your family pay Income Tax?
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => setCheckerAnswers(a => ({ ...a, taxpayer: 'yes' }))}
                            className={`py-3 px-4 rounded-xl font-bold text-sm border-2 transition ${
                              checkerAnswers.taxpayer === 'yes' ? 'border-[#FF9933] bg-amber-50 text-[#FF9933]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            Yes
                          </button>
                          <button
                            type="button"
                            onClick={() => setCheckerAnswers(a => ({ ...a, taxpayer: 'no' }))}
                            className={`py-3 px-4 rounded-xl font-bold text-sm border-2 transition ${
                              checkerAnswers.taxpayer === 'no' ? 'border-[#FF9933] bg-amber-50 text-[#FF9933]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            No
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                  {activeScheme.id === 'pm-kisan' && (
                    <>
                      <div>
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">
                          Do you own cultivable land in your name?
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => setCheckerAnswers(a => ({ ...a, land: 'yes' }))}
                            className={`py-3 px-4 rounded-xl font-bold text-sm border-2 transition ${
                              checkerAnswers.land === 'yes' ? 'border-[#FF9933] bg-amber-50 text-[#FF9933]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            Yes
                          </button>
                          <button
                            type="button"
                            onClick={() => setCheckerAnswers(a => ({ ...a, land: 'no' }))}
                            className={`py-3 px-4 rounded-xl font-bold text-sm border-2 transition ${
                              checkerAnswers.land === 'no' ? 'border-[#FF9933] bg-amber-50 text-[#FF9933]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            No
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">
                          Are you a taxpayer, serving/retired government employee, or professional (doctor, lawyer)?
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => setCheckerAnswers(a => ({ ...a, taxpayer: 'yes' }))}
                            className={`py-3 px-4 rounded-xl font-bold text-sm border-2 transition ${
                              checkerAnswers.taxpayer === 'yes' ? 'border-[#FF9933] bg-amber-50 text-[#FF9933]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            Yes
                          </button>
                          <button
                            type="button"
                            onClick={() => setCheckerAnswers(a => ({ ...a, taxpayer: 'no' }))}
                            className={`py-3 px-4 rounded-xl font-bold text-sm border-2 transition ${
                              checkerAnswers.taxpayer === 'no' ? 'border-[#FF9933] bg-amber-50 text-[#FF9933]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            No
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                  {activeScheme.id === 'pmay' && (
                    <>
                      <div>
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">
                          Do you or anyone in your household own a pucca (permanent) house in India?
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => setCheckerAnswers(a => ({ ...a, pucca: 'yes' }))}
                            className={`py-3 px-4 rounded-xl font-bold text-sm border-2 transition ${
                              checkerAnswers.pucca === 'yes' ? 'border-[#FF9933] bg-amber-50 text-[#FF9933]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            Yes
                          </button>
                          <button
                            type="button"
                            onClick={() => setCheckerAnswers(a => ({ ...a, pucca: 'no' }))}
                            className={`py-3 px-4 rounded-xl font-bold text-sm border-2 transition ${
                              checkerAnswers.pucca === 'no' ? 'border-[#FF9933] bg-amber-50 text-[#FF9933]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            No
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">
                          Enter your annual family income (in Rs)
                        </label>
                        <input
                          type="number"
                          placeholder="e.g. 250000"
                          value={checkerAnswers.income || ''}
                          onChange={(e) => setCheckerAnswers(a => ({ ...a, income: e.target.value }))}
                          className="w-full border-2 border-gray-200 focus:border-[#FF9933] rounded-xl px-4 py-3 text-sm outline-none transition"
                        />
                      </div>
                    </>
                  )}

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveScheme(null)}
                      className="flex-1 border-2 border-gray-200 font-bold text-sm py-3 rounded-xl text-gray-600 hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-[#0B1F3A] hover:bg-[#1a3a6e] text-white font-bold text-sm py-3 rounded-xl transition"
                    >
                      Evaluate
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6 text-center">
                  <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center">
                    {checkerResult.eligible ? (
                      <CheckCircle className="w-16 h-16 text-green-600 bg-green-50 rounded-full" />
                    ) : (
                      <AlertOctagon className="w-16 h-16 text-red-600 bg-red-50 rounded-full" />
                    )}
                  </div>
                  <div>
                    <h4 className={`text-xl font-black ${checkerResult.eligible ? 'text-green-800' : 'text-red-800'}`}>
                      {checkerResult.eligible ? 'You appear to be Eligible! 🟢' : 'Not Eligible 🔴'}
                    </h4>
                    <p className="text-sm text-gray-600 mt-2">{checkerResult.explanation}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {checkerResult.eligible && (
                      <button
                        onClick={() => { downloadChecklist(activeScheme); setActiveScheme(null); }}
                        className="w-full bg-[#138808] hover:bg-green-700 text-white font-bold py-3 rounded-xl text-sm transition"
                      >
                        Download Document Checklist
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setCheckerResult(null)}
                      className="w-full border-2 border-gray-200 text-gray-600 font-bold py-3 rounded-xl text-sm transition"
                    >
                      Try Again
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveScheme(null)}
                      className="w-full text-xs text-gray-400 font-semibold hover:text-gray-600 mt-2"
                    >
                      Close Window
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
