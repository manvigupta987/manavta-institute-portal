"use client";

// Save as: components/MarksheetTab.tsx
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { printMarksheet, formatDate, buildQrUrl } from '@/lib/print-templates';

export interface SubjectMarks {
  paper_code: string;
  paper_name: string;
  max_marks: number;
  theory: number;
  practical: number;
  total_marks: number;
}

export interface MarksheetRecord {
  id: string;
  roll_no: string;
  enrollment_no: string;
  student_name: string;
  father_name: string;
  mother_name?: string;
  dob?: string;
  study_center: string;
  session: string;
  serial_no: string;
  photo_url?: string; // loaded on demand (heavy) - not part of the list query
  course_name: string;
  subjects: SubjectMarks[];
  grand_total_obtained: number;
  grand_total_max: number;
  percentage: number;
  grade: string;
  issue_date: string;
}

interface StudentLike {
  roll_no?: string;
  enrollment_no?: string;
  student_name?: string;
  father_name?: string;
  mother_name?: string;
  course_name?: string;
  dob?: string;
  photo_url?: string;
  study_center?: string;
  session?: string;
  serial_no?: string;
}

interface MarksheetTabProps {
  studentsList?: StudentLike[];
  isLetterhead?: boolean;
  setIsLetterhead?: (val: boolean) => void;
}

const PLACEHOLDER_PHOTO = 'https://iili.io/3jruEzl.md.jpg';

// Everything EXCEPT photo_url -> list loads very fast
const LIST_COLS =
  'id,roll_no,enrollment_no,student_name,father_name,mother_name,dob,study_center,session,serial_no,course_name,subjects,grand_total_obtained,grand_total_max,percentage,grade,issue_date,created_at';

const DEFAULT_SUBJECTS: SubjectMarks[] = [
  { paper_code: 'CPAC 201', paper_name: 'IT TOOLS', max_marks: 150, theory: 0, practical: 0, total_marks: 0 },
  { paper_code: 'CPAC 202', paper_name: 'FINANCIAL ACCOUNTING', max_marks: 150, theory: 0, practical: 0, total_marks: 0 },
];

const emptyForm = () => ({
  roll_no: '',
  enrollment_no: '',
  course_name: '',
  student_name: '',
  father_name: '',
  mother_name: '',
  dob: '',
  session: '2025-2027',
  study_center: 'MITM BILARI',
  serial_no: '',
  photo_url: '',
  issue_date: new Date().toISOString().split('T')[0],
});

const mapRow = (r: any): MarksheetRecord => ({
  id: r.id,
  roll_no: r.roll_no,
  enrollment_no: r.enrollment_no || '',
  student_name: r.student_name,
  father_name: r.father_name || '',
  mother_name: r.mother_name || '',
  dob: r.dob || '',
  study_center: r.study_center || '',
  session: r.session || '',
  serial_no: r.serial_no || '',
  photo_url: r.photo_url || undefined,
  course_name: r.course_name,
  subjects: Array.isArray(r.subjects) ? r.subjects : [],
  grand_total_obtained: Number(r.grand_total_obtained) || 0,
  grand_total_max: Number(r.grand_total_max) || 0,
  percentage: Number(r.percentage) || 0,
  grade: r.grade || '',
  issue_date: r.issue_date || '',
});

const calculateGrade = (pct: number) => {
  if (pct >= 90) return 'Ex';
  if (pct >= 80) return 'A';
  if (pct >= 70) return 'B';
  if (pct >= 60) return 'C';
  if (pct >= 40) return 'D';
  return 'F';
};

export default function MarksheetTabComponent({ studentsList = [] }: MarksheetTabProps) {
  const [marksheetsList, setMarksheetsList] = useState<MarksheetRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(emptyForm());
  const [subjects, setSubjects] = useState<SubjectMarks[]>(DEFAULT_SUBJECTS);

  const [viewingMarksheet, setViewingMarksheet] = useState<MarksheetRecord | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'roll' | 'percentage'>('roll');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // ---------------------------------------------------------------------
  // LOAD from Supabase
  // ---------------------------------------------------------------------
  const fetchMarksheets = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('marksheets')
      .select(LIST_COLS)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Fetch marksheets error:', error);
      alert('❌ Failed to load marksheets: ' + error.message);
    } else {
      setMarksheetsList((data || []).map(mapRow));
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMarksheets();
  }, []);

  // Photo is heavy (base64) -> fetched only when needed (view / print / edit)
  const fetchPhoto = async (id: string): Promise<string> => {
    const { data } = await supabase.from('marksheets').select('photo_url').eq('id', id).single();
    return data?.photo_url || '';
  };

  const withPhoto = async (m: MarksheetRecord): Promise<MarksheetRecord> => {
    if (m.photo_url) return m;
    const photo = await fetchPhoto(m.id);
    return { ...m, photo_url: photo || PLACEHOLDER_PHOTO };
  };

  // ---------------------------------------------------------------------
  // Form helpers
  // ---------------------------------------------------------------------
  const handleRollNoChange = (rollVal: string) => {
    setFormData((prev) => ({ ...prev, roll_no: rollVal }));
    if (!rollVal.trim()) return;

    // Marksheet already exists for this roll -> open it for editing
    const existing = marksheetsList.find((m) => m.roll_no.trim() === rollVal.trim());
    if (existing && !editingId) {
      handleStartEdit(existing);
      return;
    }

    // Otherwise auto-fill from students list
    const matched = studentsList.find((s) => (s.roll_no || '').trim() === rollVal.trim());
    if (matched) {
      setFormData((prev) => ({
        ...prev,
        roll_no: matched.roll_no || prev.roll_no,
        enrollment_no: matched.enrollment_no || prev.enrollment_no,
        course_name: matched.course_name || prev.course_name,
        student_name: matched.student_name || prev.student_name,
        father_name: matched.father_name || prev.father_name,
        mother_name: matched.mother_name || prev.mother_name,
        dob: matched.dob || prev.dob,
        session: matched.session || prev.session,
        study_center: matched.study_center || prev.study_center,
        photo_url: matched.photo_url || prev.photo_url,
        serial_no: matched.serial_no || prev.serial_no,
      }));
    }
  };

  const handleAddSubjectRow = () => {
    const nextNum = subjects.length + 1;
    setSubjects([
      ...subjects,
      { paper_code: `SUB 10${nextNum}`, paper_name: `PAPER ${nextNum}`, max_marks: 150, theory: 0, practical: 0, total_marks: 0 },
    ]);
  };

  const handleRemoveSubjectRow = (index: number) => {
    if (subjects.length <= 1) {
      alert('At least one subject is required.');
      return;
    }
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  const handleSubjectChange = (index: number, field: keyof SubjectMarks, value: any) => {
    const updated = [...subjects];
    const item = { ...updated[index], [field]: value };
    if (field === 'theory' || field === 'practical') {
      const th = field === 'theory' ? Number(value) || 0 : Number(item.theory) || 0;
      const pr = field === 'practical' ? Number(value) || 0 : Number(item.practical) || 0;
      item.total_marks = th + pr;
    }
    updated[index] = item;
    setSubjects(updated);
  };

  const grandObtained = subjects.reduce((sum, s) => sum + (Number(s.theory) || 0) + (Number(s.practical) || 0), 0);
  const grandMax = subjects.reduce((sum, s) => sum + (Number(s.max_marks) || 0), 0);
  const percentage = grandMax > 0 ? Number(((grandObtained / grandMax) * 100).toFixed(2)) : 0;
  const currentGrade = calculateGrade(percentage);

  const handleStartEdit = async (m: MarksheetRecord) => {
    setEditingId(m.id);
    setFormData({
      roll_no: m.roll_no,
      enrollment_no: m.enrollment_no,
      course_name: m.course_name,
      student_name: m.student_name,
      father_name: m.father_name,
      mother_name: m.mother_name || '',
      dob: m.dob || '',
      session: m.session,
      study_center: m.study_center,
      serial_no: m.serial_no,
      photo_url: m.photo_url || '',
      issue_date: m.issue_date,
    });
    setSubjects(m.subjects && m.subjects.length > 0 ? m.subjects : DEFAULT_SUBJECTS);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (!m.photo_url) {
      const photo = await fetchPhoto(m.id);
      setFormData((prev) => ({ ...prev, photo_url: photo }));
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData(emptyForm());
    setSubjects(DEFAULT_SUBJECTS);
  };

  // ---------------------------------------------------------------------
  // SAVE to Supabase (insert / update)
  // ---------------------------------------------------------------------
  const handleSaveMarksheet = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.roll_no || !formData.student_name || !formData.course_name) {
      alert('Please fill required fields: Roll No, Candidate Name, and Course Name.');
      return;
    }

    setIsSaving(true);

    const payload: any = {
      roll_no: formData.roll_no.trim(),
      enrollment_no: formData.enrollment_no.trim() || `ENR-${Date.now().toString().slice(-6)}`,
      student_name: formData.student_name.trim().toUpperCase(),
      father_name: formData.father_name.trim().toUpperCase(),
      mother_name: formData.mother_name.trim().toUpperCase(),
      dob: formData.dob.trim(),
      study_center: formData.study_center.trim(),
      session: formData.session.trim(),
      serial_no: formData.serial_no.trim() || `DN-${Math.floor(1000 + Math.random() * 9000)}`,
      course_name: formData.course_name.trim(),
      subjects: subjects.map((s) => ({
        ...s,
        total_marks: (Number(s.theory) || 0) + (Number(s.practical) || 0),
      })),
      grand_total_obtained: grandObtained,
      grand_total_max: grandMax,
      percentage,
      grade: currentGrade,
      issue_date: formData.issue_date,
    };

    // Don't overwrite an existing photo with an empty value
    const photo = formData.photo_url.trim();
    if (photo) payload.photo_url = photo;
    else if (!editingId) payload.photo_url = PLACEHOLDER_PHOTO;

    if (editingId) {
      const { data, error } = await supabase
        .from('marksheets')
        .update(payload)
        .eq('id', editingId)
        .select(LIST_COLS)
        .single();

      if (error) {
        console.error('Update marksheet error:', error);
        alert('❌ Failed to update marksheet: ' + error.message);
        setIsSaving(false);
        return;
      }
      setMarksheetsList(marksheetsList.map((item) => (item.id === editingId ? mapRow(data) : item)));
      alert('✅ Marksheet Record Updated Successfully!');
    } else {
      const { data, error } = await supabase
        .from('marksheets')
        .insert([payload])
        .select(LIST_COLS)
        .single();

      if (error) {
        console.error('Insert marksheet error:', error);
        alert('❌ Failed to save marksheet: ' + error.message);
        setIsSaving(false);
        return;
      }
      setMarksheetsList([mapRow(data), ...marksheetsList]);
      alert('🎉 Marksheet Generated & Saved Successfully!');
    }

    setIsSaving(false);
    handleCancelEdit();
  };

  // ---------------------------------------------------------------------
  // View / Print / Delete
  // ---------------------------------------------------------------------
  const handlePrint = async (m: MarksheetRecord) => {
    const win = window.open('', '_blank'); // open right away (keeps popup permission)
    const full = await withPhoto(m);
    printMarksheet(full, {}, win);
  };

  const handleView = async (m: MarksheetRecord) => {
    setViewingMarksheet(await withPhoto(m));
  };

  const handleDeleteOne = async (id: string) => {
    if (!confirm('Delete this marksheet record?')) return;
    const { error } = await supabase.from('marksheets').delete().eq('id', id);
    if (error) {
      alert('❌ Failed to delete: ' + error.message);
      return;
    }
    setMarksheetsList(marksheetsList.filter((rec) => rec.id !== id));
    setSelectedIds(selectedIds.filter((i) => i !== id));
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Delete ${selectedIds.length} selected marksheets?`)) return;
    const { error } = await supabase.from('marksheets').delete().in('id', selectedIds);
    if (error) {
      alert('❌ Failed to delete: ' + error.message);
      return;
    }
    setMarksheetsList(marksheetsList.filter((m) => !selectedIds.includes(m.id)));
    setSelectedIds([]);
  };

  const filteredList = marksheetsList
    .filter((m) => {
      const q = searchQuery.toLowerCase().trim();
      return (
        !q ||
        m.student_name.toLowerCase().includes(q) ||
        m.roll_no.toLowerCase().includes(q) ||
        m.enrollment_no.toLowerCase().includes(q) ||
        m.course_name.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.student_name.localeCompare(b.student_name);
      if (sortBy === 'percentage') return b.percentage - a.percentage;
      return a.roll_no.localeCompare(b.roll_no);
    });

  const photoIsData = formData.photo_url.startsWith('data:');

  return (
    <div className="space-y-8">
      {/* FORM SECTION */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-slate-200 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <span>📊</span> {editingId ? '✏️ Edit Student Marksheet' : 'Generate Student Marksheet & Upload Marks'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter Roll No to auto-fill candidate details, modify subject papers, and generate official statement of marks.
            </p>
          </div>

          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-lg transition cursor-pointer"
            >
              ❌ Cancel Edit
            </button>
          )}
        </div>

        <form onSubmit={handleSaveMarksheet} className="space-y-6">
          {/* CANDIDATE DETAILS */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide border-b border-slate-200 pb-2">
              👤 Candidate & Academic Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block font-bold text-sky-800 uppercase mb-1">
                  Roll Number * <span className="text-[10px] text-black">(Auto-fills details)</span>
                </label>
                <input
                  type="text"
                  value={formData.roll_no}
                  onChange={(e) => handleRollNoChange(e.target.value)}
                  placeholder="e.g. 103766"
                  className="w-full px-3 py-2 border-2 border-sky-400 rounded-lg font-mono font-bold bg-white focus:ring-2 text-black focus:ring-sky-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Enrollment Number</label>
                <input
                  type="text"
                  value={formData.enrollment_no}
                  onChange={(e) => setFormData({ ...formData, enrollment_no: e.target.value })}
                  placeholder="e.g. 1039954663"
                  className="w-full px-3 py-2 border text-black border-slate-300 rounded-lg font-mono font-semibold bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Course / Programme Name *</label>
                <input
                  type="text"
                  value={formData.course_name}
                  onChange={(e) => setFormData({ ...formData, course_name: e.target.value })}
                  placeholder="e.g. Computerised Professional Accounting"
                  className="w-full px-3 py-2 border text-black border-slate-300 rounded-lg font-semibold bg-white"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Candidate Name *</label>
                <input
                  type="text"
                  value={formData.student_name}
                  onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
                  placeholder="e.g. SHREYA CHUG"
                  className="w-full px-3 py-2 border text-black border-slate-300 rounded-lg font-bold uppercase bg-white"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Father's Name</label>
                <input
                  type="text"
                  value={formData.father_name}
                  onChange={(e) => setFormData({ ...formData, father_name: e.target.value })}
                  placeholder="e.g. YOGESH CHUG"
                  className="w-full px-3 py-2 border text-black border-slate-300 rounded-lg font-semibold uppercase bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Mother's Name</label>
                <input
                  type="text"
                  value={formData.mother_name}
                  onChange={(e) => setFormData({ ...formData, mother_name: e.target.value })}
                  placeholder="e.g. SUNITA CHUG"
                  className="w-full px-3 py-2 border text-black border-slate-300 rounded-lg font-semibold uppercase bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Date of Birth</label>
                <input
                  type="text"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  placeholder="e.g. 2005-08-15"
                  className="w-full px-3 py-2 border text-black border-slate-300 rounded-lg font-semibold bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Session</label>
                <input
                  type="text"
                  value={formData.session}
                  onChange={(e) => setFormData({ ...formData, session: e.target.value })}
                  placeholder="e.g. 2025-2027"
                  className="w-full px-3 py-2 border text-black border-slate-300 rounded-lg font-semibold bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Study Center</label>
                <input
                  type="text"
                  value={formData.study_center}
                  onChange={(e) => setFormData({ ...formData, study_center: e.target.value })}
                  placeholder="e.g. MITM BILARI"
                  className="w-full px-3 py-2 border text-black border-slate-300 rounded-lg font-semibold bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Document No / Serial No</label>
                <input
                  type="text"
                  value={formData.serial_no}
                  onChange={(e) => setFormData({ ...formData, serial_no: e.target.value })}
                  placeholder="e.g. DN-3754"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-black font-bold bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Candidate Photo</label>
                {photoIsData ? (
                  <div className="flex items-center gap-2 px-2 py-1 border border-slate-300 rounded-lg bg-white">
                    <img src={formData.photo_url} alt="" className="w-8 h-9 object-cover rounded border" />
                    <span className="text-[11px] font-bold text-black flex-1">✅ Auto-filled from student record</span>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, photo_url: '' })}
                      className="text-rose-600 font-bold text-xs"
                      title="Remove photo"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <input
                    type="text"
                    value={formData.photo_url}
                    onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
                    placeholder="https://... (auto-fills from Roll No)"
                    className="w-full px-3 py-2 border text-black border-slate-300 rounded-lg text-xs bg-white"
                  />
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Date of Issue</label>
                <input
                  type="date"
                  value={formData.issue_date}
                  onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-black font-bold bg-white"
                />
              </div>
            </div>
          </div>

          {/* SUBJECTS */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                📚 Subject Exam Papers & Marks Entry
              </h3>
              <button
                type="button"
                onClick={handleAddSubjectRow}
                className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-lg shadow transition cursor-pointer flex items-center gap-1"
              >
                ➕ Add Subject / Paper
              </button>
            </div>

            <div className="overflow-x-auto border border-slate-300 rounded-xl bg-white">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-white font-semibold">
                  <tr>
                    <th className="p-2.5 w-10 text-center">#</th>
                    <th className="p-2.5 w-32">Paper Code</th>
                    <th className="p-2.5">Exam / Paper Name</th>
                    <th className="p-2.5 w-24 text-center">Max Marks</th>
                    <th className="p-2.5 w-28 text-center">Theory (100)</th>
                    <th className="p-2.5 w-28 text-center">Practical (50)</th>
                    <th className="p-2.5 w-28 text-center">Total Obtained</th>
                    <th className="p-2.5 w-16 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {subjects.map((sub, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 text-black">
                      <td className="p-2.5 text-center font-bold text-slate-500">{idx + 1}</td>
                      <td className="p-2.5">
                        <input
                          type="text"
                          value={sub.paper_code}
                          onChange={(e) => handleSubjectChange(idx, 'paper_code', e.target.value)}
                          placeholder="CPAC 201"
                          className="w-full px-2 py-1 border border-slate-300 rounded font-mono font-bold uppercase text-xs"
                          required
                        />
                      </td>
                      <td className="p-2.5">
                        <input
                          type="text"
                          value={sub.paper_name}
                          onChange={(e) => handleSubjectChange(idx, 'paper_name', e.target.value)}
                          placeholder="Subject Name"
                          className="w-full px-2 py-1 border border-slate-300 rounded font-semibold text-xs"
                          required
                        />
                      </td>
                      <td className="p-2.5">
                        <input
                          type="number"
                          value={sub.max_marks}
                          onChange={(e) => handleSubjectChange(idx, 'max_marks', Number(e.target.value))}
                          className="w-full px-2 py-1 border border-slate-300 rounded text-center font-bold text-xs"
                        />
                      </td>
                      <td className="p-2.5">
                        <input
                          type="number"
                          max={100}
                          value={sub.theory}
                          onChange={(e) => handleSubjectChange(idx, 'theory', Number(e.target.value))}
                          placeholder="0-100"
                          className="w-full px-2 py-1 border border-slate-300 rounded text-center font-bold text-xs bg-amber-50"
                        />
                      </td>
                      <td className="p-2.5">
                        <input
                          type="number"
                          max={50}
                          value={sub.practical}
                          onChange={(e) => handleSubjectChange(idx, 'practical', Number(e.target.value))}
                          placeholder="0-50"
                          className="w-full px-2 py-1 border border-slate-300 rounded text-center font-bold text-xs bg-sky-50"
                        />
                      </td>
                      <td className="p-2.5 text-center font-mono font-black text-sky-800 text-sm">
                        {(Number(sub.theory) || 0) + (Number(sub.practical) || 0)}
                      </td>
                      <td className="p-2.5 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveSubjectRow(idx)}
                          className="p-1 text-rose-600 hover:text-rose-800 font-bold text-xs rounded hover:bg-rose-50"
                          title="Delete Subject"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-900 text-white p-4 rounded-xl border border-slate-800 text-xs font-bold">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 uppercase">Grand Total:</span>
                <span className="text-base text-amber-400 font-mono">
                  {grandObtained} / {grandMax}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 uppercase">Percentage:</span>
                <span className="text-base text-sky-400 font-mono">{percentage}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 uppercase">Grade Awarded:</span>
                <span className="text-base text-emerald-400 font-black">{currentGrade}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl shadow transition cursor-pointer"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-400 text-white font-bold text-xs rounded-xl shadow-lg transition cursor-pointer flex items-center gap-2"
            >
              💾 {isSaving ? 'Saving...' : editingId ? 'Update Marksheet Record' : 'Save & Generate Marksheet'}
            </button>
          </div>
        </form>
      </div>

      {/* DIRECTORY TABLE */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b pb-4">
          <div>
            <h3 className="font-bold text-sm text-slate-900 uppercase">
              📊 Generated Student Marksheets Directory ({marksheetsList.length})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">View or print official statement of marks.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {selectedIds.length > 0 && (
              <button
                onClick={handleDeleteSelected}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow transition cursor-pointer"
              >
                🗑️ Delete Selected ({selectedIds.length})
              </button>
            )}

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="🔍 Search Name, Roll, Course..."
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs text-black font-medium focus:ring-2 focus:ring-sky-500 bg-slate-50"
            />

            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="px-3 py-1.5 text-black border border-slate-300 rounded-lg text-xs font-bold bg-white"
            >
              <option value="roll">Sort by Roll No</option>
              <option value="name">Sort by Name</option>
              <option value="percentage">Sort by Percentage</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-slate-500 text-xs font-bold">⏳ Loading marksheets...</div>
        ) : (
          <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-sm">
            <table className="w-full text-left text-xs text-slate-800">
              <thead className="bg-slate-900 text-white font-semibold">
                <tr>
                  <th className="p-3 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.length > 0 && selectedIds.length === filteredList.length}
                      onChange={(e) => setSelectedIds(e.target.checked ? filteredList.map((m) => m.id) : [])}
                      className="rounded text-sky-600"
                    />
                  </th>
                  <th className="p-3">Roll No</th>
                  <th className="p-3">Enrollment No</th>
                  <th className="p-3">Candidate Name</th>
                  <th className="p-3">Course Name</th>
                  <th className="p-3 text-center">Grand Total</th>
                  <th className="p-3 text-center">Percentage</th>
                  <th className="p-3 text-center">Grade</th>
                  <th className="p-3 text-center">Action Options</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredList.length === 0 && (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-slate-500 font-medium">
                      No marksheets found.
                    </td>
                  </tr>
                )}
                {filteredList.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(m.id)}
                        onChange={(e) =>
                          setSelectedIds(e.target.checked ? [...selectedIds, m.id] : selectedIds.filter((id) => id !== m.id))
                        }
                        className="rounded text-sky-600"
                      />
                    </td>
                    <td className="p-3 font-mono font-bold text-slate-900">{m.roll_no}</td>
                    <td className="p-3 font-mono font-bold text-sky-800">{m.enrollment_no}</td>
                    <td className="p-3 font-bold uppercase">{m.student_name}</td>
                    <td className="p-3 font-medium">{m.course_name}</td>
                    <td className="p-3 text-center font-bold">
                      {m.grand_total_obtained} / {m.grand_total_max}
                    </td>
                    <td className="p-3 text-center font-bold text-sky-700">{m.percentage}%</td>
                    <td className="p-3 text-center font-bold text-emerald-700">{m.grade}</td>
                    <td className="p-3 text-center space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => handleStartEdit(m)}
                        className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded text-[11px] shadow transition cursor-pointer"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleView(m)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded text-[11px] shadow transition cursor-pointer"
                      >
                        👁️ View
                      </button>
                      <button
                        onClick={() => handlePrint(m)}
                        className="px-2.5 py-1 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded text-[11px] shadow transition cursor-pointer"
                      >
                        🖨️ Print
                      </button>
                      <button
                        onClick={() => handleDeleteOne(m.id)}
                        className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded text-[11px] shadow transition cursor-pointer"
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* VIEW MARKSHEET MODAL (black text, same as print) */}
      {viewingMarksheet && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 my-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto text-black">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold uppercase flex items-center gap-2">
                <span>👁️</span> Marksheet Preview - {viewingMarksheet.student_name}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => printMarksheet(viewingMarksheet)}
                  className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg shadow transition"
                >
                  🖨️ Print Now
                </button>
                <button
                  onClick={() => setViewingMarksheet(null)}
                  className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-lg transition"
                >
                  ✕ Close
                </button>
              </div>
            </div>

            <div className="pt-12 space-y-6 text-xs font-sans">
              <div className="text-center font-black text-base underline uppercase tracking-widest">STATEMENT OF MARKS</div>

              <div className="flex justify-between items-start gap-4 border-2 border-black p-4">
                <div className="grid grid-cols-2 gap-x-6 gap-y-3 flex-1 text-xs">
                  <div><span className="font-extrabold">PROGRAMME:</span> <span className="font-bold">{viewingMarksheet.course_name}</span></div>
                  <div><span className="font-extrabold">SESSION:</span> <span className="font-bold">{viewingMarksheet.session}</span></div>
                  <div><span className="font-extrabold">ROLL NO:</span> <span className="font-black">{viewingMarksheet.roll_no}</span></div>
                  <div><span className="font-extrabold">ENROLLMENT NO:</span> <span className="font-black">{viewingMarksheet.enrollment_no}</span></div>
                  <div><span className="font-extrabold">CANDIDATE NAME:</span> <span className="font-extrabold">{viewingMarksheet.student_name}</span></div>
                  <div><span className="font-extrabold">FATHER'S NAME:</span> <span className="font-bold">{viewingMarksheet.father_name}</span></div>
                  <div><span className="font-extrabold">MOTHER'S NAME:</span> <span className="font-bold">{viewingMarksheet.mother_name || 'N/A'}</span></div>
                  <div><span className="font-extrabold">DATE OF BIRTH:</span> <span className="font-bold">{formatDate(viewingMarksheet.dob) || 'N/A'}</span></div>
                  <div className="col-span-2"><span className="font-extrabold">STUDY CENTER:</span> <span className="font-bold">{viewingMarksheet.study_center}</span></div>
                </div>

                <div className="text-center shrink-0">
                  <div className="text-[10px] font-bold mb-1">DOC NO: {viewingMarksheet.serial_no}</div>
                  <img
                    src={viewingMarksheet.photo_url || PLACEHOLDER_PHOTO}
                    alt="Photo"
                    className="w-20 h-24 object-cover border-2 border-black bg-white"
                  />
                </div>
              </div>

              <table className="w-full border-collapse border-2 border-black text-center text-xs">
                <thead className="font-extrabold">
                  <tr className="border-b-2 border-black">
                    <th className="p-3 border-r border-black">PAPER CODE</th>
                    <th className="p-3 border-r border-black text-left pl-3">EXAM / PAPER NAME</th>
                    <th className="p-3 border-r border-black">MAX MARKS</th>
                    <th className="p-3 border-r border-black">THEORY (100)</th>
                    <th className="p-3 border-r border-black">PRACTICAL (50)</th>
                    <th className="p-3">TOTAL</th>
                  </tr>
                </thead>
                <tbody className="font-semibold">
                  {viewingMarksheet.subjects.map((sub, i) => (
                    <tr key={i} className="border-b border-black">
                      <td className="p-3 border-r border-black font-mono font-bold">{sub.paper_code}</td>
                      <td className="p-3 border-r border-black text-left pl-3 uppercase">{sub.paper_name}</td>
                      <td className="p-3 border-r border-black">{sub.max_marks}</td>
                      <td className="p-3 border-r border-black">{sub.theory}</td>
                      <td className="p-3 border-r border-black">{sub.practical}</td>
                      <td className="p-3 font-bold">{sub.total_marks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-between items-center border-2 border-black p-3 font-extrabold text-xs">
                <div>GRAND TOTAL: {viewingMarksheet.grand_total_obtained} / {viewingMarksheet.grand_total_max}</div>
                <div>PERCENTAGE: {viewingMarksheet.percentage}%</div>
                <div>FINAL GRADE: {viewingMarksheet.grade}</div>
              </div>

              <div className="flex justify-between items-end pt-4">
                <div className="text-center w-36">
                  <img src="/authorised-signature.png" alt="Sign" className="h-8 object-contain mx-auto mb-1" onError={(e: any) => (e.target.style.display = 'none')} />
                  <div className="border-t border-black pt-1 text-[9px] font-bold uppercase">DIRECTOR (MITM)</div>
                </div>

                <div className="text-center">
                  <img src={buildQrUrl(viewingMarksheet, 120)} alt="QR" className="w-16 h-16 mx-auto mb-1 border border-black p-1 bg-white" />
                  <div className="text-[8px] font-black uppercase">SCAN TO VERIFY</div>
                  <div className="text-[10px] font-bold mb-4 mt-2">DATE: {formatDate(viewingMarksheet.issue_date)}</div>
                </div>

                <div className="text-center w-36">
                  
                  <div className="border-t border-black pt-1 text-[9px] font-bold uppercase">CHIEF EXAM CONTROLLER</div>

                  
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}