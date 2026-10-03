"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  GraduationCap, 
  FileText, 
  Printer, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  Building2, 
  Upload, 
  CreditCard, 
  HelpCircle, 
  ChevronRight, 
  X,
  FileCheck2,
  Calendar,
  AlertTriangle
} from 'lucide-react';

export default function EnrollNowPage() {
  const [formData, setFormData] = useState({
    student_name: '',
    father_name: '',
    mother_name: '',
    dob: '',
    gender: 'Male',
    mobile_no: '',
    alt_mobile_no: '',
    email: '',
    aadhar_no: '',
    address: '',
    qualification: '12th Pass',
    course_name: 'Advance Diploma In Computer Software (ADCS)',
    study_center: 'MITM-BILARI (Main HQ)',
    photo_url: ''
  });

  const [loading, setLoading] = useState(false);
  const [statusNotice, setStatusNotice] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [printableReceipt, setPrintableReceipt] = useState<any | null>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 500000) {
      alert("⚠️ Photo file size should be less than 500KB!");
      return;
    }
    const reader = new FileReader();
    reader.onload = (evt) => {
      setFormData({ ...formData, photo_url: evt.target?.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusNotice(null);

    // Validation
    if (!formData.student_name.trim() || !formData.father_name.trim() || !formData.dob || !formData.aadhar_no || !formData.mobile_no || !formData.address) {
      setStatusNotice({ type: 'error', msg: 'Please fill in all required fields marked with an asterisk (*).' });
      return;
    }

    const cleanMobile = formData.mobile_no.replace(/\D/g, '');
    if (cleanMobile.length !== 10) {
      setStatusNotice({ type: 'error', msg: 'Mobile Number must be exactly 10 digits.' });
      return;
    }

    const cleanAadhar = formData.aadhar_no.replace(/\D/g, '');
    if (cleanAadhar.length !== 12) {
      setStatusNotice({ type: 'error', msg: 'Aadhar Number must be exactly 12 digits.' });
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const timeStamp = Date.now();
      const regId = `MITM-${timeStamp.toString().slice(-5)}`;
      
      const receiptData = {
        serial_no: regId,
        date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        ...formData
      };

      setPrintableReceipt(receiptData);
      setLoading(false);
      setStatusNotice({
        type: 'success',
        msg: `🎉 Application Form Generated Successfully! Registration Serial: ${regId}`
      });

      // Auto trigger print dialog after small delay
      setTimeout(() => {
        window.print();
      }, 600);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2D221C] font-sans pb-16">
      
      {/* HERO BANNER SECTION */}
      <div className="relative bg-[#2D221C] text-[#FAF7F2] py-12 sm:py-16 px-4 border-b-4 border-[#C29B72]">
        <div className="max-w-6xl mx-auto text-center space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#C29B72]/20 text-[#D8B38A] border border-[#C29B72]/40 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#D8B38A]" />
            Enroll Now
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Online Student Enrollment Portal
          </h1>
          <p className="text-[#E2D8CD] text-xs sm:text-sm max-w-2xl mx-auto">
            Fill out the online application form below, download/print your registration slip, and visit Bilari Head Campus with your documents for final admission confirmation.
          </p>
        </div>
      </div>

      {/* MAIN CONTAINER (2-COLUMN GRID) */}
      <div className="max-w-7xl mx-auto px-4 mt-8 space-y-8">
        
        {statusNotice && (
          <div className={`p-4 rounded-2xl text-xs sm:text-sm font-bold shadow-sm flex items-center gap-3 ${
            statusNotice.type === 'success' 
              ? 'bg-[#F2F8F4] text-[#1E5128] border border-[#C8E6C9]' 
              : 'bg-[#FDF2F2] text-[#9B1C1C] border border-[#F8B4B4]'
          }`}>
            {statusNotice.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-[#2E7D32] shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-[#C62828] shrink-0" />
            )}
            <span>{statusNotice.msg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT: ENROLLMENT FORM (7 COLS) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-[#EAE2D8]">
            <div className="flex items-center justify-between border-b border-[#EAE2D8] pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#FAF5EF] text-[#C29B72] border border-[#EAE2D8] rounded-2xl">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-[#2D221C]">Student Application Form</h2>
                  <p className="text-xs text-[#7A6B62]">Fields marked with asterisk (*) are mandatory</p>
                </div>
              </div>
              <span className="text-[11px] font-bold bg-[#C29B72]/15 text-[#3D2E26] px-3 py-1 rounded-full border border-[#C29B72]/30">
                Enrollment Form
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* SECTION 1: PERSONAL DETAILS */}
              <div className="space-y-4">
                <h3 className="text-xs font-extrabold text-[#3D2E26] uppercase tracking-wider border-b border-[#EAE2D8] pb-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-[#C29B72]" /> 1. Personal Candidate Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#3D2E26] uppercase tracking-wider mb-1">
                      Full Candidate Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.student_name}
                      onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
                      placeholder="e.g. Rahul Kumar"
                      className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E2D8CD] rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#C29B72] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3D2E26] uppercase tracking-wider mb-1">
                      Father's Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.father_name}
                      onChange={(e) => setFormData({ ...formData, father_name: e.target.value })}
                      placeholder="e.g. Suresh Kumar"
                      className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E2D8CD] rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#C29B72] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#3D2E26] uppercase tracking-wider mb-1">
                      Mother's Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.mother_name}
                      onChange={(e) => setFormData({ ...formData, mother_name: e.target.value })}
                      placeholder="e.g. Sunita Devi"
                      className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E2D8CD] rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#C29B72] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3D2E26] uppercase tracking-wider mb-1">
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.dob}
                      onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E2D8CD] rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#C29B72] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#3D2E26] uppercase tracking-wider mb-1">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E2D8CD] rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#C29B72] outline-none font-medium"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3D2E26] uppercase tracking-wider mb-1">
                      Aadhar Number (12 Digits) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={12}
                      value={formData.aadhar_no}
                      onChange={(e) => setFormData({ ...formData, aadhar_no: e.target.value })}
                      placeholder="12-digit Aadhar Card No"
                      className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E2D8CD] rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#C29B72] outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: CONTACT DETAILS */}
              <div className="space-y-4 pt-2">
                <h3 className="text-xs font-extrabold text-[#3D2E26] uppercase tracking-wider border-b border-[#EAE2D8] pb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#C29B72]" /> 2. Communication & Address Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#3D2E26] uppercase tracking-wider mb-1">
                      Primary Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={formData.mobile_no}
                      onChange={(e) => setFormData({ ...formData, mobile_no: e.target.value })}
                      placeholder="10-digit Mobile No"
                      className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E2D8CD] rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#C29B72] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3D2E26] uppercase tracking-wider mb-1">
                      Alternate Mobile / WhatsApp
                    </label>
                    <input
                      type="tel"
                      maxLength={10}
                      value={formData.alt_mobile_no}
                      onChange={(e) => setFormData({ ...formData, alt_mobile_no: e.target.value })}
                      placeholder="Optional contact no"
                      className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E2D8CD] rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#C29B72] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3D2E26] uppercase tracking-wider mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="student@example.com"
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E2D8CD] rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#C29B72] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3D2E26] uppercase tracking-wider mb-1">
                    Full Residential Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="House No, Village/Street, Post Office, Tehsil, City, District & Pincode"
                    className="w-full p-3 bg-[#FAF7F2] border border-[#E2D8CD] rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#C29B72] outline-none"
                  ></textarea>
                </div>
              </div>

              {/* SECTION 3: ACADEMIC PROGRAM */}
              <div className="space-y-4 pt-2">
                <h3 className="text-xs font-extrabold text-[#3D2E26] uppercase tracking-wider border-b border-[#EAE2D8] pb-2 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-[#C29B72]" /> 3. Course Selection & Qualification
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#3D2E26] uppercase tracking-wider mb-1">
                      Highest Qualification <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.qualification}
                      onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E2D8CD] rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#C29B72] outline-none font-medium"
                    >
                      <option value="10th Pass">10th Pass</option>
                      <option value="12th Pass">12th Pass</option>
                      <option value="Graduate">Graduate / Post Graduate</option>
                      <option value="Diploma Holder">Diploma Holder</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3D2E26] uppercase tracking-wider mb-1">
                      Selected Course Program <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.course_name}
                      onChange={(e) => setFormData({ ...formData, course_name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E2D8CD] rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#C29B72] outline-none font-bold text-[#2D221C]"
                    >
                      <option value="Advance Diploma In Computer Software (ADCS)">Advance Diploma In Computer Software (ADCS)</option>
                      <option value="Computerised Professional Accounting Course (CPAC)">Computerised Professional Accounting Course (CPAC)</option>
                      <option value="Advance Diploma In Computer Application (ADCA)">Advance Diploma In Computer Application (ADCA)</option>
                      <option value="Desktop Publishing (DTP)">Desktop Publishing (DTP)</option>
                      <option value="Data Entry Operator (DEO)">Data Entry Operator (DEO)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 4: PHOTO UPLOAD */}
              <div className="space-y-4 pt-2">
                <h3 className="text-xs font-extrabold text-[#3D2E26] uppercase tracking-wider border-b border-[#EAE2D8] pb-2 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-[#C29B72]" /> 4. Passport Photo Upload
                </h3>

                <div className="flex items-center gap-5 p-4 bg-[#FAF7F2] rounded-2xl border border-[#E2D8CD]">
                  <div className="w-20 h-24 bg-white border-2 border-dashed border-[#C29B72] rounded-xl flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                    {formData.photo_url ? (
                      <img src={formData.photo_url} alt="Candidate Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[10px] text-[#A89A90] font-bold text-center">Photo Preview</span>
                    )}
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <label className="block text-xs font-bold text-[#3D2E26]">Select Photo File (Max 500KB)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="block w-full text-xs text-[#7A6B62] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#C29B72] file:text-[#2D221C] hover:file:bg-[#B08A63] cursor-pointer"
                    />
                    <p className="text-[11px] text-[#7A6B62]">
                      Upload candidate passport photo for printable admission form & official ID Card.
                    </p>
                  </div>
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <div className="pt-4 border-t border-[#EAE2D8]">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-[#2D221C] hover:bg-[#3D2E26] text-[#FAF7F2] font-black rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <span>Generating Form...</span>
                  ) : (
                    <>
                      <Printer className="w-5 h-5 text-[#D8B38A]" />
                      Submit & Print Application Form
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>

          {/* RIGHT SIDEBAR: INSTRUCTIONS & REQUIRED DOCUMENTS (5 COLS) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* ADMISSION STEPS & MANDATORY CONDITION BOX */}
            <div className="bg-[#2D221C] text-[#FAF7F2] rounded-3xl p-6 shadow-xl border border-[#3D2E26] space-y-5">
              <div className="flex items-center gap-2.5 border-b border-[#3D2E26] pb-3">
                <AlertTriangle className="w-5 h-5 text-[#D8B38A]" />
                <h3 className="text-base font-extrabold text-white uppercase tracking-wider">
                  Important Admission Process
                </h3>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-[#E2D8CD]">
                <div className="flex items-start gap-3 bg-[#3D2E26]/60 p-3 rounded-2xl border border-white/5">
                  <span className="w-6 h-6 rounded-full bg-[#C29B72] text-[#2D221C] font-black flex items-center justify-center shrink-0 text-xs">1</span>
                  <div>
                    <strong className="text-white block">Fill & Print Online Form</strong>
                    Complete this form and click "Submit & Print" to download your Application Sheet.
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-[#3D2E26]/60 p-3 rounded-2xl border border-white/5">
                  <span className="w-6 h-6 rounded-full bg-[#C29B72] text-[#2D221C] font-black flex items-center justify-center shrink-0 text-xs">2</span>
                  <div>
                    <strong className="text-white block">Visit MITM Bilari Campus</strong>
                    Bring the printed Application Form to the admission office at Bilari Head Campus.
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-[#3D2E26]/60 p-3 rounded-2xl border border-white/5">
                  <span className="w-6 h-6 rounded-full bg-[#C29B72] text-[#2D221C] font-black flex items-center justify-center shrink-0 text-xs">3</span>
                  <div>
                    <strong className="text-white block">Submit Fees & Documents</strong>
                    Submit course admission fee along with required document photocopies.
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-[#3D2E26]/60 p-3 rounded-2xl border border-white/5">
                  <span className="w-6 h-6 rounded-full bg-[#C29B72] text-[#2D221C] font-black flex items-center justify-center shrink-0 text-xs">4</span>
                  <div>
                    <strong className="text-white block">Final Confirmation</strong>
                    Your official admission seat will be confirmed and Student Roll No assigned.
                  </div>
                </div>
              </div>
            </div>

            {/* MANDATORY DOCUMENTS PHOTOCOPY CHECKLIST */}
            <div className="bg-white rounded-3xl p-6 shadow-md border border-[#EAE2D8] space-y-4">
              <div className="flex items-center gap-2.5 border-b border-[#EAE2D8] pb-3">
                <FileCheck2 className="w-5 h-5 text-[#C29B72]" />
                <h4 className="text-sm font-extrabold text-[#2D221C] uppercase tracking-wider">
                  Required Documents Photocopies
                </h4>
              </div>

              <p className="text-xs text-[#7A6B62]">
                Please attach self-attested photocopies of the following documents along with your printed application form:
              </p>

              <div className="space-y-2.5 text-xs font-medium text-[#3D2E26]">
                <div className="flex items-center gap-3 p-2.5 bg-[#FAF7F2] rounded-xl border border-[#E2D8CD]">
                  <CheckCircle2 className="w-4 h-4 text-[#25D366] shrink-0" />
                  <span>Aadhar Card Photocopy (आधार कार्ड)</span>
                </div>

                <div className="flex items-center gap-3 p-2.5 bg-[#FAF7F2] rounded-xl border border-[#E2D8CD]">
                  <CheckCircle2 className="w-4 h-4 text-[#25D366] shrink-0" />
                  <span>10th Marksheet Photocopy (10वीं मार्कशीट)</span>
                </div>

                <div className="flex items-center gap-3 p-2.5 bg-[#FAF7F2] rounded-xl border border-[#E2D8CD]">
                  <CheckCircle2 className="w-4 h-4 text-[#25D366] shrink-0" />
                  <span>12th Marksheet Photocopy (12वीं मार्कशीट)</span>
                </div>

                <div className="flex items-center gap-3 p-2.5 bg-[#FAF7F2] rounded-xl border border-[#E2D8CD]">
                  <CheckCircle2 className="w-4 h-4 text-[#25D366] shrink-0" />
                  <span>2 Recent Passport Size Photographs</span>
                </div>
              </div>
            </div>

            {/* CAMPUS VISITING HELPDESK */}
            <div className="bg-white rounded-3xl p-6 shadow-md border border-[#EAE2D8] space-y-3">
              <h4 className="text-xs font-extrabold text-[#2D221C] uppercase tracking-wider flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#C29B72]" />
                MITM Office bilari
              </h4>

              <div className="text-xs text-[#7A6B62] space-y-2">
                <p className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#C29B72] shrink-0 mt-0.5" />
                  <span>Sahu Kunj, Station Road, Near Gandhi Park, Bilari, Moradabad (U.P.) - 244411</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#C29B72] shrink-0" />
                  <span>+91 9897513656 / +91 8923130448</span>
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#C29B72] shrink-0" />
                  <span>Monday - Saturday: 8:00 AM - 5:00 PM</span>
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* PRINTABLE APPLICATION FORM MODAL / RECEIPT VIEW */}
      {printableReceipt && (
        <div className="fixed inset-0 bg-[#2D221C]/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-[#EAE2D8] my-auto">
            
            {/* RECEIPT HEADER */}
            <div className="bg-[#2D221C] text-[#FAF7F2] p-5 sm:p-6 border-b-4 border-[#C29B72] flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#D8B38A] tracking-widest bg-[#C29B72]/20 px-2.5 py-0.5 rounded-full border border-[#C29B72]/30">
                  Provisional Admission Form
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white mt-1">
                  MANAVTA INSTITUTE OF TECHNOLOGY & MANAGEMENT(MITM)
                </h3>
                <p className="text-xs text-[#E2D8CD]">Bilari, District Moradabad (U.P.)</p>
              </div>

              <button
                onClick={() => setPrintableReceipt(null)}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* RECEIPT CONTENT */}
            <div className="p-6 space-y-6 text-xs text-[#2D221C]">
              
              {/* APPLICATION SERIAL BAR */}
              <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E2D8CD] flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-[#7A6B62] block text-[11px]">Application Serial Number:</span>
                  <strong className="text-base font-black text-[#2D221C] font-mono">{printableReceipt.serial_no}</strong>
                </div>
                <div className="text-right">
                  <span className="text-[#7A6B62] block text-[11px]">Registration Date:</span>
                  <span className="font-bold text-[#3D2E26]">{printableReceipt.date}</span>
                </div>
              </div>

              {/* STUDENT DATA SUMMARY */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 rounded-2xl border border-[#EAE2D8]">
                <div>
                  <span className="text-[#7A6B62] block text-[11px]">Candidate Full Name:</span>
                  <strong className="text-sm font-bold text-[#2D221C] uppercase">{printableReceipt.student_name}</strong>
                </div>

                <div>
                  <span className="text-[#7A6B62] block text-[11px]">Father's Name:</span>
                  <strong className="text-sm font-bold text-[#2D221C] uppercase">{printableReceipt.father_name}</strong>
                </div>

                <div>
                  <span className="text-[#7A6B62] block text-[11px]">Mother's Name:</span>
                  <strong className="text-sm font-bold text-[#2D221C] uppercase">{printableReceipt.mother_name}</strong>
                </div>

                <div>
                  <span className="text-[#7A6B62] block text-[11px]">Date of Birth / Gender:</span>
                  <strong className="text-sm font-bold text-[#2D221C]">{printableReceipt.dob} ({printableReceipt.gender})</strong>
                </div>

                <div>
                  <span className="text-[#7A6B62] block text-[11px]">Aadhar Number:</span>
                  <strong className="text-sm font-bold text-[#2D221C] font-mono">{printableReceipt.aadhar_no}</strong>
                </div>

                <div>
                  <span className="text-[#7A6B62] block text-[11px]">Mobile Number:</span>
                  <strong className="text-sm font-bold text-[#2D221C]">{printableReceipt.mobile_no}</strong>
                </div>

                <div className="sm:col-span-2 border-t border-[#EAE2D8] pt-2 mt-1">
                  <span className="text-[#7A6B62] block text-[11px]">Selected Program:</span>
                  <strong className="text-sm font-black text-[#C29B72]">{printableReceipt.course_name}</strong>
                </div>

                <div className="sm:col-span-2">
                  <span className="text-[#7A6B62] block text-[11px]">Assigned Campus:</span>
                  <strong className="text-xs font-bold text-[#2D221C]">{printableReceipt.study_center}</strong>
                </div>
              </div>

              {/* MANDATORY CAMPUS VISIT & DOCUMENT SUBMISSION NOTICE */}
              <div className="bg-[#FAF5EF] p-4 rounded-2xl border-2 border-[#C29B72] space-y-2">
                <div className="flex items-center gap-2 text-[#3D2E26] font-extrabold uppercase text-xs">
                  <AlertTriangle className="w-4 h-4 text-[#C29B72]" />
                  Final Admission Confirmation Instructions
                </div>
                <p className="text-xs text-[#5C4D43] leading-relaxed">
                  Please take a <strong>printout of this application form</strong> and visit the <strong>MITM Bilari Head Campus</strong>. Submit your course fees along with self-attested photocopies of your <strong>Aadhar Card, 10th Marksheet, and 12th Marksheet</strong> to finalize your admission.
                </p>
              </div>

              {/* BUTTONS */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setPrintableReceipt(null)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl text-xs transition cursor-pointer"
                >
                  Close
                </button>

                <button
                  onClick={() => window.print()}
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#2D221C] hover:bg-[#3D2E26] text-[#FAF7F2] font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-[#D8B38A]" />
                  Print / Download PDF Application Form
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
