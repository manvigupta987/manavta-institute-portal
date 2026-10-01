"use client";

// Save as: components/CertificateTab.tsx
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { printCertificate, formatDate, buildQrUrl } from '@/lib/print-templates';

export interface CertificateRecord {
  id: string;
  roll_no: string;
  enrollment_no: string;
  student_name: string;
  father_name: string;
  course_name: string;
  start_date: string;
  end_date: string;
  grade: string;
  issue_date: string;
  session: string;
  serial_no: string;
  photo_url?: string; // loaded on demand (heavy) - not part of the list query
  study_center: string;
  des?: string;
  dob?: string;
}

interface CertificateTabProps {
  studentsList?: any[];
}

const PLACEHOLDER_PHOTO = 'https://iili.io/3jruEzl.md.jpg';

// Everything EXCEPT photo_url -> list loads very fast
const LIST_COLS =
  'id,roll_no,enrollment_no,student_name,father_name,course_name,start_date,end_date,grade,issue_date,session,serial_no,study_center,des,dob,created_at';

const DEFAULT_AWARD_MATTER =
  'This is to certify that the candidate named below has successfully completed the prescribed course of study and passed the final assessment with credit.';

const mapRow = (r: any): CertificateRecord => ({
  id: r.id,
  roll_no: r.roll_no,
  enrollment_no: r.enrollment_no || '',
  student_name: r.student_name,
  father_name: r.father_name || '',
  course_name: r.course_name,
  start_date: r.start_date || '',
  end_date: r.end_date || '',
  grade: r.grade || '',
  issue_date: r.issue_date || '',
  session: r.session || '',
  serial_no: r.serial_no || '',
  photo_url: r.photo_url || undefined,
  study_center: r.study_center || '',
  des: r.des || 'S/O',
  dob: r.dob || '',
});

export default function CertificateTabComponent({ studentsList = [] }: CertificateTabProps) {
  const [awardMatter, setAwardMatter] = useState(DEFAULT_AWARD_MATTER);

  const [certificatesList, setCertificatesList] = useState<CertificateRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Generate form
  const [rollInput, setRollInput] = useState('');
  const [autoStudent, setAutoStudent] = useState<any>(null);
  const [desVal, setDesVal] = useState('S/O');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [gradeVal, setGradeVal] = useState('A');
  const [issueDateVal, setIssueDateVal] = useState(new Date().toISOString().split('T')[0]);

  // Search / sort / select
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'roll' | 'date'>('name');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingCert, setEditingCert] = useState<CertificateRecord | null>(null);
  const [viewingCert, setViewingCert] = useState<CertificateRecord | null>(null);

  // ---------------------------------------------------------------------
  // LOAD from Supabase
  // ---------------------------------------------------------------------
  const fetchCertificates = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('certificates')
      .select(LIST_COLS)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Fetch certificates error:', error);
      alert('❌ Failed to load certificates: ' + error.message);
    } else {
      setCertificatesList((data || []).map(mapRow));
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchPhoto = async (id: string): Promise<string> => {
    const { data } = await supabase.from('certificates').select('photo_url').eq('id', id).single();
    return data?.photo_url || '';
  };

  const withPhoto = async (c: CertificateRecord): Promise<CertificateRecord> => {
    if (c.photo_url) return c;
    const photo = await fetchPhoto(c.id);
    return { ...c, photo_url: photo || PLACEHOLDER_PHOTO };
  };

  // ---------------------------------------------------------------------
  // Auto-fetch student by Roll No
  // ---------------------------------------------------------------------
  const handleRollSearch = (rollVal: string) => {
    setRollInput(rollVal);
    const found = studentsList.find((s) => (s.roll_no || '') === rollVal.trim());
    setAutoStudent(found || null);
  };

  // ---------------------------------------------------------------------
  // GENERATE -> save in DB
  // ---------------------------------------------------------------------
  const handleGenerateCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!autoStudent) {
      alert('No approved student found with this Roll No. Please enter a valid Roll Number.');
      return;
    }

    setIsSaving(true);

    const payload = {
      roll_no: autoStudent.roll_no,
      enrollment_no: autoStudent.enrollment_no,
      student_name: autoStudent.student_name,
      father_name: autoStudent.father_name,
      course_name: autoStudent.course_name,
      start_date: startDate,
      end_date: endDate,
      grade: gradeVal.trim().toUpperCase(),
      issue_date: issueDateVal,
      session: autoStudent.session || '',
      serial_no: autoStudent.serial_no || `DN-${Math.floor(1000 + Math.random() * 9000)}`,
      photo_url: autoStudent.photo_url || PLACEHOLDER_PHOTO,
      study_center: autoStudent.study_center || 'MITM BILARI',
      des: desVal,
      dob: autoStudent.dob || '',
    };

    const { data, error } = await supabase.from('certificates').insert([payload]).select(LIST_COLS).single();

    setIsSaving(false);

    if (error) {
      console.error('Insert certificate error:', error);
      alert('❌ Failed to save certificate: ' + error.message);
      return;
    }

    setCertificatesList([mapRow(data), ...certificatesList]);
    setRollInput('');
    setAutoStudent(null);
    alert('🎉 Certificate Generated & Saved Successfully!');
  };

  // ---------------------------------------------------------------------
  // UPDATE (edit modal)
  // ---------------------------------------------------------------------
  const handleSaveEdit = async () => {
    if (!editingCert) return;

    const { data, error } = await supabase
      .from('certificates')
      .update({
        student_name: editingCert.student_name,
        father_name: editingCert.father_name,
        course_name: editingCert.course_name,
        enrollment_no: editingCert.enrollment_no,
        roll_no: editingCert.roll_no,
        start_date: editingCert.start_date,
        end_date: editingCert.end_date,
        grade: editingCert.grade,
        issue_date: editingCert.issue_date,
        session: editingCert.session,
        serial_no: editingCert.serial_no,
        study_center: editingCert.study_center,
        des: editingCert.des,
        dob: editingCert.dob,
      })
      .eq('id', editingCert.id)
      .select(LIST_COLS)
      .single();

    if (error) {
      console.error('Update certificate error:', error);
      alert('❌ Failed to update certificate: ' + error.message);
      return;
    }

    setCertificatesList(certificatesList.map((c) => (c.id === editingCert.id ? mapRow(data) : c)));
    setEditingCert(null);
    alert('✅ Certificate record updated!');
  };

  // ---------------------------------------------------------------------
  // Print / View / Delete
  // ---------------------------------------------------------------------
  const handlePrint = async (c: CertificateRecord) => {
    const win = window.open('', '_blank'); // open right away (keeps popup permission)
    const full = await withPhoto(c);
    printCertificate(full, awardMatter, {}, win);
  };

  const handleView = async (c: CertificateRecord) => {
    setViewingCert(await withPhoto(c));
  };

  const handleDeleteOne = async (id: string) => {
    if (!confirm('Delete this certificate record?')) return;
    const { error } = await supabase.from('certificates').delete().eq('id', id);
    if (error) {
      alert('❌ Failed to delete: ' + error.message);
      return;
    }
    setCertificatesList(certificatesList.filter((rec) => rec.id !== id));
    setSelectedIds(selectedIds.filter((i) => i !== id));
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} certificates?`)) return;
    const { error } = await supabase.from('certificates').delete().in('id', selectedIds);
    if (error) {
      alert('❌ Failed to delete: ' + error.message);
      return;
    }
    setCertificatesList(certificatesList.filter((c) => !selectedIds.includes(c.id)));
    setSelectedIds([]);
    alert('Deleted selected certificates!');
  };

  const filteredCertificates = certificatesList
    .filter(
      (c) =>
        !searchQuery ||
        c.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.roll_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.enrollment_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.course_name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'name') return a.student_name.localeCompare(b.student_name);
      if (sortBy === 'roll') return a.roll_no.localeCompare(b.roll_no);
      return a.issue_date.localeCompare(b.issue_date);
    });

  return (
    <div className="space-y-8">
      {/* AWARD MATTER */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-slate-200 space-y-4">
        <div className="border-b pb-3">
          <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
            <span>📜</span> Pre-Configured Certificate Award Matter
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Default verification statement text printed on official certificates.
          </p>
        </div>

        <textarea
          value={awardMatter}
          onChange={(e) => setAwardMatter(e.target.value)}
          rows={3}
          className="w-full p-3 border border-slate-300 rounded-xl text-xs font-serif leading-relaxed focus:ring-2 focus:ring-amber-500 bg-amber-50/50 text-black"
        />
      </div>

      {/* GENERATE FORM */}
      <form onSubmit={handleGenerateCertificate} className="bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-slate-200 space-y-6">
        <div className="border-b pb-4">
          <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
            <span>🎓</span> Generate Student Certificate (Auto-Fetch by Roll No)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Enter candidate Roll No to auto-fill details from database.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Enter Roll No *</label>
            <input
              type="text"
              value={rollInput}
              onChange={(e) => handleRollSearch(e.target.value)}
              placeholder="e.g. 103774"
              className="w-full px-3 py-2 border-2 border-amber-500 rounded-lg font-mono font-bold text-sm bg-amber-50 focus:outline-none text-black"
              required
            />
            {rollInput && !autoStudent && (
              <p className="text-[10px] text-rose-600 font-bold mt-1">No approved student found for this Roll No</p>
            )}
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Candidate Name</label>
            <input type="text" value={autoStudent ? autoStudent.student_name : ''} placeholder="Auto-filled Name" className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold bg-slate-100 uppercase text-black" readOnly />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Father's Name</label>
            <input type="text" value={autoStudent ? autoStudent.father_name : ''} placeholder="Auto-filled Father Name" className="w-full px-3 py-2 border border-slate-300 rounded-lg font-semibold bg-slate-100 uppercase text-black" readOnly />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Enrollment No</label>
            <input type="text" value={autoStudent ? autoStudent.enrollment_no : ''} placeholder="Auto-filled Enrollment" className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono font-bold bg-slate-100 text-black" readOnly />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Course Name</label>
            <input type="text" value={autoStudent ? autoStudent.course_name : ''} placeholder="Auto-filled Course Name" className="w-full px-3 py-2 border border-slate-300 rounded-lg font-semibold bg-slate-100 uppercase text-black" readOnly />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">DES (S/O, D/O, W/O)</label>
            <select value={desVal} onChange={(e) => setDesVal(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold bg-white text-black">
              <option value="S/O">S/O (Son of)</option>
              <option value="D/O">D/O (Daughter of)</option>
              <option value="W/O">W/O (Wife of)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Course Start Date</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg font-semibold bg-white text-black" required />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Course End Date</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg font-semibold bg-white text-black" required />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Awarded Grade</label>
            <input type="text" value={gradeVal} onChange={(e) => setGradeVal(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold bg-white uppercase text-black" required />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Date of Issue</label>
            <input type="date" value={issueDateVal} onChange={(e) => setIssueDateVal(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg font-semibold bg-white text-black" required />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:bg-slate-400 text-white font-bold text-xs rounded-xl shadow transition cursor-pointer"
        >
          🚀 {isSaving ? 'Saving...' : 'Generate & Save Certificate'}
        </button>
      </form>

      {/* DIRECTORY */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b pb-4">
          <div>
            <h3 className="font-bold text-sm text-slate-900 uppercase">
              📜 Generated Student Certificates Directory ({filteredCertificates.length})
            </h3>
            <p className="text-xs text-slate-500">Saved in database - available after every login.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="🔍 Search Name, Roll, Enr..."
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none text-black"
            />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-bold bg-white focus:outline-none text-black">
              <option value="name">Sort by Name</option>
              <option value="roll">Sort by Roll No</option>
              <option value="date">Sort by Issue Date</option>
            </select>
            {selectedIds.length > 0 && (
              <button onClick={handleDeleteSelected} className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow transition">
                🗑️ Delete Selected ({selectedIds.length})
              </button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-slate-500 text-xs font-bold">⏳ Loading certificates...</div>
        ) : (
          <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-sm">
            <table className="w-full text-left text-xs text-slate-800">
              <thead className="bg-slate-900 text-white font-semibold">
                <tr>
                  <th className="p-3 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.length > 0 && selectedIds.length === filteredCertificates.length}
                      onChange={(e) => setSelectedIds(e.target.checked ? filteredCertificates.map((c) => c.id) : [])}
                      className="rounded text-amber-600"
                    />
                  </th>
                  <th className="p-3">Roll No</th>
                  <th className="p-3">Enrollment No</th>
                  <th className="p-3">Candidate Name</th>
                  <th className="p-3">Course Name</th>
                  <th className="p-3 text-center">Grade</th>
                  <th className="p-3 text-center">Action Options</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredCertificates.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500 font-medium">No certificates found.</td>
                  </tr>
                )}
                {filteredCertificates.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(c.id)}
                        onChange={(e) => setSelectedIds(e.target.checked ? [...selectedIds, c.id] : selectedIds.filter((id) => id !== c.id))}
                        className="rounded text-amber-600"
                      />
                    </td>
                    <td className="p-3 font-mono font-bold text-slate-900">{c.roll_no}</td>
                    <td className="p-3 font-mono font-bold text-sky-800">{c.enrollment_no}</td>
                    <td className="p-3 font-bold uppercase">{c.student_name}</td>
                    <td className="p-3">{c.course_name}</td>
                    <td className="p-3 text-center font-bold text-emerald-700">{c.grade}</td>
                    <td className="p-3 text-center space-x-1.5 whitespace-nowrap">
                      <button onClick={() => setEditingCert(c)} className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded text-[11px] shadow transition cursor-pointer">✏️ Edit</button>
                      <button onClick={() => handleView(c)} className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-[11px] shadow transition cursor-pointer">👁️ View</button>
                      <button onClick={() => handlePrint(c)} className="px-2.5 py-1 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded text-[11px] shadow transition cursor-pointer">🖨️ Print</button>
                      <button onClick={() => handleDeleteOne(c.id)} className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded text-[11px] shadow transition cursor-pointer">🗑️ Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* VIEW MODAL (black text, same as print) */}
      {viewingCert && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto text-black">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-sm font-bold uppercase">📜 Certificate Preview</h3>
              <button onClick={() => setViewingCert(null)} className="text-slate-500 hover:text-slate-800 font-bold text-sm">✕ Close</button>
            </div>

            <div className="bg-white border-2 border-black p-8 space-y-8 font-serif pt-[48mm]">
              <div className="flex justify-between items-center font-sans text-xs">
                <div className="space-y-2">
                  <div>Enrollment No: <strong>{viewingCert.enrollment_no}</strong></div>
                  <div>Roll No: <strong>{viewingCert.roll_no}</strong></div>
                  <div className="text-sm">Session: <strong>
                    {viewingCert.session}</strong></div>
                  
                </div>
                <div>
                <div className="text-sm mb-2 ml-2"><strong>
                {viewingCert.serial_no}</strong></div>
                  <img src={viewingCert.photo_url || PLACEHOLDER_PHOTO} className="w-24 h-28 border-2 border-black object-cover" alt="Candidate" />

                </div>
                
              </div>

              <div className="text-center text-xl font-black font-sans uppercase tracking-widest underline my-8">
                CERTIFICATE OF COMPLETION
              </div>

              <div className="text-sm leading-loose text-justify">
                
                This is to certify that <strong className="underline">{viewingCert.student_name}</strong> {viewingCert.des || 'S/O'} <strong className="underline">{viewingCert.father_name}</strong> has successfully completed the <strong className="underline">{viewingCert.course_name}</strong> conducted by <strong className="underline">{viewingCert.study_center || 'MITM Bilari'}</strong> during the period from <strong className="underline">{formatDate(viewingCert.start_date)}</strong> to <strong className="underline">{formatDate(viewingCert.end_date)}</strong>. The candidate has satisfied all requirements and has been awarded Grade <strong className="underline text-base">'{viewingCert.grade}'</strong>.
              </div>

              <div className="flex justify-between items-end pt-12 font-sans">
                <div className="text-center">
                  <img src={buildQrUrl(viewingCert, 110)} className="w-20 h-20 mx-auto" alt="QR Code" />
                  <div className="text-[9px] font-bold mt-1">SCAN TO VERIFY</div>
                  <div className="text-xs font-bold mb-1 mt-2 ">Date of Issue: {formatDate(viewingCert.issue_date)}</div>
                </div>
                <div className="text-center">

                  <div className="border-t-2 border-black w-40 pt-1 font-bold text-xs uppercase">Authorised Signatory</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t">
              <button onClick={() => setViewingCert(null)} className="px-4 py-2 bg-slate-200 text-xs font-bold rounded-xl">Close</button>
              <button
                onClick={() => {
                  printCertificate(viewingCert, awardMatter);
                  setViewingCert(null);
                }}
                className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow"
              >
                🖨️ Print Certificate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL (all fields) */}
      {editingCert && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto text-black">
            <h3 className="text-sm font-bold uppercase border-b pb-2">✏️ Edit Certificate Record</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              {(
                [
                  ['Candidate Name', 'student_name'],
                  ['Father Name', 'father_name'],
                  ['DES (S/O, D/O, W/O)', 'des'],
                  ['Roll No', 'roll_no'],
                  ['Enrollment No', 'enrollment_no'],
                  ['Document No', 'serial_no'],
                  ['Course Name', 'course_name'],
                  ['Session', 'session'],
                  ['Study Center', 'study_center'],
                  ['Start Date', 'start_date'],
                  ['End Date', 'end_date'],
                  ['Grade', 'grade'],
                  ['Issue Date', 'issue_date'],
                  ['DOB', 'dob'],
                ] as [string, keyof CertificateRecord][]
              ).map(([label, key]) => (
                <div key={key}>
                  <label className="block font-bold mb-1">{label}</label>
                  <input
                    type="text"
                    value={(editingCert[key] as string) || ''}
                    onChange={(e) => setEditingCert({ ...editingCert, [key]: e.target.value })}
                    className="w-full p-2 border rounded font-semibold"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t">
              <button onClick={() => setEditingCert(null)} className="px-4 py-1.5 bg-slate-200 text-xs font-bold rounded-lg">Cancel</button>
              <button onClick={handleSaveEdit} className="px-4 py-1.5 bg-sky-600 text-white text-xs font-bold rounded-lg">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}