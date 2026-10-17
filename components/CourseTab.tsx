"use client";

// Save as: components/CoursePapersTab.tsx
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface ExamCourse {
  id: string;
  course_name: string;
  course_code: string | null;
}

interface ExamPaper {
  id: string;
  course_id: string;
  paper_code: string;
  paper_name: string;
  max_marks: number;
  display_order: number;
}

export default function CoursePapersTabComponent() {
  const [courses, setCourses] = useState<ExamCourse[]>([]);
  const [papers, setPapers] = useState<ExamPaper[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  // Course form
  const [courseName, setCourseName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);

  // Paper form
  const [paperCode, setPaperCode] = useState('');
  const [paperName, setPaperName] = useState('');
  const [maxMarks, setMaxMarks] = useState(150);
  const [editingPaperId, setEditingPaperId] = useState<string | null>(null);

  // Quick-add (many papers at once)
  const [quickText, setQuickText] = useState('');

  const loadAll = async () => {
    setIsLoading(true);
    const [c, p] = await Promise.all([
      supabase.from('exam_courses').select('id,course_name,course_code').order('course_name', { ascending: true }),
      supabase.from('exam_papers').select('*').order('display_order', { ascending: true }),
    ]);

    if (c.error) alert('❌ Failed to load courses: ' + c.error.message);
    else {
      const list = (c.data || []) as ExamCourse[];
      setCourses(list);
      setSelectedCourseId((cur) => cur ?? (list[0]?.id || null));
    }

    if (p.error) alert('❌ Failed to load papers: ' + p.error.message);
    else setPapers(((p.data || []) as any[]).map((x) => ({ ...x, max_marks: Number(x.max_marks) || 150 })));

    setIsLoading(false);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const selectedCourse = courses.find((c) => c.id === selectedCourseId) || null;
  const coursePapers = papers.filter((p) => p.course_id === selectedCourseId);

  // ---------------------------------------------------------------------
  // COURSES
  // ---------------------------------------------------------------------
  const resetCourseForm = () => {
    setCourseName('');
    setCourseCode('');
    setEditingCourseId(null);
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseName.trim()) {
      alert('Course name is required.');
      return;
    }

    const payload = {
      course_name: courseName.trim(),
      course_code: courseCode.trim().toUpperCase() || null,
    };

    if (editingCourseId) {
      const { data, error } = await supabase.from('exam_courses').update(payload).eq('id', editingCourseId).select().single();
      if (error) {
        alert('❌ Failed to update course: ' + error.message);
        return;
      }
      setCourses(courses.map((c) => (c.id === editingCourseId ? (data as ExamCourse) : c)));
    } else {
      const { data, error } = await supabase.from('exam_courses').insert([payload]).select().single();
      if (error) {
        alert('❌ Failed to add course: ' + error.message + (error.message.includes('duplicate') ? ' (a course with this name already exists)' : ''));
        return;
      }
      setCourses([...courses, data as ExamCourse].sort((a, b) => a.course_name.localeCompare(b.course_name)));
      setSelectedCourseId((data as ExamCourse).id);
    }
    resetCourseForm();
  };

  const handleEditCourse = (c: ExamCourse) => {
    setEditingCourseId(c.id);
    setCourseName(c.course_name);
    setCourseCode(c.course_code || '');
  };

  const handleDeleteCourse = async (c: ExamCourse) => {
    if (!confirm(`Delete "${c.course_name}" and ALL its papers? (Existing marksheets are not affected.)`)) return;
    const { error } = await supabase.from('exam_courses').delete().eq('id', c.id);
    if (error) {
      alert('❌ Failed to delete: ' + error.message);
      return;
    }
    const remaining = courses.filter((x) => x.id !== c.id);
    setCourses(remaining);
    setPapers(papers.filter((p) => p.course_id !== c.id));
    if (selectedCourseId === c.id) setSelectedCourseId(remaining[0]?.id || null);
  };

  // ---------------------------------------------------------------------
  // PAPERS
  // ---------------------------------------------------------------------
  const resetPaperForm = () => {
    setPaperCode('');
    setPaperName('');
    setMaxMarks(150);
    setEditingPaperId(null);
  };

  const handleSavePaper = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId) {
      alert('Select or add a course first.');
      return;
    }
    if (!paperCode.trim() || !paperName.trim()) {
      alert('Paper code and paper name are required.');
      return;
    }

    const payload = {
      paper_code: paperCode.trim().toUpperCase(),
      paper_name: paperName.trim().toUpperCase(),
      max_marks: Number(maxMarks) || 150,
    };

    if (editingPaperId) {
      const { data, error } = await supabase.from('exam_papers').update(payload).eq('id', editingPaperId).select().single();
      if (error) {
        alert('❌ Failed to update paper: ' + error.message);
        return;
      }
      setPapers(papers.map((p) => (p.id === editingPaperId ? ({ ...(data as any), max_marks: Number((data as any).max_marks) } as ExamPaper) : p)));
    } else {
      const { data, error } = await supabase
        .from('exam_papers')
        .insert([{ ...payload, course_id: selectedCourseId, display_order: coursePapers.length + 1 }])
        .select()
        .single();
      if (error) {
        alert('❌ Failed to add paper: ' + error.message + (error.message.includes('duplicate') ? ' (this paper code already exists in this course)' : ''));
        return;
      }
      setPapers([...papers, { ...(data as any), max_marks: Number((data as any).max_marks) } as ExamPaper]);
    }
    resetPaperForm();
  };

  const handleEditPaper = (p: ExamPaper) => {
    setEditingPaperId(p.id);
    setPaperCode(p.paper_code);
    setPaperName(p.paper_name);
    setMaxMarks(p.max_marks);
  };

  const handleDeletePaper = async (p: ExamPaper) => {
    if (!confirm(`Delete paper ${p.paper_code}?`)) return;
    const { error } = await supabase.from('exam_papers').delete().eq('id', p.id);
    if (error) {
      alert('❌ Failed to delete: ' + error.message);
      return;
    }
    setPapers(papers.filter((x) => x.id !== p.id));
  };

  // One line per paper:  ADCS 101 | FUNDAMENTAL OF COMPUTER & OS | 150
  // (max marks is optional). Pipe-separated, so commas inside names are fine.
  const handleQuickAdd = async () => {
    if (!selectedCourseId) {
      alert('Select or add a course first.');
      return;
    }
    const lines = quickText.split('\n').map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) return;

    const existing = new Set(coursePapers.map((p) => p.paper_code.toUpperCase()));
    const rows: any[] = [];
    const skipped: string[] = [];
    let order = coursePapers.length;

    lines.forEach((line) => {
      const parts = line.split('|').map((s) => s.trim());
      if (parts.length < 2 || !parts[0] || !parts[1]) {
        skipped.push(`${line} (needs "CODE | NAME")`);
        return;
      }
      const code = parts[0].toUpperCase();
      if (existing.has(code)) {
        skipped.push(`${code} (already exists)`);
        return;
      }
      existing.add(code);
      order += 1;
      rows.push({
        course_id: selectedCourseId,
        paper_code: code,
        paper_name: parts[1].toUpperCase(),
        max_marks: Number(parts[2]) || 150,
        display_order: order,
      });
    });

    if (rows.length > 0) {
      const { data, error } = await supabase.from('exam_papers').insert(rows).select();
      if (error) {
        alert('❌ Failed to add papers: ' + error.message);
        return;
      }
      setPapers([...papers, ...((data || []) as any[]).map((x) => ({ ...x, max_marks: Number(x.max_marks) }))]);
    }

    setQuickText('');
    alert(`✅ Added ${rows.length} paper(s).` + (skipped.length ? `\n⚠️ Skipped:\n${skipped.join('\n')}` : ''));
  };

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500 text-xs font-bold">⏳ Loading course papers...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-slate-200 space-y-2">
        <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
          <span>📚</span> Course Papers Setup
        </h2>
        <p className="text-xs text-slate-500">
          Define each course and its papers once. In the Marksheet tab, choosing the course loads these papers automatically, and every subject row gets a dropdown to pick the paper.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: courses */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-md border border-slate-200 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase">
            {editingCourseId ? '✏️ Edit Course' : '➕ Add Course'}
          </h3>

          <form onSubmit={handleSaveCourse} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Course Name * <span className="text-[10px] text-slate-400 normal-case">(as printed on marksheet)</span></label>
              <input
                type="text"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                placeholder="e.g. Advance Diploma In Computer Software"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-semibold"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Short Code <span className="text-[10px] text-slate-400 normal-case">(optional, e.g. ADCS)</span></label>
              <input
                type="text"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                placeholder="ADCS"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold uppercase"
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg shadow">
                {editingCourseId ? '💾 Update' : '➕ Add Course'}
              </button>
              {editingCourseId && (
                <button type="button" onClick={resetCourseForm} className="px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded-lg">
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="border-t pt-4 space-y-2">
            <p className="text-[11px] font-bold text-slate-500 uppercase">Courses ({courses.length})</p>
            {courses.length === 0 && <p className="text-xs text-slate-400">No courses yet.</p>}
            {courses.map((c) => (
              <div
                key={c.id}
                onClick={() => setSelectedCourseId(c.id)}
                className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg border cursor-pointer transition ${
                  selectedCourseId === c.id ? 'bg-sky-50 border-sky-400' : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">{c.course_name}</p>
                  <p className="text-[10px] text-slate-500 font-mono">
                    {c.course_code || '—'} • {papers.filter((p) => p.course_id === c.id).length} papers
                  </p>
                </div>
                <div className="flex gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => handleEditCourse(c)} className="px-1.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 text-[10px] font-bold rounded border border-amber-300">✏️</button>
                  <button onClick={() => handleDeleteCourse(c)} className="px-1.5 py-1 bg-rose-100 hover:bg-rose-200 text-rose-800 text-[10px] font-bold rounded border border-rose-300">🗑️</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: papers of the selected course */}
        <div className="lg:col-span-2 space-y-6">
          {!selectedCourse ? (
            <div className="bg-white p-8 rounded-2xl shadow-md border border-slate-200 text-center text-xs font-bold text-slate-500">
              Add a course on the left to start adding its papers.
            </div>
          ) : (
            <>
              <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase">
                  {editingPaperId ? '✏️ Edit Paper' : '➕ Add Paper'} — <span className="text-sky-700">{selectedCourse.course_code || selectedCourse.course_name}</span>
                </h3>

                <form onSubmit={handleSavePaper} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs items-end">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Paper Code *</label>
                    <input
                      type="text"
                      value={paperCode}
                      onChange={(e) => setPaperCode(e.target.value)}
                      placeholder="ADCS 101"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono font-bold uppercase"
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 uppercase mb-1">Paper Name *</label>
                    <input
                      type="text"
                      value={paperName}
                      onChange={(e) => setPaperName(e.target.value)}
                      placeholder="FUNDAMENTAL OF COMPUTER & OS"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg font-semibold uppercase"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Max Marks</label>
                    <input
                      type="number"
                      value={maxMarks}
                      onChange={(e) => setMaxMarks(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold text-center"
                    />
                  </div>
                  <div className="sm:col-span-4 flex gap-2">
                    <button type="submit" className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg shadow">
                      {editingPaperId ? '💾 Update Paper' : '➕ Add Paper'}
                    </button>
                    {editingPaperId && (
                      <button type="button" onClick={resetPaperForm} className="px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded-lg">
                        Cancel
                      </button>
                    )}
                  </div>
                </form>

                <details className="border-t pt-3">
                  <summary className="text-xs font-bold text-slate-600 cursor-pointer">⚡ Quick add many papers at once</summary>
                  <div className="mt-3 space-y-2">
                    <p className="text-[11px] text-slate-500">One paper per line — <span className="font-mono">CODE | NAME | MAX MARKS (optional)</span></p>
                    <textarea
                      value={quickText}
                      onChange={(e) => setQuickText(e.target.value)}
                      rows={5}
                      placeholder={'ADCS 101 | FUNDAMENTAL OF COMPUTER & OS | 150\nADCS 102 | PC SOFTWARE (MS OFFICE)\nADCS 103 | DTP (PAGEMAKER, PHOTOSHOP & CORELDRAW)'}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-[11px]"
                    />
                    <button type="button" onClick={handleQuickAdd} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow">
                      ➕ Add These Papers
                    </button>
                  </div>
                </details>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200 space-y-3">
                <h3 className="text-sm font-bold text-slate-900 uppercase">
                  Papers of {selectedCourse.course_name} ({coursePapers.length})
                </h3>
                {coursePapers.length === 0 ? (
                  <p className="text-xs text-slate-400">No papers yet. Add some above.</p>
                ) : (
                  <div className="overflow-x-auto border border-slate-200 rounded-xl">
                    <table className="w-full text-left text-xs text-slate-800">
                      <thead className="bg-slate-900 text-white font-semibold">
                        <tr>
                          <th className="p-3 w-10 text-center">#</th>
                          <th className="p-3">Paper Code</th>
                          <th className="p-3">Paper Name</th>
                          <th className="p-3 text-center">Max Marks</th>
                          <th className="p-3 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {coursePapers.map((p, i) => (
                          <tr key={p.id} className="hover:bg-slate-50">
                            <td className="p-3 text-center font-bold text-slate-500">{i + 1}</td>
                            <td className="p-3 font-mono font-bold text-sky-800">{p.paper_code}</td>
                            <td className="p-3 font-semibold">{p.paper_name}</td>
                            <td className="p-3 text-center font-bold">{p.max_marks}</td>
                            <td className="p-3 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button onClick={() => handleEditPaper(p)} className="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 text-[10px] font-bold rounded border border-amber-300">✏️ Edit</button>
                                <button onClick={() => handleDeletePaper(p)} className="px-2 py-1 bg-rose-100 hover:bg-rose-200 text-rose-800 text-[10px] font-bold rounded border border-rose-300">🗑️ Delete</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}