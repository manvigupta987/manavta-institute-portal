"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  BookOpen,
  Award,
  Code,
  Laptop,
  FileText,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Layout,
  FileSpreadsheet,
  Palette,
  Monitor,
  RotateCcw
} from 'lucide-react';

export default function CourseList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [flippedId, setFlippedId] = useState<string | null>(null);

  const courses = [
    {
      id: 'olevel',
      code: 'O LEVEL',
      title: 'O Level (NIELIT)',
      subtitle: 'Foundation Diploma in Computer Applications',
      category: 'nielit',
      duration: '1 Year',
      eligibility: '10+2 ',
      syllabus: ['IT Tools & Network Basics', 'Web Designing & Publishing', 'Python Programming', 'Internet of Things (IoT)'],
      icon: Monitor
    },
    {
      id: 'ccc',
      code: 'CCC',
      title: 'CCC (NIELIT)',
      subtitle: 'Course on Computer Concepts',
      category: 'nielit',
      duration: '80 Hours',
      eligibility: '10th Pass / Open',
      syllabus: ['GUI Operating Systems', 'MS Office & Calc', 'Digital Financial Services', 'Cyber Security Basics'],
      icon: Laptop
    },
    {
      id: 'web-designing',
      code: 'WEB DESIGN',
      title: 'Web Designing',
      subtitle: 'Responsive Front-End Development',
      category: 'skills',
      duration: '6 Months',
      eligibility: '10th / 12th Pass',
      syllabus: ['HTML5 & CSS3 Layouts', 'JavaScript & DOM Manipulation', 'Bootstrap & Responsive UI', 'Web Hosting & Git Basics'],
      icon: Code
    },
    {
      id: 'dca',
      code: 'DCA',
      title: 'DCA',
      subtitle: 'Diploma in Computer Application',
      category: 'diploma',
      duration: '1 Year',
      eligibility: '10th Pass',
      syllabus: ['Computer Fundamentals', 'MS Office Suite (Word, Excel, PPT)', 'Tally Basics & Data Entry', 'Internet & E-Governance'],
      icon: FileText
    },
    {
      id: 'cttc',
      code: 'CTTC',
      title: 'CTTC',
      subtitle: 'Computer Teacher Training Course',
      category: 'diploma',
      duration: '1 Year',
      eligibility: '12th Pass',
      syllabus: ['Teaching Methodology', 'Advanced Software Applications', 'Lab Administration & Hardware', 'Practical Examination Guidance'],
      icon: GraduationCap
    },
    {
      id: 'cico',
      code: 'CICO',
      title: 'CICO',
      subtitle: 'Certificate in Computer Operation',
      category: 'skills',
      duration: '6 Months',
      eligibility: '10th Pass',
      syllabus: ['Computer Hardware Basics', 'Windows Administration', 'Office Productivity Tools', 'Internet & Online Work'],
      icon: Layout
    },
    {
      id: 'dcs',
      code: 'DCS',
      title: 'DCS',
      subtitle: 'Diploma in Computer Science',
      category: 'diploma',
      duration: '1 Year',
      eligibility: '10+2 Pass',
      syllabus: ['Programming Concepts in C/C++', 'Data Structures Basics', 'Database Management (SQL)', 'Software Fundamentals'],
      icon: Code
    },
    {
      id: 'graphic-designing',
      code: 'GRAPHICS',
      title: 'Graphic Design',
      subtitle: 'Digital Publishing & Visual Arts',
      category: 'skills',
      duration: '6 Months',
      eligibility: '10th / 12th Pass',
      syllabus: ['Adobe Photoshop Editing', 'CorelDraw Vector Design', 'PageMaker & Layouts', 'Banner & Logo Designing'],
      icon: Palette
    },
    {
      id: 'master-excel',
      code: 'EXCEL',
      title: 'Master in Excel',
      subtitle: 'Advanced Spreadsheets & MIS Reporting',
      category: 'skills',
      duration: '3 Months',
      eligibility: 'Open to All',
      syllabus: ['Advanced Formulas (XLOOKUP, INDEX)', 'Pivot Tables & Charts', 'Data Validation & Dashboards', 'MIS Reporting Techniques'],
      icon: FileSpreadsheet
    },
    {
      id: 'cbse-11-12',
      code: 'CBSE CS/IP',
      title: '11th & 12th CBSE',
      subtitle: 'Computer Science (083) & IP (065)',
      category: 'school',
      duration: '1 Academic Year',
      eligibility: 'Class 11 & 12 Students',
      syllabus: ['Python Programming Basics to Advanced', 'SQL & Database Queries', 'Computer Networks Theory', 'Societal Impacts & Cyber Law'],
      icon: BookOpen
    },
    {
      id: 'alevel',
      code: 'A LEVEL',
      title: 'A Level (NIELIT)',
      subtitle: 'Advanced Graduate Diploma in IT',
      category: 'nielit',
      duration: '1.5 Years',
      eligibility: 'O Level Pass / Graduate',
      syllabus: ['Advanced Software Engineering', 'Database Systems & SQL', 'Web Technologies & Frameworks', 'Major Project & Practical Work'],
      icon: Award
    }
  ];

  const categories = [
    { id: 'all', label: 'All Courses' },
    { id: 'nielit', label: 'NIELIT Govt.' },
    { id: 'diploma', label: 'Diplomas (1-Yr)' },
    { id: 'skills', label: 'Specialized Skills' },
    { id: 'school', label: 'Class 11 & 12 CBSE' }
  ];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.syllabus.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const toggleFlip = (id: string) => {
    setFlippedId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="py-12 bg-[#FAF7F2] text-[#2B211D] font-sans min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* HEADER SECTION */}
        <div className="bg-white border border-[#E8DFC8] rounded-3xl p-6 sm:p-10 text-center space-y-4 shadow-sm">
          <div className="inline-flex items-center gap-2 bg-[#FAF7F2] text-[#6B1F2A] border border-[#E8DFC8] px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-[#B08D57]" />
            Manavta Institute Course Directory
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-[#2B211D] tracking-tight">
            Job-Oriented <span className="text-[#6B1F2A]">Computer Courses</span> & Certifications
          </h1>

          <p className="text-[#52443C] text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed font-medium">
            Govt. Job eligible diplomas, NIELIT certifications, and specialized IT skills taught at Bilari Head Campus since 1998.
          </p>

          {/* SEARCH & FILTER CONTROLS */}
          <div className="pt-4 space-y-4 max-w-3xl mx-auto">
            <div className="relative">
              <Search className="w-4 h-4 text-[#B08D57] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search courses, skills, or subjects (e.g. Python, O Level, Excel, Tally)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-[#FAF7F2] text-[#2B211D] border border-[#E8DFC8] rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#B08D57] focus:border-[#B08D57] shadow-sm transition"
              />
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition ${
                    selectedCategory === cat.id
                      ? 'bg-[#6B1F2A] text-white shadow-md'
                      : 'bg-white text-[#52443C] hover:bg-[#F2ECE1] border border-[#E8DFC8]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-[11px] text-[#8A7A6F] font-semibold -mt-2">
          Tap a card to flip it and see the full syllabus
        </p>

        {/* 4 IN A ROW FLIP FLASHCARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredCourses.map((course) => {
            const IconComponent = course.icon;
            const isFlipped = flippedId === course.id;
            return (
              <div key={course.id} className="flip-card-perspective aspect-square">
                <div
                  onClick={() => toggleFlip(course.id)}
                  className={`flip-card-inner relative w-full h-full cursor-pointer ${isFlipped ? 'is-flipped' : ''}`}
                >
                  {/* FRONT FACE */}
                  <div className="flip-card-face absolute inset-0 bg-white border border-[#E8DFC8] rounded-3xl p-5 flex flex-col justify-between hover:border-[#B08D57] hover:shadow-lg transition-all duration-300 bg-gradient-to-b from-white to-[#FAF7F2]">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="p-2.5 bg-[#F2ECE1] text-[#6B1F2A] rounded-2xl border border-[#E8DFC8]">
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#6B1F2A] bg-[#F2ECE1] px-2.5 py-1 rounded-full border border-[#E8DFC8]">
                          {course.code}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-base font-black text-[#2B211D] line-clamp-1">{course.title}</h3>
                        <p className="text-[11px] text-[#8A7A6F] font-semibold line-clamp-1 mt-0.5">{course.subtitle}</p>
                      </div>

                      <div className="pt-2 border-t border-[#F2ECE1]">
                        <ul className="space-y-1">
                          {course.syllabus.slice(0, 2).map((item, idx) => (
                            <li key={idx} className="text-[10px] text-[#52443C] font-medium flex items-center gap-1.5 line-clamp-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#B08D57] shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#F2ECE1] space-y-2">
                      <div className="flex items-center justify-between text-[10px] text-[#52443C] font-bold">
                        <span>{course.duration}</span>
                        <span className="bg-[#F2ECE1] text-[#2B211D] px-2 py-0.5 rounded-md border border-[#E8DFC8]">
                          {course.eligibility}
                        </span>
                      </div>
                      <div className="w-full py-2 bg-[#2B211D]/5 text-[#6B1F2A] rounded-xl text-[10px] font-bold text-center flex items-center justify-center gap-1.5">
                        <RotateCcw className="w-3 h-3" />
                        <span>Tap to see full syllabus</span>
                      </div>
                    </div>
                  </div>

                  {/* BACK FACE */}
                  <div className="flip-card-face flip-card-back absolute inset-0 bg-[#6B1F2A] rounded-3xl p-5 flex flex-col justify-between text-white">
                    <div className="space-y-3">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#D8BD8E]">
                        {course.code} — Full Syllabus
                      </span>
                      <ul className="space-y-1.5">
                        {course.syllabus.map((item, idx) => (
                          <li key={idx} className="text-[11px] font-medium flex items-start gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D8BD8E] shrink-0 mt-1" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Link
                      href="/enroll-now"
                      onClick={(e) => e.stopPropagation()}
                      className="w-full py-2 bg-white hover:bg-[#F2ECE1] text-[#6B1F2A] rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-sm transition group/btn"
                    >
                      <span>Apply Now</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12 bg-white rounded-3xl border border-[#E8DFC8] space-y-2">
            <p className="text-sm font-bold text-[#52443C]">No courses found matching &quot;{searchTerm}&quot;</p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
              className="text-xs text-[#6B1F2A] font-bold hover:underline"
            >
              Clear search & filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
}