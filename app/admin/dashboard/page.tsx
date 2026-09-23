"use client";

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { text } from 'stream/consumers';

// ============================================================================
// DATA INTERFACES
// ============================================================================

export interface BranchInstitute {
  id: string;
  institute_code: string;
  institute_name: string;
  address: string;
  mobile_no: string;
  email: string;
  password: string;
  head_name?: string;
  head_qualification?: string;
  head_aadhar_no?: string;
  head_photo_url?: string;
  created_at: string;
}

export interface StudentRecord {
  id: string;
  enrollment_no: string;
  roll_no: string;
  serial_no: string; // Document No
  student_name: string;
  father_name: string;
  mother_name?: string;
  course_name: string;
  admission_date: string;
  session: string;
  dob?: string;
  qualification?: string;
  mobile_no?: string;
  alt_mobile_no?: string;
  aadhar_no: string;
  photo_url?: string;
  address?: string;
  study_center: string;
  gender?: string;
  status: 'APPROVED' | 'PENDING_APPROVAL';
  branch_code?: string;
}

// Helper: Export to Excel/CSV
const exportToExcel = (data: any[], filename: string) => {
  if (!data || !data.length) {
    alert("No data available to export!");
    return;
  }
  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(',')];

  data.forEach((row) => {
    const values = headers.map((header) => {
      const val = (row[header] === null || row[header] === undefined) ? '' : String(row[header]);
      return `"${val.replace(/"/g, '""')}"`;
    });
    csvRows.push(values.join(','));
  });

  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default function MITMAdminMasterDashboard() {
  const router = useRouter();

  // Active Main Tab (6 Tabs)
  const [activeTab, setActiveTab] = useState<'branches' | 'queue' | 'students' | 'idcards' | 'marksheets' | 'certificates'>('branches');

  // Pre-printed Letterhead Toggle
  const [isLetterhead, setIsLetterhead] = useState(false);

  // Tab 1: Branches Data
  const [branchesList, setBranchesList] = useState<BranchInstitute[]>([
    {
      id: 'b1',
      institute_code: 'MITM-CHANDAUSI',
      institute_name: 'MITM Chandausi Campus',
      address: 'Main Road, Near Railway Station, Chandausi',
      mobile_no: '9876543210',
      email: 'chandausi@manavtainstitute.com',
      password: 'chandausi@123',
      head_name: 'Dr. R.K. Sharma',
      head_qualification: 'M.Tech, Ph.D Computer Science',
      head_aadhar_no: '987654321012',
      head_photo_url: 'https://iili.io/3jruEzl.md.jpg',
      created_at: '2025-08-01'
    },
    {
      id: 'b2',
      institute_code: 'MITM-BILARI',
      institute_name: 'MITM Bilari Branch',
      address: 'Station Road, Bilari, Moradabad',
      mobile_no: '9123456789',
      email: 'bilari@manavtainstitute.com',
      password: 'bilari@123',
      head_name: 'Prof. S.P. Verma',
      head_qualification: 'MCA, M.Phil',
      head_aadhar_no: '876543210987',
      head_photo_url: 'https://iili.io/3jruEzl.md.jpg',
      created_at: '2025-08-05'
    }
  ]);

  // Tab 2: Queue Submissions
  const [studentsQueue, setStudentsQueue] = useState<StudentRecord[]>([
    {
      id: 'q1',
      enrollment_no: 'PENDING-001',
      roll_no: 'UNASSIGNED',
      serial_no: 'DN-9901',
      student_name: 'VIKRAM SINGH',
      father_name: 'RAJESH SINGH',
      mother_name: 'SUNITA DEVI',
      course_name: 'Advance Diploma In Computer Software',
      admission_date: '2025-09-01',
      session: '2025-2027',
      dob: '2003-05-12',
      qualification: '12th Pass',
      mobile_no: '9876500111',
      alt_mobile_no: '9876500112',
      aadhar_no: '456789012345',
      photo_url: 'https://iili.io/3jruEzl.md.jpg',
      address: 'Near Bus Stand, Bilari',
      study_center: 'MITM Bilari Branch',
      status: 'PENDING_APPROVAL',
      branch_code: 'MITM-BILARI'
    },
    {
      id: 'q2',
      enrollment_no: 'PENDING-002',
      roll_no: 'UNASSIGNED',
      serial_no: 'DN-9902',
      student_name: 'POOJA SHARMA',
      father_name: 'RAMESH SHARMA',
      mother_name: 'GEETA SHARMA',
      course_name: 'Computerised Professional Accounting Course',
      admission_date: '2025-09-02',
      session: '2025-2027',
      dob: '2002-11-20',
      qualification: 'B.Com Graduate',
      mobile_no: '9876500222',
      aadhar_no: '567890123456',
      photo_url: 'https://iili.io/3jruEzl.md.jpg',
      address: 'Civil Lines, Chandausi',
      study_center: 'MITM Chandausi Campus',
      status: 'PENDING_APPROVAL',
      branch_code: 'MITM-CHANDAUSI'
    }
  ]);

  // Tab 3 & 4: Master Student Records
  const [studentsList, setStudentsList] = useState<StudentRecord[]>([
    {
      id: 's1',
      enrollment_no: '1039954701',
      roll_no: '103801',
      serial_no: 'DN-3754',
      student_name: 'SHREYA CHUG',
      father_name: 'MOHAN CHUG',
      mother_name: 'SANGEETA CHUG',
      course_name: 'Computerised Professional Accounting Course',
      admission_date: '2025-07-15',
      session: '2025-2027',
      dob: '2002-04-10',
      qualification: 'B.Com',
      mobile_no: '9876123450',
      alt_mobile_no: '9876123451',
      aadhar_no: '123456789012',
      photo_url: 'https://iili.io/3jruEzl.md.jpg',
      address: 'Main Market, Bilari, Moradabad',
      study_center: 'Manavta Institute of Education - Bilari Campus',
      status: 'APPROVED',
      branch_code: 'MITM-BILARI'
    },
    {
      id: 's2',
      enrollment_no: '1039954702',
      roll_no: '103802',
      serial_no: 'DN-3762',
      student_name: 'BANTY',
      father_name: 'RAMESH KUMAR',
      mother_name: 'SUDESH DEVI',
      course_name: 'Desktop Publishing (DTP)',
      admission_date: '2025-08-01',
      session: '2025-2026',
      dob: '2001-08-15',
      qualification: '12th Pass',
      mobile_no: '9876234561',
      aadhar_no: '234567890123',
      photo_url: 'https://iili.io/3jruEzl.md.jpg',
      address: 'Railway Colony, Chandausi',
      study_center: 'Manavta Institute of Education - Chandausi Campus',
      status: 'APPROVED',
      branch_code: 'MITM-CHANDAUSI'
    }
  ]);

  // Tab 1: New Branch Form State
  const [newBranch, setNewBranch] = useState({
    institute_code: '',
    institute_name: '',
    email: '',
    mobile_no: '',
    password: '',
    address: '',
    head_name: '',
    head_qualification: '',
    head_aadhar_no: '',
    head_photo_url: ''
  });
  const [editingBranch, setEditingBranch] = useState<BranchInstitute | null>(null);

  // Tab 2: Queue Filter & Search
  const [selectedBranchFilter, setSelectedBranchFilter] = useState<string>('ALL');
  const [queueSearchQuery, setQueueSearchQuery] = useState<string>('');

  // Tab 3: Direct Student Registration Form State
  const [newStudentForm, setNewStudentForm] = useState({
    roll_no: '',
    enrollment_no: '',
    serial_no: '', // Document No
    course_name: 'Advance Diploma In Computer Software',
    admission_date: new Date().toISOString().split('T')[0],
    session: '2025-2027',
    student_name: '',
    father_name: '',
    mother_name: '',
    dob: '',
    qualification: '',
    mobile_no: '',
    alt_mobile_no: '',
    aadhar_no: '',
    photo_url: 'https://iili.io/3jruEzl.md.jpg',
    address: '',
    study_center: 'MITM Bilari Campus'
  });
  const [editingStudent, setEditingStudent] = useState<StudentRecord | null>(null);

  // Selection Checkboxes & Controls for Multi-Delete
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [selectedIdCardIds, setSelectedIdCardIds] = useState<string[]>([]);
  const [selectedMarksheetIds, setSelectedMarksheetIds] = useState<string[]>([]);
  const [selectedCertificateIds, setSelectedCertificateIds] = useState<string[]>([]);

  // Search & Sorting States
  const [studentSearch, setStudentSearch] = useState('');
  const [studentSortBy, setStudentSortBy] = useState<'name' | 'session' | 'enrollment'>('name');

  const [idCardSearch, setIdCardSearch] = useState('');
  const [idCardSortBy, setIdCardSortBy] = useState<'name' | 'session' | 'roll'>('name');

  const [marksheetSearch, setMarksheetSearch] = useState('');
  const [marksheetSortBy, setMarksheetSortBy] = useState<'name' | 'roll' | 'percentage'>('name');

  const [certSearch, setCertSearch] = useState('');
  const [certSortBy, setCertSortBy] = useState<'name' | 'roll' | 'date'>('name');

  // Viewing ID Card Modal
  const [viewingIdCardStudent, setViewingIdCardStudent] = useState<StudentRecord | null>(null);

  // Assign Modal for Queue Student
  const [assigningStudent, setAssigningStudent] = useState<StudentRecord | null>(null);
  const [assignRoll, setAssignRoll] = useState('');
  const [assignEnrollment, setAssignEnrollment] = useState('');

  // PHOTO UPLOAD VALIDATION HANDLER (JPG/PNG <= 200KB)
  const handlePhotoUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    onSuccess: (base64Url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      alert("❌ Photo must be in JPG or PNG format only!");
      e.target.value = '';
      return;
    }

    const maxSizeBytes = 200 * 1024;
    if (file.size > maxSizeBytes) {
      alert(`❌ Photo size exceeds 200KB limit! (Selected file size: ${(file.size / 1024).toFixed(1)}KB)`);
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onSuccess(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // TAB 1 HANDLERS
  const handleRegisterBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranch.institute_code || !newBranch.institute_name || !newBranch.mobile_no || !newBranch.password) {
      alert("Please fill all required branch registration fields!");
      return;
    }

    const created: BranchInstitute = {
      id: 'b_' + Date.now(),
      institute_code: newBranch.institute_code.trim().toUpperCase(),
      institute_name: newBranch.institute_name.trim(),
      email: newBranch.email.trim(),
      mobile_no: newBranch.mobile_no.trim(),
      password: newBranch.password,
      address: newBranch.address.trim(),
      head_name: newBranch.head_name.trim(),
      head_qualification: newBranch.head_qualification.trim(),
      head_aadhar_no: newBranch.head_aadhar_no.trim(),
      head_photo_url: newBranch.head_photo_url || 'https://iili.io/3jruEzl.md.jpg',
      created_at: new Date().toISOString().split('T')[0]
    };

    setBranchesList([...branchesList, created]);
    setNewBranch({
      institute_code: '',
      institute_name: '',
      email: '',
      mobile_no: '',
      password: '',
      address: '',
      head_name: '',
      head_qualification: '',
      head_aadhar_no: '',
      head_photo_url: ''
    });
    alert("✅ Branch Registered Successfully!");
  };

  const handleUpdateBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBranch) return;
    setBranchesList(branchesList.map(b => b.id === editingBranch.id ? editingBranch : b));
    setEditingBranch(null);
    alert("✅ Branch Details Updated Successfully!");
  };

  const handleDeleteBranchWithData = (branchCode: string) => {
    if (confirm(`⚠️ WARNING: Are you sure you want to delete branch ${branchCode} along with ALL its submitted student records?`)) {
      setBranchesList(branchesList.filter(b => b.institute_code !== branchCode));
      setStudentsQueue(studentsQueue.filter(q => q.branch_code !== branchCode));
      setStudentsList(studentsList.filter(s => s.branch_code !== branchCode));
      alert("Branch and associated data deleted!");
    }
  };

  const handleDeleteBranchKeepData = (branchCode: string) => {
    if (confirm(`Are you sure you want to delete branch profile ${branchCode} while keeping student records intact?`)) {
      setBranchesList(branchesList.filter(b => b.institute_code !== branchCode));
      alert("Branch profile removed. Student records kept intact!");
    }
  };

  // TAB 2 HANDLERS
  const handleAssignSingleStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningStudent || !assignRoll || !assignEnrollment) {
      alert("Roll No & Enrollment No are required!");
      return;
    }

    const mergedStudent: StudentRecord = {
      ...assigningStudent,
      roll_no: assignRoll.trim(),
      enrollment_no: assignEnrollment.trim(),
      status: 'APPROVED'
    };

    setStudentsList([mergedStudent, ...studentsList]);
    setStudentsQueue(studentsQueue.filter(q => q.id !== assigningStudent.id));
    setAssigningStudent(null);
    setAssignRoll('');
    setAssignEnrollment('');
    alert(`✅ Student ${mergedStudent.student_name} merged to Master Records with Roll No: ${mergedStudent.roll_no}!`);
  };

  const handleBulkAutoAssignMerge = () => {
    if (!studentsQueue.length) {
      alert("No students in queue to merge!");
      return;
    }

    if (confirm(`🚀 Auto-assign Roll Nos and merge ALL ${studentsQueue.length} queue students to Central Master Records?`)) {
      let startRoll = 103800 + studentsList.length + 1;
      let startEnr = 1039954700 + studentsList.length + 1;

      const newlyApproved: StudentRecord[] = studentsQueue.map((s, idx) => ({
        ...s,
        roll_no: String(startRoll + idx),
        enrollment_no: String(startEnr + idx),
        status: 'APPROVED'
      }));

      setStudentsList([...newlyApproved, ...studentsList]);
      setStudentsQueue([]);
      alert(`🎉 Successfully Auto-Assigned & Merged ${newlyApproved.length} Students to Master Records!`);
    }
  };

  // TAB 3 HANDLERS
  const handleRegisterDirectStudent = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newStudentForm.roll_no || !newStudentForm.enrollment_no || !newStudentForm.serial_no ||
      !newStudentForm.student_name || !newStudentForm.father_name || !newStudentForm.mother_name ||
      !newStudentForm.dob || !newStudentForm.qualification || !newStudentForm.mobile_no ||
      !newStudentForm.aadhar_no || !newStudentForm.address) {
      alert("❌ All fields are compulsory EXCEPT Alt Mobile No!");
      return;
    }

    if (newStudentForm.mobile_no.replace(/\D/g, '').length !== 10) {
      alert("❌ Mobile No must be exactly 10 digits!");
      return;
    }

    if (newStudentForm.alt_mobile_no && newStudentForm.alt_mobile_no.replace(/\D/g, '').length !== 10) {
      alert("❌ Alt Mobile No must be exactly 10 digits!");
      return;
    }

    if (newStudentForm.aadhar_no.replace(/\D/g, '').length !== 12) {
      alert("❌ Aadhar No must be exactly 12 digits!");
      return;
    }

    const studentRecord: StudentRecord = {
      id: 's-' + Date.now(),
      roll_no: newStudentForm.roll_no.trim(),
      enrollment_no: newStudentForm.enrollment_no.trim(),
      serial_no: newStudentForm.serial_no.trim(),
      course_name: newStudentForm.course_name,
      admission_date: newStudentForm.admission_date,
      session: newStudentForm.session.trim(),
      student_name: newStudentForm.student_name.trim().toUpperCase(),
      father_name: newStudentForm.father_name.trim().toUpperCase(),
      mother_name: newStudentForm.mother_name.trim().toUpperCase(),
      dob: newStudentForm.dob,
      qualification: newStudentForm.qualification.trim(),
      mobile_no: newStudentForm.mobile_no.trim(),
      alt_mobile_no: newStudentForm.alt_mobile_no.trim(),
      aadhar_no: newStudentForm.aadhar_no.trim(),
      photo_url: newStudentForm.photo_url || 'https://iili.io/3jruEzl.md.jpg',
      address: newStudentForm.address.trim(),
      study_center: newStudentForm.study_center,
      status: 'APPROVED',
      branch_code: 'HEAD_OFFICE'
    };

    setStudentsList([studentRecord, ...studentsList]);


    setNewStudentForm({
      roll_no: '',
      enrollment_no: '',
      serial_no: '',
      course_name: 'Advance Diploma In Computer Software',
      admission_date: new Date().toISOString().split('T')[0],
      session: '2025-2027',
      student_name: '',
      father_name: '',
      mother_name: '',
      dob: '',
      qualification: '',
      mobile_no: '',
      alt_mobile_no: '',
      aadhar_no: '',
      photo_url: 'https://iili.io/3jruEzl.md.jpg',
      address: '',
      study_center: 'MITM Bilari Campus'
    });

    alert("✅ Direct Student Registered & Added to Master Records!");
  };

  const handleUpdateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    setStudentsList(studentsList.map(s => s.id === editingStudent.id ? editingStudent : s));
    setEditingStudent(null);
    alert("✅ Student Record Updated!");
  };

  const handleDeleteSingleStudent = (id: string) => {
    if (confirm("Are you sure you want to delete this student record?")) {
      setStudentsList(studentsList.filter(s => s.id !== id));
      setSelectedStudentIds(selectedStudentIds.filter(i => i !== id));
    }
  };

  const handleDeleteSelectedStudents = () => {
    if (!selectedStudentIds.length) {
      alert("No students selected!");
      return;
    }
    if (confirm(`Are you sure you want to delete ${selectedStudentIds.length} selected student records?`)) {
      setStudentsList(studentsList.filter(s => !selectedStudentIds.includes(s.id)));
      setSelectedStudentIds([]);
      alert("Selected student records deleted!");
    }
  };

  // =========================================================================
  // PRINT FUNCTIONS FOR ID CARD (UPDATED WITH LANDSCAPE, 3 LOGOS, AADHAR SIZE ON A4)
  // =========================================================================
  const printIDCard = (student: StudentRecord) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Popup blocker active! Please allow popups for printing.");
      return;
    }

    printWindow.document.write(`
<!DOCTYPE html>
<html>
<head>
<title>ID Card - ${student.student_name}</title>
<style>
@page {
  size: A4 portrait;
  margin: 0;
}
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  margin: 0;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background-color: #ffffff;
}
@media print {
  body {
    padding: 15mm 0 0 0;
  }
  .id-card-box {
    box-shadow: none !important;
  }
}
/* ID CARD WITH EXACT AADHAR SIZE: 85.6mm x 53.9mm (LANDSCAPE) */
.id-card-box {
  width: 85.6mm;
  height: 53.9mm;
  border: 1.5px solid #000000;
  border-radius: 4mm;
  padding: 2.5mm 3mm;
  box-sizing: border-box;
  background: #ffffff;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
}
.header-logos {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1.5px solid #0284c7;
  padding-bottom: 1.5mm;
  margin-bottom: 1.5mm;
}
.header-logos img {
  height: 6mm;
  object-fit: contain;
}
.header-logos img.logo-center {
  height: 5.5mm;
}
.card-body {
  display: flex;
  gap: 2.5mm;
  align-items: flex-start;
  flex: 1;
}
.photo-box {
  width: 13.5mm;
  height: 16.5mm;
  border: 1px solid #000000;
  border-radius: 1.5mm;
  overflow: hidden;
  flex-shrink: 0;
  background: #f8fafc;
}
.photo-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.details-box {
  flex: 1;
  font-size: 6.5pt;
  line-height: 1.25;
  color: #0f172a;
}
.details-box div {
  margin-bottom: 0.8mm;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.details-box span.label {
  font-weight: 800;
  color: #0284c7;
  display: inline-block;
  width: 19mm;
  text-transform: uppercase;
}
.footer-sig {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  border-top: 1px solid #e2e8f0;
  padding-top: 1mm;
  font-size: 5.5pt;
}
.sig-img {
  height: 4mm;
  object-fit: contain;
  margin-bottom: 0.5mm;
}
</style>
</head>
<body>
<div class="id-card-box">
  <div>
    <div class="header-logos">
      <img src="/mitm-logo.png" alt="MITM Logo" onError="this.src='https://iili.io/3jruEzl.md.jpg'" />
      <img src="/manavta-text-logo.png" class="logo-center" alt="MANAVTA Text Logo" onError="this.style.display='none'" />
      <img src="/iso-certified-badge.png" alt="ISO Badge" onError="this.src='https://iili.io/3jruEzl.md.jpg'" />
    </div>

    <div class="card-body">
      <div class="photo-box">
        <img src="${student.photo_url || 'https://iili.io/3jruEzl.md.jpg'}" alt="Photo" />
      </div>
      <div class="details-box">
        <div><span class="label">Candidate:</span> <strong>${student.student_name}</strong></div>
        <div><span class="label">Father:</span> ${student.father_name}</div>
        <div><span class="label">Roll No:</span> <strong style="color:#0f172a;">${student.roll_no}</strong></div>
        <div><span class="label">Enrollment:</span> <strong>${student.enrollment_no}</strong></div>
        <div><span class="label">Course:</span> ${student.course_name}</div>
        <div><span class="label">Session:</span> ${student.session}</div>
      </div>
    </div>
  </div>

  <div class="footer-sig">
    <div style="max-width: 50mm; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
      <span style="color: #64748b; font-weight: bold;">Center:</span>
      <strong>${student.study_center}</strong>
    </div>
    <div style="text-align: center;">
      <img src="/authorised-signature.png" class="sig-img" alt="Sig" onError="this.style.display='none'" />
      <div style="font-weight: bold; border-top: 1px solid #000; padding-top: 0.5mm; text-transform: uppercase;">Authorised Signatory</div>
    </div>
  </div>
</div>

<script>
window.onload = function() {
  window.print();
}
</script>
</body>
</html>
`);
    printWindow.document.close();
  };

  // FILTERED & SORTED LISTS MEMO
  const filteredStudents = useMemo(() => {
    return studentsList
      .filter(s => {
        const q = studentSearch.toLowerCase().trim();
        return (
          !q ||
          s.student_name.toLowerCase().includes(q) ||
          s.father_name.toLowerCase().includes(q) ||
          s.roll_no.toLowerCase().includes(q) ||
          s.enrollment_no.toLowerCase().includes(q) ||
          s.course_name.toLowerCase().includes(q) ||
          s.session.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (studentSortBy === 'name') return a.student_name.localeCompare(b.student_name);
        if (studentSortBy === 'session') return a.session.localeCompare(b.session);
        if (studentSortBy === 'enrollment') return a.enrollment_no.localeCompare(b.enrollment_no);
        return 0;
      });
  }, [studentsList, studentSearch, studentSortBy]);

  const filteredIdCards = useMemo(() => {
    return studentsList
      .filter(s => {
        const q = idCardSearch.toLowerCase().trim();
        return (
          !q ||
          s.student_name.toLowerCase().includes(q) ||
          s.roll_no.toLowerCase().includes(q) ||
          s.enrollment_no.toLowerCase().includes(q) ||
          s.branch_code?.toLowerCase().includes(q) ||
          s.study_center.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (idCardSortBy === 'name') return a.student_name.localeCompare(b.student_name);
        if (idCardSortBy === 'session') return a.session.localeCompare(b.session);
        if (idCardSortBy === 'roll') return a.roll_no.localeCompare(b.roll_no);
        return 0;
      });
  }, [studentsList, idCardSearch, idCardSortBy]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans pb-16">

      {/* HEADER BAR */}
      <header className="bg-slate-800 mb-5 text-white shadow-lg sticky top-0 z-30 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sky-600 rounded-xl flex items-center justify-center font-black text-xl text-white shadow">
              M
            </div>
            <div>
              <h1 className="text-lg font-black tracking-wide uppercase text-white">
                MITM Admin Portal
              </h1>
              <p className="text-xs text-sky-400 font-medium">
                Manavta Institute of Technology & Management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/')}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow transition"
            >
              🚪 Logout
            </button>
          </div>
        </div>

        {/* TOP NAVIGATION TABS */}
        <div className="bg-white border-t border-slate-700/60 overflow-x-auto">
          <div className="max-w-7xl mx-auto px-4 flex mt-3 mb-3 items-center gap-3 py-1.5 text-xs font-bold min-w-max">

            <button
              onClick={() => setActiveTab('branches')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'branches' ? 'bg-sky-600 text-white shadow' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span>🏛️</span> Tab 1: Register Branches ({branchesList.length})
            </button>

            <button
              onClick={() => setActiveTab('queue')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'queue' ? 'bg-sky-600 text-white shadow' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span>📥</span> Tab 2: Branch Submissions ({studentsQueue.length})
            </button>

            <button
              onClick={() => setActiveTab('students')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'students' ? 'bg-sky-600 text-white shadow' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span>📋</span> Tab 3: Student Registration ({studentsList.length})
            </button>

            <button
              onClick={() => setActiveTab('idcards')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'idcards' ? 'bg-sky-600 text-white shadow' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span>🪪</span> Tab 4: ID Card Print ({studentsList.length})
            </button>

          </div>
        </div>
      </header>

      {/* MAIN CONTENT CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">

        {/* TAB 1: REGISTER BRANCH INSTITUTES */}
        {activeTab === 'branches' && (
          <div className="space-y-6">

            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-slate-200">
              <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2 mb-4 border-b pb-3">
                <span>🏛️</span> Register New Branch Institute
              </h2>

              <form onSubmit={handleRegisterBranch} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Institute Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. MITM-BILARI"
                      value={newBranch.institute_code}
                      onChange={(e) => setNewBranch({ ...newBranch, institute_code: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold uppercase focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Institute Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. MITM Bilari Campus"
                      value={newBranch.institute_name}
                      onChange={(e) => setNewBranch({ ...newBranch, institute_name: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Account Password *</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={newBranch.password}
                      onChange={(e) => setNewBranch({ ...newBranch, password: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Branch Mobile Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="10 digit mobile"
                      value={newBranch.mobile_no}
                      onChange={(e) => setNewBranch({ ...newBranch, mobile_no: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="branch@institute.com"
                      value={newBranch.email}
                      onChange={(e) => setNewBranch({ ...newBranch, email: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Branch Head Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Dr. R.K. Sharma"
                      value={newBranch.head_name}
                      onChange={(e) => setNewBranch({ ...newBranch, head_name: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Head Qualification</label>
                    <input
                      type="text"
                      placeholder="e.g. M.Tech, Ph.D"
                      value={newBranch.head_qualification}
                      onChange={(e) => setNewBranch({ ...newBranch, head_qualification: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Head Aadhar Number (12 Digits)</label>
                    <input
                      type="text"
                      maxLength={12}
                      placeholder="12 digit Aadhar"
                      value={newBranch.head_aadhar_no}
                      onChange={(e) => setNewBranch({ ...newBranch, head_aadhar_no: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono font-bold focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Head Photo (JPG/PNG &lt;= 200KB)</label>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      onChange={(e) => handlePhotoUpload(e, (url) => setNewBranch({ ...newBranch, head_photo_url: url }))}
                      className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
                    />
                  </div>

                  <div className="sm:col-span-2 md:col-span-3">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Complete Address</label>
                    <input
                      type="text"
                      placeholder="Full campus location address"
                      value={newBranch.address}
                      onChange={(e) => setNewBranch({ ...newBranch, address: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs shadow transition cursor-pointer"
                  >
                    ➕ Register Branch Institute
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  🏛️ Registered Branch Directory ({branchesList.length})
                </h3>
                <button
                  onClick={() => exportToExcel(branchesList, 'Registered_Branches')}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg shadow transition"
                >
                  📥 Export Excel
                </button>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs text-slate-800">
                  <thead className="bg-slate-900 text-white font-semibold">
                    <tr>
                      <th className="p-3">Branch Code</th>
                      <th className="p-3">Institute Name</th>
                      <th className="p-3">Branch Head</th>
                      <th className="p-3">Contact Details</th>
                      <th className="p-3">Address</th>
                      <th className="p-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {branchesList.map((branch) => (
                      <tr key={branch.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-sky-800">{branch.institute_code}</td>
                        <td className="p-3 font-bold text-slate-900">{branch.institute_name}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <img src={branch.head_photo_url || 'https://iili.io/3jruEzl.md.jpg'} alt="Head" className="w-8 h-8 rounded-full object-cover border border-slate-300" />
                            <div>
                              <div className="font-bold">{branch.head_name || 'N/A'}</div>
                              <div className="text-[10px] text-slate-500">{branch.head_qualification}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <div>📞 {branch.mobile_no}</div>
                          <div className="text-slate-500">✉️ {branch.email}</div>
                        </td>
                        <td className="p-3 text-slate-600 max-w-xs truncate">{branch.address}</td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1.5 flex-wrap">
                            <button
                              onClick={() => {
                                setSelectedBranchFilter(branch.institute_code);
                                setActiveTab('queue');
                              }}
                              className="px-2 py-1 bg-sky-100 hover:bg-sky-200 text-sky-800 text-[10px] font-bold rounded border border-sky-300"
                            >
                              👁️ View Records
                            </button>
                            <button
                              onClick={() => setEditingBranch(branch)}
                              className="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 text-[10px] font-bold rounded border border-amber-300"
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => handleDeleteBranchWithData(branch.institute_code)}
                              className="px-2 py-1 bg-rose-100 hover:bg-rose-200 text-rose-800 text-[10px] font-bold rounded border border-rose-300"
                            >
                              🗑️ Delete + Data
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BRANCH SUBMISSIONS & QUEUE */}
        {activeTab === 'queue' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-slate-200 space-y-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                  <span>📥</span> Branch Student Submissions Queue ({studentsQueue.length})
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Assign Roll No & Enrollment No to merge branch students into Central Master Records.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <input
                    type="text"
                    value={queueSearchQuery}
                    onChange={(e) => setQueueSearchQuery(e.target.value)}
                    placeholder="🔍 Search Branch Name, Code, Student..."
                    className="w-full pl-8 pr-8 py-1.5 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-sky-500 bg-slate-50"
                  />
                  {queueSearchQuery && (
                    <button
                      onClick={() => setQueueSearchQuery('')}
                      className="absolute right-2.5 top-1.5 text-slate-400 hover:text-slate-600 text-xs font-bold"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <select
                  value={selectedBranchFilter}
                  onChange={(e) => setSelectedBranchFilter(e.target.value)}
                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-bold bg-white focus:ring-2 focus:ring-sky-500"
                >
                  <option value="ALL">All Branches Queue ({branchesList.length})</option>
                  {branchesList.map((b) => (
                    <option key={b.id} value={b.institute_code}>
                      {b.institute_code} - {b.institute_name}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleBulkAutoAssignMerge}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow transition cursor-pointer flex items-center gap-1.5"
                >
                  🚀 Bulk Auto-Assign & Merge All
                </button>
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-sm">
              <table className="w-full text-left text-xs text-slate-800">
                <thead className="bg-slate-900 text-white font-semibold">
                  <tr>
                    <th className="p-3">Branch Code & Name</th>
                    <th className="p-3">Candidate Name</th>
                    <th className="p-3">Father's Name</th>
                    <th className="p-3">Aadhar Number</th>
                    <th className="p-3">Course Name</th>
                    <th className="p-3 text-center">Current Status</th>
                    <th className="p-3 text-center">Assign & Merge</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {(() => {
                    const filtered = studentsQueue.filter((q) => {
                      const matchesDropdown = selectedBranchFilter === 'ALL' || q.branch_code === selectedBranchFilter;
                      const branchObj = branchesList.find((b) => b.institute_code === q.branch_code);
                      const branchName = branchObj ? branchObj.institute_name : (q.study_center || '');
                      const sq = queueSearchQuery.toLowerCase().trim();

                      const matchesSearch =
                        !sq ||
                        (q.branch_code && q.branch_code.toLowerCase().includes(sq)) ||
                        (branchName && branchName.toLowerCase().includes(sq)) ||
                        (q.student_name && q.student_name.toLowerCase().includes(sq)) ||
                        (q.father_name && q.father_name.toLowerCase().includes(sq)) ||
                        (q.course_name && q.course_name.toLowerCase().includes(sq));

                      return matchesDropdown && matchesSearch;
                    });

                    if (filtered.length === 0) {
                      return (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-slate-500 font-medium">
                            ❌ No branch student submissions found for selected branch / search.
                          </td>
                        </tr>
                      );
                    }

                    return filtered.map((qStudent) => {
                      const branchObj = branchesList.find((b) => b.institute_code === qStudent.branch_code);
                      const branchName = branchObj ? branchObj.institute_name : qStudent.study_center;

                      return (
                        <tr key={qStudent.id} className="hover:bg-slate-50">
                          <td className="p-3">
                            <div className="font-mono font-bold text-sky-800">{qStudent.branch_code}</div>
                            <div className="text-[11px] text-slate-500 truncate max-w-[150px]">{branchName}</div>
                          </td>
                          <td className="p-3 font-bold text-slate-900 uppercase">{qStudent.student_name}</td>
                          <td className="p-3 font-medium uppercase">{qStudent.father_name}</td>
                          <td className="p-3 font-mono font-bold text-amber-800">{qStudent.aadhar_no}</td>
                          <td className="p-3 font-medium">{qStudent.course_name}</td>
                          <td className="p-3 text-center">
                            <span className="px-2.5 py-1 bg-amber-100 text-amber-800 font-bold rounded-full text-[10px] border border-amber-300">
                              ⏳ Not Issued Yet
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => {
                                setAssigningStudent(qStudent);
                                setAssignRoll(String(103800 + studentsList.length + 1));
                                setAssignEnrollment(String(1039954700 + studentsList.length + 1));
                              }}
                              className="px-3 py-1 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg text-[11px] shadow transition cursor-pointer"
                            >
                              ⚡ Issue Roll/Enr & Merge
                            </button>
                          </td>
                        </tr>
                      );
                    });
                  })()}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: STUDENT REGISTRATION */}
        {activeTab === 'students' && (
          <div className="space-y-6">

            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-slate-200">
              <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2 mb-4 border-b pb-3">
                <span>📋</span> Direct Student Admission Form
              </h2>

              <form onSubmit={handleRegisterDirectStudent} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Roll No *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 103803"
                      value={newStudentForm.roll_no}
                      onChange={(e) => setNewStudentForm({ ...newStudentForm, roll_no: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold uppercase focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Enrollment No *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 1039954703"
                      value={newStudentForm.enrollment_no}
                      onChange={(e) => setNewStudentForm({ ...newStudentForm, enrollment_no: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold uppercase focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Document No *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. DN-3765"
                      value={newStudentForm.serial_no}
                      onChange={(e) => setNewStudentForm({ ...newStudentForm, serial_no: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold uppercase focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Course *</label>
                    <input
                      type="text"
                      required
                      value={newStudentForm.course_name}
                      onChange={(e) => setNewStudentForm({ ...newStudentForm, course_name: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Admission Date *</label>
                    <input
                      type="date"
                      required
                      value={newStudentForm.admission_date}
                      onChange={(e) => setNewStudentForm({ ...newStudentForm, admission_date: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Session (e.g. 2025-2027) *</label>
                    <input
                      type="text"
                      required
                      placeholder="2025-2027"
                      value={newStudentForm.session}
                      onChange={(e) => setNewStudentForm({ ...newStudentForm, session: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Student Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Candidate Full Name"
                      value={newStudentForm.student_name}
                      onChange={(e) => setNewStudentForm({ ...newStudentForm, student_name: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold uppercase focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Father's Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Father Full Name"
                      value={newStudentForm.father_name}
                      onChange={(e) => setNewStudentForm({ ...newStudentForm, father_name: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold uppercase focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Mother's Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Mother Full Name"
                      value={newStudentForm.mother_name}
                      onChange={(e) => setNewStudentForm({ ...newStudentForm, mother_name: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold uppercase focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">DOB *</label>
                    <input
                      type="date"
                      required
                      value={newStudentForm.dob}
                      onChange={(e) => setNewStudentForm({ ...newStudentForm, dob: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Qualification *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 12th Pass, Graduate"
                      value={newStudentForm.qualification}
                      onChange={(e) => setNewStudentForm({ ...newStudentForm, qualification: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Mobile No (10 Digits) *</label>
                    <input
                      type="text"
                      required
                      maxLength={10}
                      placeholder="10 digit mobile"
                      value={newStudentForm.mobile_no}
                      onChange={(e) => setNewStudentForm({ ...newStudentForm, mobile_no: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Alt Mobile No (Optional)</label>
                    <input
                      type="text"
                      maxLength={10}
                      placeholder="10 digit optional"
                      value={newStudentForm.alt_mobile_no}
                      onChange={(e) => setNewStudentForm({ ...newStudentForm, alt_mobile_no: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Aadhar No (12 Digits) *</label>
                    <input
                      type="text"
                      required
                      maxLength={12}
                      placeholder="12 digit Aadhar"
                      value={newStudentForm.aadhar_no}
                      onChange={(e) => setNewStudentForm({ ...newStudentForm, aadhar_no: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono font-bold focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Upload Photo (JPG/PNG &lt;= 200KB) *</label>
                    <input
                      type="file"
                      required
                      accept="image/jpeg,image/jpg,image/png"
                      onChange={(e) => handlePhotoUpload(e, (url) => setNewStudentForm({ ...newStudentForm, photo_url: url }))}
                      className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
                    />
                  </div>

                  <div className="sm:col-span-2 md:col-span-3 lg:col-span-4">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Address *</label>
                    <input
                      type="text"
                      required
                      placeholder="Complete residential address"
                      value={newStudentForm.address}
                      onChange={(e) => setNewStudentForm({ ...newStudentForm, address: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow transition cursor-pointer"
                  >
                    ➕ Register Student & Save Record
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b pb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                    📋 Central Master Student Registry ({filteredStudents.length})
                  </h3>
                  <p className="text-xs text-slate-500">Includes all input data fields as columns with sort, search, and delete functions.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <input
                    type="text"
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    placeholder="🔍 Search Name, Roll, Enr, Course..."
                    className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-medium bg-slate-50"
                  />

                  <select
                    value={studentSortBy}
                    onChange={(e) => setStudentSortBy(e.target.value as any)}
                    className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-bold bg-white"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="session">Sort by Session</option>
                    <option value="enrollment">Sort by Enrollment No</option>
                  </select>

                  {selectedStudentIds.length > 0 && (
                    <button
                      onClick={handleDeleteSelectedStudents}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow transition"
                    >
                      🗑️ Delete Selected ({selectedStudentIds.length})
                    </button>
                  )}

                  <button
                    onClick={() => exportToExcel(filteredStudents, 'Student_Master_Records')}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg shadow transition"
                  >
                    📥 Export Excel
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs text-slate-800">
                  <thead className="bg-slate-900 text-white font-semibold">
                    <tr>
                      <th className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={selectedStudentIds.length === filteredStudents.length && filteredStudents.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedStudentIds(filteredStudents.map(s => s.id));
                            else setSelectedStudentIds([]);
                          }}
                        />
                      </th>
                      <th className="p-3">Roll No</th>
                      <th className="p-3">Enrollment No</th>
                      <th className="p-3">Doc No</th>
                      <th className="p-3">Student Name</th>
                      <th className="p-3">Father's Name</th>
                      <th className="p-3">Mother's Name</th>
                      <th className="p-3">Course</th>
                      <th className="p-3">Session</th>
                      <th className="p-3">Admission Date</th>
                      <th className="p-3">DOB</th>
                      <th className="p-3">Qualification</th>
                      <th className="p-3">Mobile No</th>
                      <th className="p-3">Alt Mobile</th>
                      <th className="p-3">Aadhar No</th>
                      <th className="p-3">Photo</th>
                      <th className="p-3">Address</th>
                      <th className="p-3">Center</th>
                      <th className="p-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredStudents.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50">
                        <td className="p-3 text-center">
                          <input
                            type="checkbox"
                            checked={selectedStudentIds.includes(s.id)}
                            onChange={(e) => {
                              if (e.target.checked) setSelectedStudentIds([...selectedStudentIds, s.id]);
                              else setSelectedStudentIds(selectedStudentIds.filter(id => id !== s.id));
                            }}
                          />
                        </td>
                        <td className="p-3 font-mono font-bold text-sky-800">{s.roll_no}</td>
                        <td className="p-3 font-mono font-bold text-slate-900">{s.enrollment_no}</td>
                        <td className="p-3 font-mono text-slate-600">{s.serial_no}</td>
                        <td className="p-3 font-bold text-slate-900 uppercase">{s.student_name}</td>
                        <td className="p-3 font-medium uppercase">{s.father_name}</td>
                        <td className="p-3 text-slate-600 uppercase">{s.mother_name || 'N/A'}</td>
                        <td className="p-3 font-medium">{s.course_name}</td>
                        <td className="p-3 font-bold text-amber-800">{s.session}</td>
                        <td className="p-3">{s.admission_date}</td>
                        <td className="p-3">{s.dob || 'N/A'}</td>
                        <td className="p-3">{s.qualification || 'N/A'}</td>
                        <td className="p-3 font-mono">{s.mobile_no}</td>
                        <td className="p-3 font-mono text-slate-500">{s.alt_mobile_no || '-'}</td>
                        <td className="p-3 font-mono font-bold text-amber-900">{s.aadhar_no}</td>
                        <td className="p-3">
                          <img src={s.photo_url || 'https://iili.io/3jruEzl.md.jpg'} alt="Photo" className="w-8 h-8 rounded object-cover border border-slate-300" />
                        </td>
                        <td className="p-3 text-slate-600 max-w-xs truncate">{s.address}</td>
                        <td className="p-3 text-slate-600 max-w-xs truncate">{s.study_center}</td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => setEditingStudent(s)}
                              className="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 text-[10px] font-bold rounded border border-amber-300"
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => handleDeleteSingleStudent(s.id)}
                              className="px-2 py-1 bg-rose-100 hover:bg-rose-200 text-rose-800 text-[10px] font-bold rounded border border-rose-300"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ID CARD PRINTING (AADHAR SIZE LANDSCAPE WITH 3 LOGOS) */}
        {activeTab === 'idcards' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                  <span>🪪</span> Student ID Card Printing Hub ({filteredIdCards.length})
                </h2>
                <p className="text-xs text-slate-500">
                  Dedicated tab featuring landscape ID cards with 3 header logos, formatted to exact Aadhar size (85.6mm × 53.9mm) when printed.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="text"
                  value={idCardSearch}
                  onChange={(e) => setIdCardSearch(e.target.value)}
                  placeholder="🔍 Search Name, Roll, Branch..."
                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-medium bg-slate-50"
                />

                <select
                  value={idCardSortBy}
                  onChange={(e) => setIdCardSortBy(e.target.value as any)}
                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-bold bg-white"
                >
                  <option value="name">Sort by Name</option>
                  <option value="session">Sort by Session</option>
                  <option value="roll">Sort by Roll No</option>
                </select>

                {selectedIdCardIds.length > 0 && (
                  <button
                    onClick={() => {
                      if (confirm(`Delete ${selectedIdCardIds.length} selected ID card records?`)) {
                        setStudentsList(studentsList.filter(s => !selectedIdCardIds.includes(s.id)));
                        setSelectedIdCardIds([]);
                      }
                    }}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow transition"
                  >
                    🗑️ Delete Selected ({selectedIdCardIds.length})
                  </button>
                )}
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs text-slate-800">
                <thead className="bg-slate-900 text-white font-semibold">
                  <tr>
                    <th className="p-3 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIdCardIds.length === filteredIdCards.length && filteredIdCards.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedIdCardIds(filteredIdCards.map(s => s.id));
                          else setSelectedIdCardIds([]);
                        }}
                      />
                    </th>
                    <th className="p-3">Roll No</th>
                    <th className="p-3">Enrollment No</th>
                    <th className="p-3">Candidate Name</th>
                    <th className="p-3">Father's Name</th>
                    <th className="p-3">Course</th>
                    <th className="p-3">Photo</th>
                    <th className="p-3">Branch / Study Center</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredIdCards.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={selectedIdCardIds.includes(s.id)}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedIdCardIds([...selectedIdCardIds, s.id]);
                            else setSelectedIdCardIds(selectedIdCardIds.filter(id => id !== s.id));
                          }}
                        />
                      </td>
                      <td className="p-3 font-mono font-bold text-sky-800">{s.roll_no}</td>
                      <td className="p-3 font-mono font-bold text-slate-900">{s.enrollment_no}</td>
                      <td className="p-3 font-bold text-slate-900 uppercase">{s.student_name}</td>
                      <td className="p-3 font-medium uppercase">{s.father_name}</td>
                      <td className="p-3 font-medium">{s.course_name}</td>
                      <td className="p-3">
                        <img src={s.photo_url || 'https://iili.io/3jruEzl.md.jpg'} alt="Photo" className="w-8 h-8 rounded object-cover border border-slate-300" />
                      </td>
                      <td className="p-3 text-slate-600 max-w-xs truncate">{s.study_center}</td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setViewingIdCardStudent(s)}
                            className="px-2.5 py-1 bg-sky-100 hover:bg-sky-200 text-sky-800 text-[11px] font-bold rounded border border-sky-300 cursor-pointer"
                          >
                            👁️ View Card
                          </button>
                          <button
                            onClick={() => printIDCard(s)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded shadow transition cursor-pointer"
                          >
                            🖨️ Print Card
                          </button>
                          <button
                            onClick={() => handleDeleteSingleStudent(s.id)}
                            className="px-2 py-1 bg-rose-100 hover:bg-rose-200 text-rose-800 text-[10px] font-bold rounded border border-rose-300"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* MODALS */}

      {/* 1. VIEW ID CARD MODAL (UPDATED LANDSCAPE AADHAR SIZE WITH 3 LOGOS) */}
      {viewingIdCardStudent && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900 text-sm uppercase">👁️ ID Card Preview Modal (Aadhar Size Landscape)</h3>
              <button onClick={() => setViewingIdCardStudent(null)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">✕</button>
            </div>

            {/* ID CARD CONTAINER WITH LANDSCAPE AADHAR SIZE & 3 LOGOS */}
            <div className="p-3 bg-white rounded-xl border-2 border-slate-900 space-y-2 shadow-sm mx-auto" style={{ width: '320px', height: '200px' }}>
              <div className="flex items-center justify-between border-b-2 border-sky-600 pb-1.5">
                <img src="/mitm-logo.png" alt="Logo 1" className="h-6 object-contain" onError={(e: any) => e.target.src='https://iili.io/3jruEzl.md.jpg'} />
                <img src="/manavta-text-logo.png" alt="MANAVTA Text" className="h-5 object-contain" onError={(e: any) => e.target.style.display='none'} />
                <img src="/iso-certified-badge.png" alt="Logo 3" className="h-6 object-contain" onError={(e: any) => e.target.src='https://iili.io/3jruEzl.md.jpg'} />
              </div>

              <div className="flex items-start gap-2.5 pt-1">
                <img src={viewingIdCardStudent.photo_url || 'https://iili.io/3jruEzl.md.jpg'} alt="Student" className="w-14 h-16 object-cover rounded border border-black flex-shrink-0" />
                <div className="text-[10px] leading-tight space-y-1 text-slate-800">
                  <div><span className="font-bold text-sky-700">NAME:</span> <strong className="uppercase">{viewingIdCardStudent.student_name}</strong></div>
                  <div><span className="font-bold text-sky-700">FATHER:</span> {viewingIdCardStudent.father_name}</div>
                  <div><span className="font-bold text-sky-700">ROLL NO:</span> <strong className="font-mono text-slate-900">{viewingIdCardStudent.roll_no}</strong></div>
                  <div><span className="font-bold text-sky-700">ENROLLMENT:</span> <span className="font-mono">{viewingIdCardStudent.enrollment_no}</span></div>
                  <div><span className="font-bold text-sky-700">COURSE:</span> {viewingIdCardStudent.course_name}</div>
                  <div><span className="font-bold text-sky-700">SESSION:</span> {viewingIdCardStudent.session}</div>
                </div>
              </div>

              <div className="flex items-end justify-between border-t pt-1 text-[9px]">
                <div className="truncate max-w-[170px]">
                  <span className="text-slate-500 font-bold">Center:</span> <strong>{viewingIdCardStudent.study_center}</strong>
                </div>
                <div className="text-center">
                  <img src="/authorised-signature.png" className="h-3 object-contain mx-auto" alt="Sig" onError={(e: any) => e.target.style.display='none'} />
                  <div className="font-bold border-t border-black pt-0.5 text-[8px] uppercase">Authorised Signatory</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setViewingIdCardStudent(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-lg"
              >
                Close Preview
              </button>
              <button
                onClick={() => {
                  printIDCard(viewingIdCardStudent);
                  setViewingIdCardStudent(null);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow"
              >
                🖨️ Print Landscape Card
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. QUEUE ASSIGN ROLL & ENROLLMENT MODAL */}
      {assigningStudent && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm uppercase border-b pb-2">⚡ Issue Credentials & Merge to Master Records</h3>

            <div className="text-xs space-y-1 bg-slate-50 p-3 rounded-lg border">
              <div><strong>Student Name:</strong> {assigningStudent.student_name}</div>
              <div><strong>Father Name:</strong> {assigningStudent.father_name}</div>
              <div><strong>Branch Code:</strong> {assigningStudent.branch_code}</div>
              <div><strong>Course:</strong> {assigningStudent.course_name}</div>
            </div>

            <form onSubmit={handleAssignSingleStudent} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Assign Roll No *</label>
                <input
                  type="text"
                  required
                  value={assignRoll}
                  onChange={(e) => setAssignRoll(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Assign Enrollment No *</label>
                <input
                  type="text"
                  required
                  value={assignEnrollment}
                  onChange={(e) => setAssignEnrollment(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold uppercase"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAssigningStudent(null)}
                  className="px-4 py-2 bg-slate-200 text-slate-700 text-xs font-bold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 text-white text-xs font-bold rounded-lg shadow"
                >
                  Issue & Merge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. EDIT STUDENT MODAL */}
      {editingStudent && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-slate-900 text-sm uppercase">✏️ Edit Student Master Record</h3>
              <button onClick={() => setEditingStudent(null)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleUpdateStudent} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold">Student Name</label>
                  <input
                    type="text"
                    value={editingStudent.student_name}
                    onChange={(e) => setEditingStudent({ ...editingStudent, student_name: e.target.value })}
                    className="w-full px-2 py-1.5 border rounded font-bold uppercase"
                  />
                </div>
                <div>
                  <label className="font-bold">Father's Name</label>
                  <input
                    type="text"
                    value={editingStudent.father_name}
                    onChange={(e) => setEditingStudent({ ...editingStudent, father_name: e.target.value })}
                    className="w-full px-2 py-1.5 border rounded font-bold uppercase"
                  />
                </div>
                <div>
                  <label className="font-bold">Roll No</label>
                  <input
                    type="text"
                    value={editingStudent.roll_no}
                    onChange={(e) => setEditingStudent({ ...editingStudent, roll_no: e.target.value })}
                    className="w-full px-2 py-1.5 border rounded font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold">Enrollment No</label>
                  <input
                    type="text"
                    value={editingStudent.enrollment_no}
                    onChange={(e) => setEditingStudent({ ...editingStudent, enrollment_no: e.target.value })}
                    className="w-full px-2 py-1.5 border rounded font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold">Course Name</label>
                  <input
                    type="text"
                    value={editingStudent.course_name}
                    onChange={(e) => setEditingStudent({ ...editingStudent, course_name: e.target.value })}
                    className="w-full px-2 py-1.5 border rounded"
                  />
                </div>
                <div>
                  <label className="font-bold">Session</label>
                  <input
                    type="text"
                    value={editingStudent.session}
                    onChange={(e) => setEditingStudent({ ...editingStudent, session: e.target.value })}
                    className="w-full px-2 py-1.5 border rounded"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button type="button" onClick={() => setEditingStudent(null)} className="px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-sky-600 text-white font-bold rounded shadow">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}