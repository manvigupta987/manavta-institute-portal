"use client";

import React from 'react';
import Link from 'next/link';

export default function TermsOfServicePage() {
  const lastUpdated = "September 30, 2026";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-10 space-y-8">
        
        {/* Header */}
        <div className="border-b border-slate-200 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold rounded-full mb-3 uppercase tracking-wider">
            ⚖️ Legal Terms & Conditions
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Terms of Service
          </h1>
          <p className="text-xs text-slate-500 mt-2 font-medium">
            Manavta Institute of Education (MITM) • Last Updated: {lastUpdated}
          </p>
        </div>

        {/* Terms Body */}
        <div className="space-y-6 text-xs sm:text-sm leading-relaxed text-slate-700">
          
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-l-4 border-amber-600 pl-3">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing, browsing, submitting admission forms, or utilizing student verification services on the Manavta Institute of Education (MITM) website, you agree to be bound by these Terms of Service and all applicable national laws. If you do not agree with any part of these terms, you must refrain from using our online portals.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-l-4 border-amber-600 pl-3">
              2. Authentic Information Requirement
            </h2>
            <p>
              Candidates registering for courses or submitting online enrollment forms are strictly required to provide true, accurate, and complete information regarding their personal identity, Aadhar number, and educational history. Providing falsified documents or fraudulent details will lead to immediate cancellation of admission without refund and potential legal proceedings.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-l-4 border-amber-600 pl-3">
              3. Verification & Credential Authenticity
            </h2>
            <p>
              Our online verification tools (by Candidate Name, DOB, or Enrollment Number) are provided solely for confirming genuine certifications issued by authorized MITM campuses. Forging, tampering with, or creating counterfeit marksheet copies or ID cards using MITM branding is illegal and strictly actionable under applicable IT laws.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-l-4 border-amber-600 pl-3">
              4. Prohibited Conduct & Security Rules
            </h2>
            <p>Users and students agree NOT to:</p>
            <ul className="list-disc pl-5 space-y-1.5 marker:text-amber-600">
              <li>Attempt unauthorized access to administrative dashboards, branch portals, or database servers.</li>
              <li>Use automated scrapers, bots, or malicious scripts to disrupt system operations.</li>
              <li>Submit multiple duplicate or fake student registrations.</li>
              <li>Misuse institutional logos, QR code authentication markers, or official signatures.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-l-4 border-amber-600 pl-3">
              5. Intellectual Property
            </h2>
            <p>
              All website graphics, course curricula, design layouts, certificate designs, logos, and software code are the exclusive property of Manavta Institute of Education. Unauthorized distribution or copying for commercial gain is prohibited.
            </p>
          </section>

          <section className="space-y-2">
            <h2  className="text-base font-bold text-slate-900 flex items-center gap-2 border-l-4 border-amber-600 pl-3">
              6. Institutional Discretion & Governance
            </h2>
            <p>
              MITM management reserves the right to modify course structures, examination schedules, fee schedules, or website services when necessary for administrative improvement. All final decisions regarding student discipline, grading standards, and certification eligibility rest with the Institute Governing Board.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-l-4 border-amber-600 pl-3">
              7. Governing Law & Jurisdiction
            </h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising out of or related to institute operations or website usage shall be subject to the exclusive jurisdiction of the courts in Moradabad / Sambhal, Uttar Pradesh, India.
            </p>
          </section>

        </div>

        {/* Footer Link Back */}
        <div className="pt-6 border-t border-slate-200 flex justify-between items-center text-xs">
          <Link href="/" className="text-sky-600 font-bold hover:underline">
            ← Back to Home
          </Link>
          <span className="text-slate-400">Manavta Institute of Education</span>
        </div>

      </div>
    </div>
  );
}
