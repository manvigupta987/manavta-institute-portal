"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  GraduationCap, 
  MessageSquare, 
  User, 
  Sparkles,
  HelpCircle,
  ChevronDown,
  ExternalLink,
  ShieldCheck,
  Award,
  Users,
  Radio,
  Share2
} from 'lucide-react';

export default function ContactUsPage() {
  const [formState, setFormState] = useState({
    full_name: '',
    mobile_no: '',
    email: '',
    course_interest: 'Advance Diploma In Computer Software (ADCS)',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.full_name.trim() || !formState.mobile_no.trim() || !formState.message.trim()) {
      setStatus({ type: 'error', msg: 'Please fill in all required fields (Full Name, Mobile Number, and Message).' });
      return;
    }

    if (formState.mobile_no.replace(/\D/g, '').length !== 10) {
      setStatus({ type: 'error', msg: 'Mobile number must be exactly 10 digits.' });
      return;
    }

    setLoading(true);
    setStatus(null);

    setTimeout(() => {
      setLoading(false);
      setStatus({ 
        type: 'success', 
        msg: `Thank you, ${formState.full_name}! Your inquiry has been successfully submitted. Our admission counselor will contact you shortly.` 
      });
      setFormState({
        full_name: '',
        mobile_no: '',
        email: '',
        course_interest: 'Advance Diploma In Computer Software (ADCS)',
        subject: '',
        message: ''
      });
    }, 1000);
  };

  const campusInfo = {
    name: 'MANAVTA INSTITUTE OF TECHNOLOGY & MANAGEMENT (Main HQ)',
    code: 'MITM-BILARI',
    badge: 'Main Administrative Head Office',
    address: '205-A, Manavta Institute, Sahu Kunj, Station Road, Near Gandhi Park, Bilari, Moradabad, Uttar Pradesh - 244411',
    phone: '+91 9897513656 / +91 8923130448',
    whatsapp: '919897513656',
    channelUrl: 'https://whatsapp.com/channel/manavtainstitute',
    email: 'manavtaeducation@yahoo.com',
    hours: 'Monday - Saturday: 8:00 AM - 5:00 PM (Sunday Closed)',
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.2897940866014!2d78.7964418!3d28.6210755!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ae7cc4911a78f%3A0xf9d288abf1f041d4!2sMANAVTA%20INSTITUTE%20OF%20TECHNOLOGY%20AND%20MANAGEMENT!5e0!3m2!1sen!2sin!4v1790834163272!5m2!1sen!2sin'
  };

  const faqs = [
    {
      q: 'How can I submit an online admission and enrollment form?',
      a: 'You can navigate directly to our "Enroll Now" page via the top navigation or footer link. Upon submitting your form, a provisional Registration Serial Number will be generated, and your details will be recorded instantly.'
    },
    {
      q: 'How do I verify my Admission online?',
      a: 'Visit the "Student Verification" link in the navigation menu, enter your registered Student Name and Date of Birth. The system will match your record in our live database and display your official academic document.'
    },
    {
      q: 'Is Manavta Institute of Education government recognized?',
      a: 'Yes, Manavta Institute of Education (MITM) is an ISO 9001:2015 Certified institution operating under recognized educational standards to provide professional computer, accounting, and vocational education.'
    },
    {
      q: 'What are the visiting hours for career counseling at the Bilari campus?',
      a: 'Our main campus is open Monday through Saturday from 8:00 AM to 5:00 PM. Prospective students and parents are welcome to visit for free career counseling and campus tours.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2D221C] font-sans">
      
      {/* HERO BANNER SECTION */}
      <div className="relative bg-[#2D221C] text-[#FAF7F2] py-16 sm:py-20 px-4 overflow-hidden border-b-4 border-[#C29B72]">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D8B38A_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="max-w-6xl mx-auto relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#C29B72]/20 text-[#D8B38A] border border-[#C29B72]/40 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide uppercase">
            <Sparkles className="w-4 h-4 text-[#D8B38A]" />
            Manavta Institute of Technology & Management (MITM)
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Get In Touch <span className="text-[#D8B38A] font-extrabold">(Contact Us)</span>
          </h1>
          <p className="text-[#E2D8CD] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Have questions about course admissions, online verification, or franchise partnerships? Our dedicated administrative team is here to assist you.
          </p>

          <div className="pt-6 flex flex-wrap justify-center gap-4 text-xs sm:text-sm font-medium">
            <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur px-3.5 py-1.5 rounded-lg border border-white/10 text-[#FAF7F2]">
              <ShieldCheck className="w-4 h-4 text-[#D8B38A]" /> ISO 9001:2015 Certified
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur px-3.5 py-1.5 rounded-lg border border-white/10 text-[#FAF7F2]">
              <Award className="w-4 h-4 text-[#D8B38A]" /> Recognized Programs
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur px-3.5 py-1.5 rounded-lg border border-white/10 text-[#FAF7F2]">
              <Users className="w-4 h-4 text-[#D8B38A]" /> 10,000+ Certified Students
            </span>
          </div>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">

        {/* SECTION 1: INQUIRY FORM & CAMPUS INFO GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: INQUIRY FORM (7 COLS) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-[#EAE2D8] relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-[#FAF5EF] text-[#2D221C] border border-[#EAE2D8] rounded-2xl">
                <MessageSquare className="w-6 h-6 text-[#C29B72]" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-[#2D221C]">Send Us a Direct Message</h2>

              </div>
            </div>

            {status && (
              <div className={`mb-6 p-4 rounded-2xl border text-sm font-medium flex items-start gap-3 ${
                status.type === 'success' 
                  ? 'bg-[#F2F8F4] text-[#1E5128] border-[#C8E6C9]' 
                  : 'bg-[#FDF2F2] text-[#9B1C1C] border-[#F8B4B4]'
              }`}>
                {status.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-[#2E7D32] shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-[#C62828] shrink-0 mt-0.5" />
                )}
                <p className="leading-snug">{status.msg}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#3D2E26] uppercase tracking-wider mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#A89A90] absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      value={formState.full_name}
                      onChange={(e) => setFormState({ ...formState, full_name: e.target.value })}
                      placeholder="e.g. Rahul Kumar"
                      className="w-full pl-10 pr-3 py-2.5 bg-[#FAF7F2] border border-[#E2D8CD] rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#C29B72] focus:border-[#C29B72] transition outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3D2E26] uppercase tracking-wider mb-1">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#A89A90] absolute left-3.5 top-3.5" />
                    <input
                      type="tel"
                      value={formState.mobile_no}
                      onChange={(e) => setFormState({ ...formState, mobile_no: e.target.value })}
                      placeholder="10-digit Mobile No"
                      maxLength={10}
                      className="w-full pl-10 pr-3 py-2.5 bg-[#FAF7F2] border border-[#E2D8CD] rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#C29B72] focus:border-[#C29B72] transition outline-none"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#3D2E26] uppercase tracking-wider mb-1">
                    Email Address (Optional)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#A89A90] absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      placeholder="rahul@example.com"
                      className="w-full pl-10 pr-3 py-2.5 bg-[#FAF7F2] border border-[#E2D8CD] rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#C29B72] focus:border-[#C29B72] transition outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3D2E26] uppercase tracking-wider mb-1">
                    Course Interest
                  </label>
                  <div className="relative">
                    <GraduationCap className="w-4 h-4 text-[#A89A90] absolute left-3.5 top-3.5" />
                    <select
                      value={formState.course_interest}
                      onChange={(e) => setFormState({ ...formState, course_interest: e.target.value })}
                      className="w-full pl-10 pr-3 py-2.5 bg-[#FAF7F2] border border-[#E2D8CD] rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#C29B72] focus:border-[#C29B72] transition outline-none"
                    >
                      <option value="Advance Diploma In Computer Software (ADCS)">Advance Diploma In Computer Software (ADCS)</option>
                      <option value="Computerised Professional Accounting Course (CPAC)">Computerised Professional Accounting Course (CPAC)</option>
                      <option value="Advance Diploma In Computer Application (ADCA)">Advance Diploma In Computer Application (ADCA)</option>
                      <option value="Desktop Publishing (DTP)">O Level (NIELIT)</option>
                      <option value="Data Entry Operator (DEO)">Data Entry Operator (DEO)</option>
                      <option value="General Query / Franchise Inquiry">General Query / Franchise Inquiry</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3D2E26] uppercase tracking-wider mb-1">
                  Your Message / Query <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  placeholder="Type your inquiry details or question here..."
                  className="w-full p-3 bg-[#FAF7F2] border border-[#E2D8CD] rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#C29B72] focus:border-[#C29B72] transition outline-none"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#3D2E26] hover:bg-[#2D221C] text-[#FAF7F2] font-bold rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
              >
                {loading ? (
                  <span>Submitting Inquiry...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-[#D8B38A]" />
                    Submit Inquiry Now
                  </>
                )}
              </button>
            </form>
          </div>

          {/* RIGHT: BILARI HEAD CAMPUS CARD & WHATSAPP CHANNEL (5 COLS) */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* BILARI HEAD CAMPUS CARD */}
            <div className="bg-[#2D221C] text-[#FAF7F2] rounded-3xl p-6 sm:p-7 shadow-xl border border-[#3D2E26] space-y-5 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-[#3D2E26] pb-4">
                <span className="bg-[#C29B72]/20 text-[#D8B38A] text-xs font-bold px-3 py-1 rounded-full border border-[#C29B72]/30">
                  {campusInfo.badge}
                </span>
                <span className="text-xs text-[#A89A90] font-mono">{campusInfo.code}</span>
              </div>

              <h3 className="text-2xl font-black text-white">{campusInfo.name}</h3>

              <div className="space-y-3.5 text-xs sm:text-sm text-[#E2D8CD]">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#D8B38A] shrink-0 mt-0.5" />
                  <span>{campusInfo.address}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#D8B38A] shrink-0" />
                  <span>{campusInfo.phone}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#D8B38A] shrink-0" />
                  <span>{campusInfo.email}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-[#D8B38A] shrink-0" />
                  <span>{campusInfo.hours}</span>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <a
                  href={`https://wa.me/${campusInfo.whatsapp}?text=Hello%20MITM,%20I%20have%20an%20admission%20inquiry.`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2.5 bg-[#25D366] hover:bg-[#1EBE57] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition shadow-sm"
                >
                  WhatsApp Chat
                </a>
                <a
                  href={`tel:${campusInfo.phone.split('/')[0].trim()}`}
                  className="flex-1 py-2.5 bg-[#C29B72] hover:bg-[#B08A63] text-[#2D221C] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition shadow-sm"
                >
                  Direct Call
                </a>
              </div>
            </div>

            {/* OFFICIAL WHATSAPP CHANNEL CARD */}
            <div className="bg-white rounded-3xl p-6 shadow-md border border-[#EAE2D8] space-y-3.5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#25D366]/10 text-[#25D366] rounded-2xl shrink-0">
                  <Radio className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-[#2D221C]">Manavta Institute WhatsApp Channel</h4>
                  <p className="text-xs text-[#7A6B62]">Stay updated with official exam dates, results, and notifications.</p>
                </div>
              </div>

              <a
                href={campusInfo.channelUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 bg-[#25D366] hover:bg-[#1EBE57] text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 transition shadow-sm"
              >
                <Share2 className="w-3.5 h-3.5" />
                Join Manavta Institute Channel
              </a>
            </div>

            {/* EMBEDDED LOCATION MAP */}
            <div className="bg-white rounded-3xl p-5 shadow-md border border-[#EAE2D8] space-y-3">
              <h4 className="text-xs font-extrabold text-[#3D2E26] uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#C29B72]" />
                Live Location (MITM-BILARI)
              </h4>
              <div className="rounded-2xl overflow-hidden border border-[#E2D8CD] h-44 bg-[#FAF7F2]">
                <iframe
                  title="MITM-BILARI Map"
                  src={campusInfo.mapEmbed}
                  className="w-full h-full border-0"
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>        
      </div>

        {/* SECTION 3: FAQ ACCORDION */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-md border border-[#EAE2D8] max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-[#FAF5EF] text-[#3D2E26] border border-[#E2D8CD] text-xs font-extrabold px-3 py-1 rounded-full uppercase">
              <HelpCircle className="w-3.5 h-3.5 text-[#C29B72]" /> Frequently Asked Questions
            </div>
            <h3 className="text-2xl font-extrabold text-[#2D221C]">Common Questions & Answers</h3>
          </div>

          <div className="space-y-3 pt-2">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className="border border-[#EAE2D8] rounded-2xl overflow-hidden transition"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-4 text-left font-bold text-sm sm:text-base text-[#2D221C] bg-[#FAF7F2] hover:bg-[#F4ECE1] flex items-center justify-between gap-4 cursor-pointer transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-[#A89A90] transition-transform ${activeFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {activeFaq === idx && (
                  <div className="p-4 bg-white text-xs sm:text-sm text-[#5C4D43] border-t border-[#EAE2D8] leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 4: CALL TO ACTION BANNER (USING NEXT.JS LINK TAG) */}
        <div className="bg-[#2D221C] text-[#FAF7F2] rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 border-b-4 border-[#C29B72]">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-black text-white">Admissions Open... Just Enroll Now!</h3>
            <p className="text-[#E2D8CD] text-xs sm:text-sm">Reserve your seat online and complete your enrollment process today.</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/enroll-now"
              className="px-6 py-3 bg-[#C29B72] hover:bg-[#B08A63] text-[#2D221C] font-black rounded-xl text-sm shadow-md transition flex items-center gap-2"
            >
              Enroll Now Portal <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
