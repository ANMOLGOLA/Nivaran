import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Search, Globe, MapPin, CheckCircle, AlertTriangle, Download, Info, FileText, ArrowRight, X, Sparkles, Upload, FileCheck, Loader2 } from 'lucide-react';
import type { AppUser } from '../App';

interface Props { user: AppUser }

interface FAQ {
  question: string;
  answer: string;
}

interface Scheme {
  id: string;
  name: string;
  category: 'health' | 'agriculture' | 'housing' | 'finance' | 'education' | 'welfare';
  categoryLabel: string;
  scope: 'national' | 'state';
  state?: string;
  benefits: string;
  eligibility: string;
  requiredDocuments: string[];
  howToApply: string[];
  faq: FAQ[];
}

const SCHEMES: Scheme[] = [
  // National Schemes
  {
    id: 'ayushman-bharat',
    name: 'Ayushman Bharat PM-JAY (Pradhan Mantri Jan Arogya Yojana)',
    category: 'health',
    categoryLabel: 'Healthcare',
    scope: 'national',
    benefits: 'Free health insurance cover of up to Rs. 5 Lakh per family per year for secondary and tertiary care hospitalization across all empaneled public and private hospitals.',
    eligibility: 'Targeted at poor, deprived rural families and identified occupational categories of urban workers families. Families living in one-room houses with kucha walls, SC/ST households, and landless households are eligible.',
    requiredDocuments: ['Aadhaar Card', 'Ration Card', 'PM-JAY Letter / PM-JAY ID Card', 'Active Mobile Number'],
    howToApply: [
      'Identify your eligibility by checking the PM-JAY SECC list or using our Eligibility Checker.',
      'Visit the nearest empaneled public or private hospital or a Common Service Center (CSC).',
      'Present your Aadhaar Card and Ration Card to the Ayushman Mitra or representative.',
      'Complete biometric verification at the kiosk.',
      'Get your Ayushman Card printed for cashless treatments.'
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
    scope: 'national',
    benefits: 'Financial benefit of Rs. 6,000 per year in three equal installments of Rs. 2,000 each, directly transferred into the bank accounts of the farmers.',
    eligibility: 'All small and marginal landholding farmer families having cultivable landholding in their names are eligible, subject to exclusion criteria like paying income tax.',
    requiredDocuments: ['Aadhaar Card', 'Landholding documents (Khatauni/Patta)', 'Bank Account Details', 'Mobile Number linked with Aadhaar'],
    howToApply: [
      'Go to the official PM-KISAN Portal or use our instant online submission.',
      'Fill in your State, District, Sub-District, Block, and Village details.',
      'Enter your Aadhaar Number and name as per Aadhaar.',
      'Provide land registration details and upload a scanned copy of your land records (Khatauni).',
      'Submit the form and track status using the generated reference number.'
    ],
    faq: [
      { question: 'Who is eligible for PM-KISAN?', answer: 'All landholding farmer families who own cultivable land in their names are eligible, subject to exclusion criteria.' },
      { question: 'What is the cash benefit amount?', answer: 'The scheme provides Rs. 6,000 per year, paid in three installments of Rs. 2,000 every four months.' }
    ]
  },
  {
    id: 'pmay',
    name: 'PMAY (Pradhan Mantri Awas Yojana - Housing for All)',
    category: 'housing',
    categoryLabel: 'Housing',
    scope: 'national',
    benefits: 'Financial assistance of Rs. 1.2 Lakh in plains and Rs. 1.3 Lakh in hilly/difficult areas for constructing a permanent (pucca) house.',
    eligibility: 'Families who do not own a pucca house anywhere in India. Families belonging to Economically Weaker Section (EWS, income up to Rs. 3 Lakh) or Low Income Group (LIG, income up to Rs. 6 Lakh) are eligible.',
    requiredDocuments: ['Aadhaar Card', 'Income Certificate', 'Proof of Land Ownership or Land Lease Agreement', 'Affidavit stating that no family member owns a pucca house in India', 'Bank Passbook'],
    howToApply: [
      'Register on the PMAY Gramin/Urban official website or visit a local Gram Panchayat / Municipal office.',
      'Fill in personal details, Aadhaar number, and household income.',
      'Submit the land record documents or proof of lease.',
      'Submit an affidavit confirming you do not own a pucca house in India.',
      'A geo-tagging officer will visit the construction site for verification before funds are released in stages.'
    ],
    faq: [
      { question: 'What is the financial aid amount?', answer: 'For rural beneficiaries, PMAY-G provides direct financial aid of Rs. 1.2 Lakh (plains) or Rs. 1.3 Lakh (hilly areas) directly into bank accounts.' }
    ]
  },
  {
    id: 'pm-mudra',
    name: 'PM Mudra Yojana (Micro Units Development & Refinance Agency)',
    category: 'finance',
    categoryLabel: 'Finance & Loans',
    scope: 'national',
    benefits: 'Collateral-free business loans up to Rs. 10 Lakh for non-corporate, non-farm small/micro enterprises across Shishu, Kishor, and Tarun categories.',
    eligibility: 'Any Indian citizen who has a business plan for a non-farm income-generating activity, such as manufacturing, processing, trading, or service sector, and needs a loan up to Rs. 10 Lakh.',
    requiredDocuments: ['Aadhaar Card', 'Proof of Business Identity / Address', 'Project Report / Business Plan', 'Last 6 Months Bank Statement', 'Passport Size Photos'],
    howToApply: [
      'Choose the category: Shishu (up to Rs. 50,000), Kishor (up to Rs. 5 Lakh), or Tarun (up to Rs. 10 Lakh).',
      'Prepare a business plan or project report detailing your revenue projections.',
      'Approach a commercial bank, regional rural bank, or microfinance institution.',
      'Submit the Mudra Loan application form along with business registration certificates.',
      'Once approved, the bank issues a Mudra Card (Debit Card) for withdrawing the loan amount.'
    ],
    faq: [
      { question: 'Is collateral required for a Mudra Loan?', answer: 'No, Mudra loans are completely collateral-free.' },
      { question: 'What are the loan limits?', answer: 'Shishu: up to Rs. 50,000; Kishor: Rs. 50,001 to Rs. 5 Lakh; Tarun: Rs. 5,00,001 to Rs. 10 Lakh.' }
    ]
  },
  {
    id: 'sukanya-samriddhi',
    name: 'Sukanya Samriddhi Yojana (Girl Child Prosperity Scheme)',
    category: 'welfare',
    categoryLabel: 'Social Welfare',
    scope: 'national',
    benefits: 'High interest rate savings scheme (currently 8.2%) with triple tax exemptions (EEE) for the higher education and marriage of a girl child.',
    eligibility: 'Can be opened by a parent or legal guardian for a girl child below the age of 10 years. Only one account per girl child, with a maximum of two accounts per household.',
    requiredDocuments: ['Birth Certificate of the Girl Child', 'Aadhaar Card of the Parent/Guardian', 'PAN Card of the Parent/Guardian', 'Address Proof', 'Passport size photo of child and guardian'],
    howToApply: [
      'Visit any post office or authorized commercial bank branch.',
      'Obtain and fill the Sukanya Samriddhi account opening form.',
      'Attach the birth certificate of the girl child and identity/address proof of the guardian.',
      'Make the initial deposit amount (minimum Rs. 250, maximum Rs. 1.5 Lakh per financial year).',
      'Receive the physical passbook to track interest deposits.'
    ],
    faq: [
      { question: 'What is the maturity period?', answer: 'The account matures after 21 years from the date of opening or upon the marriage of the girl child after she turns 18.' }
    ]
  },

  // State-Specific Schemes
  {
    id: 'delhi-ladli',
    name: 'Delhi Ladli Scheme',
    category: 'welfare',
    categoryLabel: 'Social Welfare',
    scope: 'state',
    state: 'Delhi',
    benefits: 'Financial assistance up to Rs. 1 Lakh deposited in the name of the girl child at different stages of her education and life to prevent female foeticide and promote girls education.',
    eligibility: 'Girl child born in Delhi, family income must not exceed Rs. 1 Lakh per annum, and parents must have resided in Delhi for at least 3 years.',
    requiredDocuments: ['Birth Certificate of the girl child', 'Income Certificate of parents', 'Proof of residence in Delhi for last 3 years', 'Aadhaar Card of parents & child', 'Group photo of child with parents'],
    howToApply: [
      'Obtain application forms from the nearest government school or local Department of Women & Child Development (WCD) office.',
      'Submit the application within 1 year of the childs birth or at the time of school admission.',
      'Attach domicile certificate and income proofs.',
      'The WCD department deposits the fund with SB Life Insurance Company, which matures when the girl reaches 18 years of age.'
    ],
    faq: [
      { question: 'When does the fund mature?', answer: 'The accumulated money is released when the girl reaches 18 years of age and passes Class 10 or 12.' }
    ]
  },
  {
    id: 'maha-jyoti',
    name: 'MahaJyoti Free Coaching and Stipend Scheme',
    category: 'education',
    categoryLabel: 'Education',
    scope: 'state',
    state: 'Maharashtra',
    benefits: 'Free coaching for JEE, NEET, MPSC, and UPSC exams along with a monthly stipend of up to Rs. 10,000 for OBC, VJNT, and SBC students.',
    eligibility: 'Resident of Maharashtra belonging to OBC, VJNT, or SBC categories with a family income under Rs. 8 Lakh per annum (Non-Creamy Layer).',
    requiredDocuments: ['Caste Certificate', 'Non-Creamy Layer Certificate', 'Maharashtra Domicile Certificate', 'Aadhaar Card', 'Marksheets of previous academic years'],
    howToApply: [
      'Register on the official MahaJyoti online portal.',
      'Select the coaching course you want to enroll in (e.g. UPSC/MPSC/NEET).',
      'Fill details and upload scanned copies of caste, non-creamy layer, and marksheet.',
      'Appear for the online entrance/screening test conducted by MahaJyoti.',
      'Selected candidates are mapped to coaching institutes and stipends are credited monthly to bank accounts.'
    ],
    faq: [
      { question: 'What is the non-creamy layer limit?', answer: 'The family income must be under Rs. 8 Lakh per year to qualify as Non-Creamy Layer.' }
    ]
  },
  {
    id: 'pudhumai-penn',
    name: 'Pudhumai Penn Scheme (Moovalur Ramamirtham Ammaiyar)',
    category: 'education',
    categoryLabel: 'Education',
    scope: 'state',
    state: 'Tamil Nadu',
    benefits: 'Monthly financial assistance of Rs. 1,000 directly transferred to the bank accounts of girl students who studied in government schools from Classes 6 to 12.',
    eligibility: 'Girl students pursuing higher education (degrees, diplomas, ITI) in Tamil Nadu who completed their schooling (Classes 6-12) in government schools.',
    requiredDocuments: ['Aadhaar Card', 'School Transfer Certificate (TC) / Schooling Proof', 'College Admission Receipt / ID Card', 'Bank Account details (Single account)', 'Active Mobile Number'],
    howToApply: [
      'The college administration registers eligible students on the Pudhumai Penn portal.',
      'Students provide their Aadhaar, school certificates proving government school study, and bank details.',
      'The Social Welfare Department verifies school records electronically.',
      'Monthly stipends are credited directly via DBT to the bank account until course completion.'
    ],
    faq: [
      { question: 'Are private school students eligible?', answer: 'No, the scheme only covers girl students who studied in Government schools from Classes 6 to 12.' }
    ]
  },
  {
    id: 'gruha-lakshmi',
    name: 'Gruha Lakshmi Scheme',
    category: 'welfare',
    categoryLabel: 'Social Welfare',
    scope: 'state',
    state: 'Karnataka',
    benefits: 'Monthly financial assistance of Rs. 2,000 directly transferred to the bank accounts of the woman head of every eligible household in Karnataka.',
    eligibility: 'The woman must be registered as the head of the family in the ration card (BPL, APL, or Antyodaya cards). Neither she nor her husband must be income tax payers or GST registrants.',
    requiredDocuments: ['Ration Card (showing woman as head)', 'Aadhaar Card of the woman and husband', 'Bank Account Passbook linked with Aadhaar', 'Mobile number associated with Aadhaar'],
    howToApply: [
      'Apply online via the Seva Sindhu portal or in person at Karnataka One, Bangalore One, or Grama One centers.',
      'Submit the BPL/APL ration card showing the woman as the family head.',
      'Complete biometric or OTP validation.',
      'Specify bank account details for direct transfer.',
      'No fee is charged for registration.'
    ],
    faq: [
      { question: 'Can multiple women in a family apply?', answer: 'No, only one woman designated as the head of the family on the ration card can receive the benefit.' }
    ]
  },
  {
    id: 'ladli-behna',
    name: 'CM Ladli Behna Yojana',
    category: 'welfare',
    categoryLabel: 'Social Welfare',
    scope: 'state',
    state: 'Madhya Pradesh',
    benefits: 'Monthly financial support of Rs. 1,250 directly credited to the bank accounts of married women, widows, and destitute women.',
    eligibility: 'Married women aged 21 to 60 who are residents of Madhya Pradesh. Family income must not exceed Rs. 2.5 Lakh per annum and no member should be an income tax payer.',
    requiredDocuments: ['Samagra ID (Family & Personal)', 'Aadhaar Card', 'Bank Account linked with Aadhaar and enabled for DBT', 'Mobile Number linked with Samagra/Aadhaar'],
    howToApply: [
      'Special camps are organized at Ward/Gram Panchayat levels.',
      'Fill in the physical application form with Samagra ID and Aadhaar details.',
      'Submit the form to the camp officer who captures a live photo and does biometric validation.',
      'Status is updated via SMS, and verification is done on the portal.'
    ],
    faq: [
      { question: 'Is e-KYC mandatory?', answer: 'Yes, both Samagra e-KYC and bank Aadhaar-linkage with DBT enabled are mandatory.' }
    ]
  }
];

const STATES = ['Delhi', 'Maharashtra', 'Tamil Nadu', 'Karnataka', 'Madhya Pradesh'];

const CATEGORIES = [
  { id: 'all', label: 'All Sectors', icon: '🌐' },
  { id: 'health', label: 'Healthcare', icon: '❤️' },
  { id: 'agriculture', label: 'Agriculture', icon: '🌾' },
  { id: 'housing', label: 'Housing', icon: '🏠' },
  { id: 'finance', label: 'Finance', icon: '💰' },
  { id: 'education', label: 'Education', icon: '🎓' },
  { id: 'welfare', label: 'Social Welfare', icon: '🤝' },
];

export const YojanaPortal: React.FC<Props> = () => {
  const [search, setSearch] = useState('');
  const [activeScope, setActiveScope] = useState<'all' | 'national' | 'state'>('all');
  const [selectedState, setSelectedState] = useState<string>('All States');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Detail Drawer State
  const [detailScheme, setDetailScheme] = useState<Scheme | null>(null);

  // Application Wizard State
  const [applyScheme, setApplyScheme] = useState<Scheme | null>(null);
  const [applyStep, setApplyStep] = useState(0);
  const [applicationForm, setApplicationForm] = useState({
    fullName: '',
    phone: '',
    aadhaar: '',
    income: '',
    documentUploaded: false,
    declaration: false,
  });
  const [submittingApp, setSubmittingApp] = useState(false);
  const [submittedAppId, setSubmittedAppId] = useState<string | null>(null);

  // Filter schemes
  const filteredSchemes = SCHEMES.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                          s.benefits.toLowerCase().includes(search.toLowerCase()) ||
                          s.eligibility.toLowerCase().includes(search.toLowerCase());
    const matchesScope = activeScope === 'all' || s.scope === activeScope;
    const matchesState = selectedState === 'All States' || (s.scope === 'state' && s.state === selectedState);
    const matchesCategory = selectedCategory === 'all' || s.category === selectedCategory;
    return matchesSearch && matchesScope && matchesState && matchesCategory;
  });

  // Download checklist
  const downloadChecklist = (scheme: Scheme) => {
    const header = `SMART BHARAT — Scheme Document Checklist\n========================================\n\n`;
    const body = `Scheme Name: ${scheme.name}\nScope: ${scheme.scope === 'national' ? 'National' : scheme.state + ' State'}\nBenefits: ${scheme.benefits}\n\n[ ] Check when you have the document ready:\n\n` +
      scheme.requiredDocuments.map(d => `[ ] ${d}\n   (Required for verification)\n`).join('\n') +
      `\nGenerated for: Nivaran Citizen\nDate: ${new Date().toLocaleDateString('en-IN')}\n\nDisclaimer: Always carry original documents and 2 photocopies to the government department.`;

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

  // Mock Apply Handler
  const startApplication = (scheme: Scheme) => {
    setApplyScheme(scheme);
    setApplyStep(0);
    setApplicationForm({
      fullName: '',
      phone: '',
      aadhaar: '',
      income: '',
      documentUploaded: false,
      declaration: false,
    });
    setSubmittedAppId(null);
  };

  const handleApplyNext = () => {
    if (applyStep === 0) {
      if (!applicationForm.fullName.trim() || !applicationForm.phone.trim() || !applicationForm.aadhaar.trim()) {
        toast.error('Please fill in all personal details');
        return;
      }
      if (applicationForm.aadhaar.replace(/\s/g, '').length !== 12) {
        toast.error('Please enter a valid 12-digit Aadhaar number');
        return;
      }
      setApplyStep(1);
    } else if (applyStep === 1) {
      if (!applicationForm.documentUploaded) {
        toast.error('Please upload at least one required document');
        return;
      }
      setApplyStep(2);
    }
  };

  const submitApplication = () => {
    if (!applicationForm.declaration) {
      toast.error('Please accept the declaration');
      return;
    }
    setSubmittingApp(true);
    setTimeout(() => {
      setSubmittingApp(false);
      setSubmittedAppId(`REG-${Math.floor(100000 + Math.random() * 900000)}`);
      toast.success('Application submitted successfully!');
    }, 1500);
  };

  const downloadReceipt = () => {
    if (!applyScheme || !submittedAppId) return;
    const header = `SMART BHARAT — Scheme Application Receipt\n=========================================\n\n`;
    const body = `Registration ID: ${submittedAppId}\nScheme Name: ${applyScheme.name}\nApplicant Name: ${applicationForm.fullName}\nPhone Number: +91 ${applicationForm.phone}\nAadhaar Number: XXXXXXXX${applicationForm.aadhaar.slice(-4)}\nSubmission Date: ${new Date().toLocaleDateString('en-IN')}\nStatus: PENDING VERIFICATION\n\nNotes:\n- Your application has been successfully routed to the respective department.\n- Track your status on the Nivaran portal using your Registration ID.\n- A verification officer will contact you if additional details are required.`;

    const blob = new Blob([header + body], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${submittedAppId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Application receipt downloaded!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Hero Banner */}
      <div className="relative bg-[#0B1F3A] rounded-3xl p-6 md:p-8 text-white overflow-hidden shadow-xl border-b-4 border-[#FF9933]">
        <div className="absolute right-6 top-1/2 -translate-y-1/2 w-48 h-48 bg-[#FF9933] bg-opacity-10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#FF9933]">
            <Sparkles className="w-4 h-4" />
            <span>UPDATED YOJANA PORTAL</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black">All-in-One Welfare Schemes Portal</h2>
          <p className="text-gray-400 text-sm md:text-base">
            Search, filter, and verify eligibility for central government yojanas and state-specific programs. Download documents lists or submit your application online.
          </p>
        </div>
      </div>

      {/* Grid of Search, Filters and Dropdowns */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search yojanas by name, benefits, or eligibility keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border-2 border-gray-200 focus:border-[#FF9933] rounded-2xl pl-12 pr-4 py-3.5 text-sm outline-none transition"
          />
        </div>

        {/* Categories Tab Row */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-[#0B1F3A] text-white'
                  : 'bg-gray-50 text-gray-600 border border-gray-100 hover:bg-gray-100'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Scope and State Dropdown */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          {/* Scope Filters */}
          <div className="flex bg-gray-100 rounded-2xl p-1 sm:w-80">
            {(['all', 'national', 'state'] as const).map(scope => (
              <button
                key={scope}
                onClick={() => {
                  setActiveScope(scope);
                  if (scope === 'national') setSelectedState('All States');
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-xl capitalize transition-all ${
                  activeScope === scope
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {scope}
              </button>
            ))}
          </div>

          {/* State Select Dropdown */}
          {activeScope !== 'national' && (
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                if (e.target.value !== 'All States') setActiveScope('state');
              }}
              className="border-2 border-gray-200 focus:border-[#FF9933] rounded-2xl px-4 py-2.5 text-xs font-bold text-gray-700 bg-white outline-none"
            >
              <option>All States</option>
              {STATES.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Catalog Cards Grid */}
      {filteredSchemes.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-gray-100">
          <p className="text-gray-400 text-lg">No schemes match the chosen filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredSchemes.map(scheme => (
            <motion.div
              key={scheme.id}
              layout
              className="bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between overflow-hidden group hover:shadow-md transition-shadow"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider ${
                    scheme.category === 'health' ? 'bg-red-50 text-red-600' :
                    scheme.category === 'agriculture' ? 'bg-green-50 text-green-700' :
                    scheme.category === 'housing' ? 'bg-amber-50 text-amber-700' :
                    scheme.category === 'finance' ? 'bg-blue-50 text-blue-700' :
                    scheme.category === 'education' ? 'bg-purple-50 text-purple-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {scheme.categoryLabel}
                  </span>
                  
                  {scheme.scope === 'national' ? (
                    <span className="flex items-center gap-1 text-[9px] font-bold text-gray-400 uppercase">
                      <Globe className="w-3 h-3 text-blue-500" /> National
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[9px] font-bold text-gray-500 uppercase bg-[#FF9933] bg-opacity-10 px-2 py-0.5 rounded-md">
                      <MapPin className="w-3 h-3 text-[#FF9933]" /> {scheme.state}
                    </span>
                  )}
                </div>

                <h3 className="font-extrabold text-gray-900 leading-snug line-clamp-2 min-h-[2.5rem] group-hover:text-[#FF9933] transition-colors">
                  {scheme.name}
                </h3>
                
                <p className="text-gray-500 text-xs line-clamp-3 min-h-[3.2rem]">
                  {scheme.benefits}
                </p>
                
                <div className="border-t border-gray-100 pt-3 flex flex-col gap-2">
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Top Requirements</p>
                  <div className="flex flex-wrap gap-1">
                    {scheme.requiredDocuments.slice(0, 2).map(doc => (
                      <span key={doc} className="bg-gray-50 text-gray-500 text-[9px] px-2 py-0.5 rounded border border-gray-100 max-w-full truncate font-medium">
                        {doc}
                      </span>
                    ))}
                    {scheme.requiredDocuments.length > 2 && (
                      <span className="text-[9px] text-gray-400 self-center font-bold">
                        +{scheme.requiredDocuments.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center gap-2">
                <a
                  href={scheme.applyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-[#0B1F3A] hover:bg-[#1a3a6e] text-white font-bold py-2 rounded-xl text-xs transition flex items-center justify-center gap-1"
                >
                  Apply & Details <ArrowRight className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={() => downloadChecklist(scheme)}
                  title="Download Document Checklist"
                  className="bg-white border border-gray-200 hover:bg-gray-100 text-gray-600 p-2 rounded-xl transition"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Expanded Scheme Drawer/Modal */}
      <AnimatePresence>
        {detailScheme && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-end">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-white w-full max-w-2xl h-screen shadow-2xl p-6 md:p-8 flex flex-col justify-between overflow-y-auto"
            >
              {/* Drawer Header */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <span className="text-xs font-bold text-[#FF9933] uppercase">Scheme Guidelines</span>
                  <button onClick={() => setDetailScheme(null)} className="p-1 rounded-full hover:bg-gray-100 transition">
                    <X className="w-6 h-6 text-gray-500" />
                  </button>
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-gray-900 leading-tight">{detailScheme.name}</h3>
                  <div className="flex gap-2">
                    <span className="bg-[#0B1F3A] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-lg">
                      {detailScheme.categoryLabel}
                    </span>
                    <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2.5 py-0.5 rounded-lg capitalize">
                      {detailScheme.scope}
                    </span>
                    {detailScheme.state && (
                      <span className="bg-[#FF9933] bg-opacity-10 text-[#FF9933] text-[10px] font-bold px-2.5 py-0.5 rounded-lg">
                        {detailScheme.state} State
                      </span>
                    )}
                  </div>
                </div>

                {/* Details Sections */}
                <div className="space-y-6 pt-4 text-sm">
                  <div>
                    <h4 className="font-extrabold text-gray-800 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#FF9933]" /> Benefits Provided
                    </h4>
                    <p className="text-gray-600 mt-2 leading-relaxed">{detailScheme.benefits}</p>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-gray-800 flex items-center gap-1.5">
                      <Info className="w-4 h-4 text-blue-500" /> Eligibility Criteria
                    </h4>
                    <p className="text-gray-600 mt-2 leading-relaxed">{detailScheme.eligibility}</p>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-gray-800 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-[#138808]" /> Required Documents
                    </h4>
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-600">
                      {detailScheme.requiredDocuments.map(d => (
                        <li key={d}>{d}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-gray-800 flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-purple-500" /> How to Apply Steps
                    </h4>
                    <div className="mt-3 space-y-3">
                      {detailScheme.howToApply.map((step, idx) => (
                        <div key={idx} className="flex gap-3 items-start">
                          <div className="w-5 h-5 rounded-full bg-[#0B1F3A] text-white flex-shrink-0 flex items-center justify-center text-[10px] font-bold mt-0.5">
                            {idx + 1}
                          </div>
                          <p className="text-gray-600 text-xs leading-relaxed">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Apply Now Button at bottom of Drawer */}
              <div className="border-t border-gray-100 pt-6 mt-8 flex gap-3">
                <button
                  onClick={() => { setDetailScheme(null); startApplication(detailScheme); }}
                  className="flex-1 bg-gradient-to-r from-[#FF9933] to-orange-600 hover:opacity-90 text-white font-bold py-3.5 rounded-2xl text-sm transition text-center shadow-lg"
                >
                  Start Online Application
                </button>
                <button
                  onClick={() => downloadChecklist(detailScheme)}
                  className="border border-gray-200 hover:bg-gray-50 text-gray-600 font-bold px-4 rounded-2xl text-xs transition"
                >
                  Document Checklist
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Online Application Wizard Modal */}
      <AnimatePresence>
        {applyScheme && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-black text-gray-900">Scheme Application Portal</h3>
                  <p className="text-[10px] text-gray-500">{applyScheme.name}</p>
                </div>
                <button onClick={() => setApplyScheme(null)} className="p-1 rounded-full hover:bg-gray-100 transition">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Wizard Steps indicator */}
              {!submittedAppId && (
                <div className="flex items-center gap-1.5 mb-6">
                  {['Details', 'Documents', 'Declaration'].map((s, idx) => (
                    <React.Fragment key={s}>
                      <div className={`flex items-center gap-1 text-[10px] font-bold ${idx <= applyStep ? 'text-[#0B1F3A]' : 'text-gray-300'}`}>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] ${
                          idx < applyStep ? 'bg-green-600 text-white' : idx === applyStep ? 'bg-[#0B1F3A] text-white' : 'bg-gray-100 text-gray-400'
                        }`}>
                          {idx < applyStep ? '✓' : idx + 1}
                        </div>
                        <span>{s}</span>
                      </div>
                      {idx < 2 && <div className={`flex-grow h-0.5 ${idx < applyStep ? 'bg-green-600' : 'bg-gray-100'}`} />}
                    </React.Fragment>
                  ))}
                </div>
              )}

              {/* Wizard Forms */}
              {!submittedAppId ? (
                <div className="space-y-6">
                  {/* Step 0: Personal details */}
                  {applyStep === 0 && (
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block mb-1">Full Name (as in Aadhaar)</label>
                        <input
                          type="text"
                          placeholder="e.g. Rajesh Kumar"
                          value={applicationForm.fullName}
                          onChange={(e) => setApplicationForm(f => ({ ...f, fullName: e.target.value }))}
                          className="w-full border-2 border-gray-100 focus:border-[#FF9933] rounded-xl px-4 py-3 text-xs outline-none transition"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block mb-1">Mobile Number</label>
                        <input
                          type="text"
                          placeholder="e.g. 9876543210"
                          value={applicationForm.phone}
                          onChange={(e) => setApplicationForm(f => ({ ...f, phone: e.target.value }))}
                          className="w-full border-2 border-gray-100 focus:border-[#FF9933] rounded-xl px-4 py-3 text-xs outline-none transition"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block mb-1">12-Digit Aadhaar Number</label>
                        <input
                          type="text"
                          placeholder="e.g. 1234 5678 9012"
                          value={applicationForm.aadhaar}
                          onChange={(e) => setApplicationForm(f => ({ ...f, aadhaar: e.target.value }))}
                          className="w-full border-2 border-gray-100 focus:border-[#FF9933] rounded-xl px-4 py-3 text-xs outline-none transition"
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 1: Upload Documents */}
                  {applyStep === 1 && (
                    <div className="space-y-4">
                      <p className="text-xs text-gray-500">Provide copies of your identification and eligibility certificates to continue:</p>
                      
                      <div className="space-y-3">
                        {applyScheme.requiredDocuments.map(doc => (
                          <div key={doc} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                            <span className="text-xs font-bold text-gray-700 truncate max-w-[70%]">{doc}</span>
                            <button
                              onClick={() => setApplicationForm(f => ({ ...f, documentUploaded: true }))}
                              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 transition ${
                                applicationForm.documentUploaded 
                                  ? 'bg-green-600 text-white'
                                  : 'bg-[#0B1F3A] text-white hover:opacity-90'
                              }`}
                            >
                              <Upload className="w-3.5 h-3.5" />
                              {applicationForm.documentUploaded ? 'Uploaded' : 'Upload'}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 2: Declaration */}
                  {applyStep === 2 && (
                    <div className="space-y-4">
                      <div className="bg-amber-50 border-l-4 border-[#FF9933] p-4 rounded-r-2xl flex items-start gap-3">
                        <AlertTriangle className="w-4 h-4 text-[#FF9933] flex-shrink-0 mt-0.5" />
                        <p className="text-amber-800 text-xs leading-relaxed">
                          Applying for central or state yojanas using forged documents or details is a punishable offense under the Indian Penal Code.
                        </p>
                      </div>

                      <label className="flex items-start gap-2 cursor-pointer pt-2">
                        <input
                          type="checkbox"
                          checked={applicationForm.declaration}
                          onChange={(e) => setApplicationForm(f => ({ ...f, declaration: e.target.checked }))}
                          className="mt-1 flex-shrink-0 focus:ring-0 rounded border-gray-300 text-[#0B1F3A]"
                        />
                        <span className="text-xs text-gray-600 leading-relaxed font-medium">
                          I hereby declare that all details provided in this form are correct and match my official identification documents.
                        </span>
                      </label>
                    </div>
                  )}

                  {/* Action Nav Buttons */}
                  <div className="flex gap-3 pt-4 border-t border-gray-100">
                    {applyStep > 0 && (
                      <button
                        onClick={() => setApplyStep(s => s - 1)}
                        className="flex-1 border-2 border-gray-200 text-gray-600 font-bold py-3 rounded-xl text-xs hover:bg-gray-50 transition"
                      >
                        Back
                      </button>
                    )}
                    {applyStep < 2 ? (
                      <button
                        onClick={handleApplyNext}
                        className="flex-1 bg-[#0B1F3A] hover:bg-[#1a3a6e] text-white font-bold py-3 rounded-xl text-xs transition"
                      >
                        Continue
                      </button>
                    ) : (
                      <button
                        onClick={submitApplication}
                        disabled={submittingApp}
                        className="flex-1 bg-gradient-to-r from-[#138808] to-green-600 text-white font-bold py-3 rounded-xl text-xs transition flex items-center justify-center gap-1.5"
                      >
                        {submittingApp && <Loader2 className="w-4 h-4 animate-spin" />}
                        {submittingApp ? 'Submitting...' : 'Confirm Submission'}
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                /* Application Success State */
                <div className="text-center py-6 space-y-6">
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto">
                    <FileCheck className="w-10 h-10 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-gray-900">Application Submitted!</h4>
                    <p className="text-xs text-gray-500 mt-2">
                      Your application ID is <strong className="font-mono text-gray-800">{submittedAppId}</strong>
                    </p>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed max-w-sm mx-auto">
                    The registration request has been successfully queued. You can now download your digital registration receipt below.
                  </p>

                  <div className="flex flex-col gap-2 pt-4">
                    <button
                      onClick={downloadReceipt}
                      className="w-full bg-[#0B1F3A] hover:bg-[#1a3a6e] text-white font-bold py-3 rounded-xl text-xs transition flex items-center justify-center gap-1.5"
                    >
                      <Download className="w-4 h-4" /> Download Application Receipt
                    </button>
                    <button
                      onClick={() => setApplyScheme(null)}
                      className="w-full border-2 border-gray-200 text-gray-600 font-bold py-3 rounded-xl text-xs hover:bg-gray-50 transition"
                    >
                      Back to Yojana Portal
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
