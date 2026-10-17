"use client";

// Save as: components/CoursesTab.tsx
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface PaperDef {
  paper_code: string;
  paper_name: string;
  max_marks: number;
}

export interface CourseRecord {
  id: string;
  slug: string;
  code: string;
  title: string;
  marksheet_name: string;
  subtitle: string;
  category: string;
  duration: string;
  eligibility: string;
  icon_name: string;
  description: string;
  short_syllabus: string[];
  full_syllabus: string[];
  papers: PaperDef[];
  display_order: number;
}

const ICON_OPTIONS = [
  'Monitor', 'Laptop', 'Code', 'FileText', 'GraduationCap',
  'Layout', 'FileSpreadsheet', 'Palette', 'BookOpen', 'Award',
];

const CATEGORY_OPTIONS = [
  { id: 'nielit', label: 'NIELIT Govt.' },
  { id: 'diploma', label: 'Diplomas (1-Yr)' },
  { id: 'skills', label: 'Specialized Skills' },
  { id: 'school', label: 'Class 11 & 12 CBSE' },
];

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const emptyForm = () => ({
  slug: '',
  code: '',
  title: '',
  marksheet_name: '',
  subtitle: '',
  category: 'skills',
  duration: '',
  eligibility: '',
  icon_name: 'BookOpen',
  description: '',
  short_syllabus: '', // one per line in the textarea
  full_syllabus: '',  // one per line in the textarea
  papers: [] as PaperDef[],
});

const mapRow = (r: any): CourseRecord => ({
  id: r.id,
  slug: r.slug,
  code: r.code,
  title: r.title,
  marksheet_name: r.marksheet_name || '',
  subtitle: r.subtitle || '',
  category: r.category || 'skills',
  duration: r.duration || '',
  eligibility: r.eligibility || '',
  icon_name: r.icon_name || 'BookOpen',
  description: r.description || '',
  short_syllabus: Array.isArray(r.short_syllabus) ? r.short_syllabus : [],
  full_syllabus: Array.isArray(r.full_syllabus) ? r.full_syllabus : [],
  papers: Array.isArray(r.papers)
    ? r.papers.map((p: any) => ({
        paper_code: String(p.paper_code || ''),
        paper_name: String(p.paper_name || ''),
        max_marks: Number(p.max_marks) || 150,
      }))
    : [],
  display_order: r.display_order || 0,
});

const linesToArray = (text: string) =>
  text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

export default function CoursesTabComponent() {
  const [courses, setCourses] = useState<CourseRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCourses = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Fetch courses error:', error);
      alert('❌ Failed to load courses: ' + error.message);
    } else {
      setCourses((data || []).map(mapRow));
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleTitleChange = (title: string) => {
    setForm((prev) => ({
      ...prev,
      title,
      // auto-generate the slug from the title only while adding a NEW course
      slug: editingId ? prev.slug : slugify(title),
    }));
  };

  // ---------------------------------------------------------------------
  // Papers editor (inside the course form)
  // ---------------------------------------------------------------------
  const addPaperRow = () =>
    setForm((prev) => ({
      ...prev,
      papers: [...prev.papers, { paper_code: '', paper_name: '', max_marks: 150 }],
    }));

  const updatePaper = (index: number, field: keyof PaperDef, value: string | number) =>
    setForm((prev) => ({
      ...prev,
      papers: prev.papers.map((p, i) => (i === index ? { ...p, [field]: value } : p)),
    }));

  const removePaper = (index: number) =>
    setForm((prev) => ({ ...prev, papers: prev.papers.filter((_, i) => i !== index) }));

  const movePaper = (index: number, dir: -1 | 1) =>
    setForm((prev) => {
      const target = index + dir;
      if (target < 0 || target >= prev.papers.length) return prev;
      const next = [...prev.papers];
      [next[index], next[target]] = [next[target], next[index]];
      return { ...prev, papers: next };
    });

  // ---------------------------------------------------------------------
  // Edit / save / delete
  // ---------------------------------------------------------------------
  const handleStartEdit = (c: CourseRecord) => {
    setEditingId(c.id);
    setForm({
      slug: c.slug,
      code: c.code,
      title: c.title,
      marksheet_name: c.marksheet_name,
      subtitle: c.subtitle,
      category: c.category,
      duration: c.duration,
      eligibility: c.eligibility,
      icon_name: c.icon_name,
      description: c.description,
      short_syllabus: c.short_syllabus.join('\n'),
      full_syllabus: c.full_syllabus.join('\n'),
      papers: c.papers.map((p) => ({ ...p })),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm());
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.trim() || !form.code.trim() || !form.slug.trim()) {
      alert('Title, Badge Code, and Slug (URL id) are required.');
      return;
    }

    // Clean the papers list: drop fully-empty rows, require both code + name on the rest
    const cleanedPapers: PaperDef[] = [];
    for (let i = 0; i < form.papers.length; i++) {
      const p = form.papers[i];
      const code = p.paper_code.trim().toUpperCase();
      const name = p.paper_name.trim().toUpperCase();
      if (!code && !name) continue;
      if (!code || !name) {
        alert(`Paper #${i + 1}: both Paper Code and Paper Name are required (or delete the row).`);
        return;
      }
      cleanedPapers.push({ paper_code: code, paper_name: name, max_marks: Number(p.max_marks) || 150 });
    }
    const codes = cleanedPapers.map((p) => p.paper_code);
    const dup = codes.find((c, i) => codes.indexOf(c) !== i);
    if (dup) {
      alert(`Paper code "${dup}" is used twice in this course. Each paper code must be unique.`);
      return;
    }

    setIsSaving(true);

    const payload = {
      slug: slugify(form.slug),
      code: form.code.trim().toUpperCase(),
      title: form.title.trim(),
      marksheet_name: form.marksheet_name.trim() || null,
      subtitle: form.subtitle.trim(),
      category: form.category,
      duration: form.duration.trim(),
      eligibility: form.eligibility.trim(),
      icon_name: form.icon_name,
      description: form.description.trim(),
      short_syllabus: linesToArray(form.short_syllabus),
      full_syllabus: linesToArray(form.full_syllabus),
      papers: cleanedPapers,
    };

    if (editingId) {
      const { data, error } = await supabase
        .from('courses')
        .update(payload)
        .eq('id', editingId)
        .select()
        .single();

      if (error) {
        console.error('Update course error:', error);
        alert('❌ Failed to update course: ' + error.message);
        setIsSaving(false);
        return;
      }
      setCourses(courses.map((c) => (c.id === editingId ? mapRow(data) : c)));
      alert('✅ Course updated!');
    } else {
      const nextOrder = courses.length > 0 ? Math.max(...courses.map((c) => c.display_order)) + 1 : 0;
      const { data, error } = await supabase
        .from('courses')
        .insert([{ ...payload, display_order: nextOrder }])
        .select()
        .single();

      if (error) {
        console.error('Insert course error:', error);
        alert('❌ Failed to save course: ' + error.message + (error.message.includes('duplicate') ? ' (This slug is already used by another course.)' : ''));
        setIsSaving(false);
        return;
      }
      setCourses([...courses, mapRow(data)]);
      alert('🎉 Course added! It now appears on the website, and its papers are available in the Marksheet tab.');
    }

    setIsSaving(false);
    handleCancelEdit();
  };

  const handleDelete = async (c: CourseRecord) => {
    if (!confirm(`Delete "${c.title}"? This cannot be undone.`)) return;
    const { error } = await supabase.from('courses').delete().eq('id', c.id);
    if (error) {
      alert('❌ Failed to delete: ' + error.message);
      return;
    }
    setCourses(courses.filter((x) => x.id !== c.id));
  };

  // Reorder courses (this is the order they appear on the website)
  const moveCourse = async (c: CourseRecord, dir: -1 | 1) => {
    const idx = courses.findIndex((x) => x.id === c.id);
    const target = idx + dir;
    if (target < 0 || target >= courses.length) return;

    const reordered = [...courses];
    [reordered[idx], reordered[target]] = [reordered[target], reordered[idx]];
    const renumbered = reordered.map((x, i) => ({ ...x, display_order: i }));

    const changed = renumbered.filter((x) => courses.find((o) => o.id === x.id)?.display_order !== x.display_order);
    const results = await Promise.all(
      changed.map((x) => supabase.from('courses').update({ display_order: x.display_order }).eq('id', x.id))
    );
    const failed = results.find((r) => r.error);
    if (failed?.error) {
      alert('❌ Failed to reorder: ' + failed.error.message);
      return;
    }
    setCourses(renumbered);
  };

  const isSearching = searchQuery.trim().length > 0;
  const filtered = courses.filter(
    (c) =>
      !isSearching ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* FORM */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-slate-200">
        <div className="flex items-center justify-between border-b pb-3 mb-4">
          <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
            <span>🎓</span> {editingId ? 'Edit Course' : 'Add New Course'}
          </h2>
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

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Course Title *</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. ADCS"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                URL Slug * <span className="text-[10px] text-slate-400 normal-case">(used as /courses#slug)</span>
              </label>
              <input
                type="text"
                required
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="e.g. adcs"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                disabled={!!editingId}
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Badge Code *</label>
              <input
                type="text"
                required
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                placeholder="e.g. ADCS"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold uppercase"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Course Name on Marksheet / Certificate{' '}
                <span className="text-[10px] text-slate-400 normal-case">(exact name printed &amp; stored for students — leave blank to use the title)</span>
              </label>
              <input
                type="text"
                value={form.marksheet_name}
                onChange={(e) => setForm({ ...form, marksheet_name: e.target.value })}
                placeholder="e.g. Advance Diploma In Computer Software"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Subtitle</label>
              <input
                type="text"
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                placeholder="e.g. Advance Diploma in Computer Software"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-semibold"
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Icon</label>
              <select
                value={form.icon_name}
                onChange={(e) => setForm({ ...form, icon_name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-semibold"
              >
                {ICON_OPTIONS.map((i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Duration</label>
              <input
                type="text"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                placeholder="e.g. 6 Months"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Eligibility</label>
              <input
                type="text"
                value={form.eligibility}
                onChange={(e) => setForm({ ...form, eligibility: e.target.value })}
                placeholder="e.g. 10th Pass"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div className="sm:col-span-2 md:col-span-3">
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Description <span className="text-[10px] text-slate-400 normal-case">(shown on the full course page)</span>
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                placeholder="A short paragraph introducing the course..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Short Syllabus <span className="text-[10px] text-slate-400 normal-case">(one point per line — shown on the flip card)</span>
              </label>
              <textarea
                value={form.short_syllabus}
                onChange={(e) => setForm({ ...form, short_syllabus: e.target.value })}
                rows={5}
                placeholder={'GUI Operating Systems\nMS Office & Calc\nDigital Financial Services'}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-[11px]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Full Syllabus <span className="text-[10px] text-slate-400 normal-case">(one point per line — shown in full on the /courses page)</span>
              </label>
              <textarea
                value={form.full_syllabus}
                onChange={(e) => setForm({ ...form, full_syllabus: e.target.value })}
                rows={5}
                placeholder={'Module 1: Introduction to GUI OS\nModule 2: MS Word - formatting, mail merge\nModule 3: MS Excel - formulas, charts\n...'}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-[11px]"
              />
            </div>

            {/* PAPERS EDITOR */}
            <div className="sm:col-span-2 md:col-span-3 border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <label className="block font-bold text-slate-800 uppercase">📚 Exam Papers (Subjects)</label>
                  <p className="text-[10px] text-slate-500">
                    In the Marksheet tab, choosing this course auto-fills these papers in this exact order, and each row gets a dropdown to switch papers. Use ▲ ▼ to reorder.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addPaperRow}
                  className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-lg shadow transition cursor-pointer"
                >
                  ➕ Add Paper
                </button>
              </div>

              {form.papers.length === 0 ? (
                <p className="text-[11px] text-slate-400">No papers added yet.</p>
              ) : (
                <div className="space-y-2">
                  <div className="grid grid-cols-12 gap-2 text-[10px] font-bold uppercase text-slate-500 px-1">
                    <span className="col-span-1 text-center">#</span>
                    <span className="col-span-3">Paper Code</span>
                    <span className="col-span-5">Paper Name</span>
                    <span className="col-span-1 text-center">Max</span>
                    <span className="col-span-2 text-right">Order / Delete</span>
                  </div>
                  {form.papers.map((p, i) => (
                    <div key={i} className="grid grid-cols-12 gap-2 items-center">
                      <span className="col-span-1 text-center font-bold text-slate-500">{i + 1}</span>
                      <input
                        type="text"
                        value={p.paper_code}
                        onChange={(e) => updatePaper(i, 'paper_code', e.target.value)}
                        placeholder="ADCS 101"
                        className="col-span-3 px-2 py-1.5 border border-slate-300 rounded font-mono font-bold uppercase bg-white"
                      />
                      <input
                        type="text"
                        value={p.paper_name}
                        onChange={(e) => updatePaper(i, 'paper_name', e.target.value)}
                        placeholder="FUNDAMENTAL OF COMPUTER & OS"
                        className="col-span-5 px-2 py-1.5 border border-slate-300 rounded font-semibold uppercase bg-white"
                      />
                      <input
                        type="number"
                        value={p.max_marks}
                        onChange={(e) => updatePaper(i, 'max_marks', Number(e.target.value))}
                        className="col-span-1 px-1 py-1.5 border border-slate-300 rounded font-bold text-center bg-white"
                      />
                      <div className="col-span-2 flex items-center justify-end gap-1">
                        <button type="button" onClick={() => movePaper(i, -1)} disabled={i === 0} className="px-1.5 py-1 bg-white border border-slate-300 rounded text-[11px] font-bold disabled:opacity-30 hover:bg-slate-100" title="Move up">▲</button>
                        <button type="button" onClick={() => movePaper(i, 1)} disabled={i === form.papers.length - 1} className="px-1.5 py-1 bg-white border border-slate-300 rounded text-[11px] font-bold disabled:opacity-30 hover:bg-slate-100" title="Move down">▼</button>
                        <button type="button" onClick={() => removePaper(i)} className="px-1.5 py-1 bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-300 rounded text-[11px] font-bold" title="Delete paper">🗑️</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-400 text-white font-bold text-xs rounded-xl shadow transition cursor-pointer"
            >
              {isSaving ? 'Saving...' : editingId ? '💾 Update Course' : '➕ Add Course'}
            </button>
          </div>
        </form>
      </div>

      {/* LIST */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b pb-4">
          <div>
            <h3 className="font-bold text-sm text-slate-900 uppercase">🎓 All Courses ({filtered.length})</h3>
            <p className="text-[11px] text-slate-500">The order here is the order courses appear on the website. {isSearching && '(Clear the search to reorder.)'}</p>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔍 Search courses..."
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-medium bg-slate-50"
          />
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-slate-500 text-xs font-bold">⏳ Loading courses...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs font-bold">No courses yet. Add one above.</div>
        ) : (
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs text-slate-800">
              <thead className="bg-slate-900 text-white font-semibold">
                <tr>
                  <th className="p-3 text-center">Order</th>
                  <th className="p-3">Code</th>
                  <th className="p-3">Title</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Duration</th>
                  <th className="p-3 text-center">Papers</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filtered.map((c) => {
                  const idx = courses.findIndex((x) => x.id === c.id);
                  return (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => moveCourse(c, -1)}
                            disabled={isSearching || idx === 0}
                            className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-[11px] font-bold disabled:opacity-30 hover:bg-slate-100"
                            title="Move up"
                          >
                            ▲
                          </button>
                          <button
                            onClick={() => moveCourse(c, 1)}
                            disabled={isSearching || idx === courses.length - 1}
                            className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-[11px] font-bold disabled:opacity-30 hover:bg-slate-100"
                            title="Move down"
                          >
                            ▼
                          </button>
                        </div>
                      </td>
                      <td className="p-3 font-mono font-bold text-sky-800">{c.code}</td>
                      <td className="p-3 font-bold">
                        {c.title}
                        {c.marksheet_name && <div className="text-[10px] text-slate-500 font-normal">Marksheet: {c.marksheet_name}</div>}
                      </td>
                      <td className="p-3">{CATEGORY_OPTIONS.find((o) => o.id === c.category)?.label || c.category}</td>
                      <td className="p-3">{c.duration}</td>
                      <td className="p-3 text-center font-bold">{c.papers.length}</td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleStartEdit(c)}
                            className="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 text-[10px] font-bold rounded border border-amber-300"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDelete(c)}
                            className="px-2 py-1 bg-rose-100 hover:bg-rose-200 text-rose-800 text-[10px] font-bold rounded border border-rose-300"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}