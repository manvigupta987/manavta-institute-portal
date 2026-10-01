// Shared print templates for Marksheet + Certificate
// Save as: lib/print-templates.ts

export interface PrintSubject {
  paper_code: string;
  paper_name: string;
  max_marks: number;
  theory: number;
  practical: number;
  total_marks: number;
}

export interface PrintMarksheet {
  roll_no: string;
  enrollment_no: string;
  student_name: string;
  father_name: string;
  mother_name?: string;
  dob?: string;
  study_center: string;
  session: string;
  serial_no: string;
  photo_url?: string;
  course_name: string;
  subjects: PrintSubject[];
  grand_total_obtained: number;
  grand_total_max: number;
  percentage: number;
  grade: string;
  issue_date: string;
}

export interface PrintCertificate {
  roll_no: string;
  enrollment_no: string;
  student_name: string;
  father_name: string;
  course_name: string;
  start_date: string;
  end_date: string;
  grade: string;
  issue_date: string;
  serial_no: string;
  photo_url?: string;
  study_center: string;
  des?: string;
  dob?: string;
}

export interface PrintOptions {
  // Space kept blank at top for the pre-printed letterhead (default 48mm)
  topMarginMm?: number;
  // Print an institute heading on top (for public downloads without letterhead)
  showHeader?: boolean;
}

const PLACEHOLDER_PHOTO = 'https://iili.io/3jruEzl.md.jpg';

const esc = (v: any) =>
  String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));

// 2003-05-12  ->  12.05.2003  (other formats are returned as-is)
export const formatDate = (d?: string) => {
  if (!d) return '';
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(d);
  return m ? `${m[3]}.${m[2]}.${m[1]}` : d;
};

// SAME QR details for Marksheet and Certificate
export const buildQrUrl = (
  r: { student_name: string; roll_no: string; course_name: string; dob?: string; issue_date: string },
  size = 120
) => {
  const text = `Verified\nName: ${r.student_name}\nRoll No: ${r.roll_no}\nCourse: ${r.course_name}\nDOB: ${
    formatDate(r.dob) || 'N/A'
  }\nDate of Issue: ${formatDate(r.issue_date)}`;
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`;
};

const headerHtml = (show?: boolean) =>
  show
    ? `<div class="inst-head">MANAVTA INSTITUTE OF TECHNOLOGY &amp; MANAGEMENT</div>`
    : '';

// =========================================================================
// MARKSHEET
// =========================================================================
export const printMarksheet = (m: PrintMarksheet, opts: PrintOptions = {}, existingWin?: Window | null) => {
  const win = existingWin || window.open('', '_blank');
  if (!win) {
    alert('Popup blocker active! Please allow popups for printing.');
    return;
  }

  const top = opts.topMarginMm ?? 48;
  const n = m.subjects.length;
  // Fewer subjects => taller rows, so the sheet always fills the page
  const rowPad = n <= 4 ? 18 : n <= 6 ? 14 : n <= 8 ? 10 : 7;
  const qrUrl = buildQrUrl(m, 160);

  const rows = m.subjects
    .map(
      (s) => `
      <tr>
        <td class="mono">${esc(s.paper_code)}</td>
        <td class="left">${esc(s.paper_name)}</td>
        <td>${esc(s.max_marks)}</td>
        <td>${esc(s.theory)}</td>
        <td>${esc(s.practical)}</td>
        <td class="bold">${esc(s.total_marks)}</td>
      </tr>`
    )
    .join('');

  win.document.write(`
<!DOCTYPE html>
<html>
<head>
<title>Marksheet - ${esc(m.student_name)}</title>
<style>
  * { color: #000 !important; }
  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background: #fff; }
  .a4-page { width: 210mm; height: 296mm; margin: 0 auto; padding: ${top}mm 15mm 12mm 15mm; box-sizing: border-box; display: flex; flex-direction: column; overflow: hidden; }
  .inst-head { text-align: center; font-size: 17px; font-weight: 900; letter-spacing: 1px; margin-bottom: 10px; }
  .doc-title { font-size: 19px; font-weight: 900; text-align: center; margin-bottom: 18px; text-decoration: underline; text-transform: uppercase; letter-spacing: 1.5px; }
  .student-info { display: flex; justify-content: space-between; gap: 16px; margin-bottom: 22px; border: 1.5px solid #000; padding: 14px; }
  .info-grid { flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 11px 16px; font-size: 12.5px; line-height: 1.5; }
  .info-item { display: flex; }
  .info-lbl { font-weight: 800; width: 120px; flex-shrink: 0; text-transform: uppercase; }
  .info-val { font-weight: 700; text-transform: uppercase; }
  .photo-box { text-align: center; flex-shrink: 0; }
  .doc-no { font-size: 10.5px; font-weight: 800; margin-bottom: 5px; }
  .photo { width: 100px; height: 122px; border: 1.5px solid #000; object-fit: cover; }
  table.marks { width: 100%; border-collapse: collapse; margin-bottom: 22px; font-size: 12.5px; }
  table.marks th, table.marks td { border: 1px solid #000; padding: ${rowPad}px 8px; text-align: center; }
  table.marks th { font-weight: 800; text-transform: uppercase; padding: 12px 8px; }
  table.marks td.left, table.marks th.left { text-align: left; padding-left: 10px; }
  table.marks td.left { font-weight: 600; text-transform: uppercase; }
  .mono { font-family: monospace; font-weight: 700; }
  .bold { font-weight: 800; }
  .summary { display: flex; justify-content: space-between; align-items: center; border: 2px solid #000; padding: 14px 18px; font-weight: 800; font-size: 13.5px; }
  .spacer { flex: 1; }
  .footer { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 20px; }
  .sign-block { text-align: center; width: 170px; }
  .sign-img { height: 38px; object-fit: contain; margin-bottom: 4px; }
  .sign-title { font-size: 10px; font-weight: 800; text-transform: uppercase; border-top: 1.5px solid #000; padding-top: 4px; }
  .legend { border-top: 1px solid #000; padding-top: 7px; margin-top: 20px; font-size: 9px; text-align: center; line-height: 1.5; }
  @page { size: A4; margin: 0; }
</style>
</head>
<body>
<div class="a4-page">
  ${headerHtml(opts.showHeader)}
  <div class="doc-title">STATEMENT OF MARKS</div>

  <div class="student-info">
    <div class="info-grid">
      <div class="info-item"><span class="info-lbl">PROGRAMME:</span><span class="info-val">${esc(m.course_name)}</span></div>
      <div class="info-item"><span class="info-lbl">SESSION:</span><span class="info-val">${esc(m.session)}</span></div>
      <div class="info-item"><span class="info-lbl">ROLL NO:</span><span class="info-val">${esc(m.roll_no)}</span></div>
      <div class="info-item"><span class="info-lbl">ENROLLMENT NO:</span><span class="info-val">${esc(m.enrollment_no)}</span></div>
      <div class="info-item"><span class="info-lbl">CANDIDATE NAME:</span><span class="info-val">${esc(m.student_name)}</span></div>
      <div class="info-item"><span class="info-lbl">FATHER'S NAME:</span><span class="info-val">${esc(m.father_name)}</span></div>
      <div class="info-item"><span class="info-lbl">MOTHER'S NAME:</span><span class="info-val">${esc(m.mother_name || 'N/A')}</span></div>
      <div class="info-item"><span class="info-lbl">DATE OF BIRTH:</span><span class="info-val">${esc(formatDate(m.dob) || 'N/A')}</span></div>
      <div class="info-item" style="grid-column: span 2;"><span class="info-lbl">STUDY CENTER:</span><span class="info-val">${esc(m.study_center)}</span></div>
    </div>
    <div class="photo-box">
      <div class="doc-no">DOC NO: ${esc(m.serial_no)}</div>
      <img src="${m.photo_url || PLACEHOLDER_PHOTO}" class="photo" alt="Student Photo" />
    </div>
  </div>

  <table class="marks">
    <thead>
      <tr>
        <th style="width:15%;">PAPER CODE</th>
        <th class="left" style="width:39%;">EXAM / PAPER NAME</th>
        <th style="width:12%;">MAX MARKS</th>
        <th style="width:11%;">THEORY (100)</th>
        <th style="width:12%;">PRACTICAL (50)</th>
        <th style="width:11%;">TOTAL</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>

  <div class="summary">
    <div>GRAND TOTAL: ${esc(m.grand_total_obtained)} / ${esc(m.grand_total_max)}</div>
    <div>PERCENTAGE: ${esc(m.percentage)}%</div>
    <div>FINAL GRADE: ${esc(m.grade)}</div>
  </div>

  <div class="spacer"></div>

  <div class="footer">
    <div class="sign-block">
      <img src="/authorised-signature.png" class="sign-img" onerror="this.style.display='none'" />
      <div class="sign-title">DIRECTOR (MITM)</div>
    </div>
    <div style="text-align:center;">
      <img src="${qrUrl}" style="width:90px;height:90px;" alt="QR Code" />
      <div style="font-size:9px;font-weight:800;margin-top:4px;">SCAN TO VERIFY</div>
    </div>
    <div class="sign-block">
      <div style="font-size:11px;font-weight:800;margin-bottom:28px;">DATE: ${esc(formatDate(m.issue_date))}</div>
      <div class="sign-title">CHIEF EXAM CONTROLLER</div>
    </div>
  </div>

  <div class="legend">
    <strong>GRADING SCALE LEGEND:</strong> Ex: 90% &amp; Above | A: 80% - 89% | B: 70% - 79% | C: 60% - 69% | D: 40% - 59% | F: Below 40% (Fail)
  </div>
</div>
<script>
  window.onload = function () { window.print(); window.close(); };
</script>
</body>
</html>`);
  win.document.close();
};

// =========================================================================
// CERTIFICATE
// =========================================================================
export const printCertificate = (
  c: PrintCertificate,
  awardMatter: string,
  opts: PrintOptions = {},
  existingWin?: Window | null
) => {
  const win = existingWin || window.open('', '_blank');
  if (!win) {
    alert('Popup blocker active! Please allow popups for printing.');
    return;
  }

  const top = opts.topMarginMm ?? 48;
  const qrUrl = buildQrUrl(c, 170);

  win.document.write(`
<!DOCTYPE html>
<html>
<head>
<title>Certificate - ${esc(c.student_name)}</title>
<style>
  * { color: #000 !important; }
  body { font-family: 'Georgia', serif; margin: 0; padding: 0; background: #fff; }
  .a4-page { width: 210mm; height: 296mm; margin: 0 auto; padding: ${top}mm 20mm 16mm 20mm; box-sizing: border-box; display: flex; flex-direction: column; overflow: hidden; }
  .inst-head { text-align: center; font-family: sans-serif; font-size: 18px; font-weight: 900; letter-spacing: 1px; margin-bottom: 10px; }
  .top-meta { display: flex; justify-content: space-between; align-items: flex-start; font-family: sans-serif; font-size: 14px; line-height: 1.9; }
  .doc-no { font-weight: 900; font-size: 15px; }
  .cert-photo { width: 110px; height: 135px; border: 2px solid #000; object-fit: cover; }
  .middle { flex: 1; display: flex; flex-direction: column; justify-content: space-around; padding: 10px 0; }
  .cert-title { text-align: center; font-size: 32px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; font-family: sans-serif; text-decoration: underline; }
  .body-text { font-size: 19px; line-height: 2.7; text-align: justify; padding: 0 8px; }
  .body-text strong { text-decoration: underline; font-weight: 900; }
  .footer { display: flex; justify-content: space-between; align-items: flex-end; font-family: sans-serif; }
  @page { size: A4; margin: 0; }
</style>
</head>
<body>
<div class="a4-page">
  ${headerHtml(opts.showHeader)}
  <div class="top-meta">
    <div>
      <div class="doc-no">Doc. Serial No: ${esc(c.serial_no)}</div>
      <div>Enrollment No: <strong>${esc(c.enrollment_no)}</strong></div>
      <div>Roll No: <strong>${esc(c.roll_no)}</strong></div>
    </div>
    <div style="text-align:right;">
      <img src="${c.photo_url || PLACEHOLDER_PHOTO}" class="cert-photo" alt="Candidate Photo" />
    </div>
  </div>

  <div class="middle">
    <div class="cert-title">CERTIFICATE OF COMPLETION</div>
    <div class="body-text">
      ${esc(awardMatter)}<br/><br/>
      This is to certify that <strong>${esc(c.student_name)}</strong> ${esc(c.des || 'S/O')} <strong>${esc(c.father_name)}</strong> has successfully completed the <strong>${esc(c.course_name)}</strong> conducted by <strong>${esc(c.study_center || 'MITM Bilari')}</strong> during the period from <strong>${esc(formatDate(c.start_date))}</strong> to <strong>${esc(formatDate(c.end_date))}</strong>. The candidate has satisfied all requirements and has been awarded Grade <strong style="font-size:22px;">'${esc(c.grade)}'</strong>.
    </div>
  </div>

  <div class="footer">
    <div style="text-align:center;">
      <img src="${qrUrl}" style="width:105px;height:105px;" alt="QR Code" />
      <div style="font-size:10px;font-weight:800;margin-top:4px;">SCAN TO VERIFY</div>
    </div>
    <div style="text-align:center;">
      <div style="font-size:14px;font-weight:bold;margin-bottom:6px;">Date of Issue: ${esc(formatDate(c.issue_date))}</div>
      <div style="border-top:2px solid #000;width:210px;margin-top:48px;font-weight:bold;font-size:13px;text-transform:uppercase;padding-top:4px;">
        Authorised Signatory
      </div>
    </div>
  </div>
</div>
<script>
  window.onload = function () { window.print(); window.close(); };
</script>
</body>
</html>`);
  win.document.close();
};

// =========================================================================
// Shared 3-logo header (MITM / MANAVTA / ISO) used by the public ID Card
// and Result Card prints, matching the institute's standard sample layout.
// =========================================================================
const logoHeaderHtml = () => `
  <div class="logo-head">
    <img src="/mitm-logo.png" class="logo-mitm" onerror="this.style.display='none'" alt="MITM" />
    <img src="/manavta-text-logo.png" class="logo-manavta" onerror="this.style.display='none'" alt="MANAVTA" />
    <img src="/iso-certified-badge.png" class="logo-iso" onerror="this.style.display='none'" alt="ISO" />
  </div>
`;

const logoHeadCss = `
  .logo-head { display: flex; align-items: center; justify-content: space-between; gap: 14px; margin-bottom: 26px; }
  .logo-mitm { height: 60px; object-fit: contain; }
  .logo-manavta { height: 42px; object-fit: contain; flex: 1; }
  .logo-iso { height: 55px; object-fit: contain; }
`;

// =========================================================================
// PUBLIC ID CARD (Verify Registration) - identity fields only, no marks
// =========================================================================
export interface PrintIdentity {
  roll_no: string;
  enrollment_no: string;
  student_name: string;
  father_name: string;
  course_name: string;
  study_center: string;
  photo_url?: string;
}

export const printIdentityCard = (s: PrintIdentity, existingWin?: Window | null) => {
  const win = existingWin || window.open('', '_blank');
  if (!win) {
    alert('Popup blocker active! Please allow popups for printing.');
    return;
  }

  win.document.write(`
<!DOCTYPE html>
<html>
<head>
<title>Student Verification - ${esc(s.student_name)}</title>
<style>
  * { color: #000 !important; }
  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background: #fff; }
  .a4-page { width: 210mm; min-height: 150mm; margin: 0 auto; padding: 20mm; box-sizing: border-box; }
  ${logoHeadCss}
  .main { display: flex; justify-content: space-between; gap: 30px; align-items: flex-start; }
  .fields { flex: 1; font-size: 17px; line-height: 2.4; }
  .fields .row { display: flex; }
  .fields .lbl { font-weight: 800; width: 180px; flex-shrink: 0; }
  .fields .val { font-weight: 600; }
  .photo { width: 130px; height: 155px; border: 2px solid #000; object-fit: cover; flex-shrink: 0; }
  @page { size: A4; margin: 0; }
</style>
</head>
<body>
<div class="a4-page">
  ${logoHeaderHtml()}
  <div class="main">
    <div class="fields">
      <div class="row"><span class="lbl">Roll No:</span><span class="val">${esc(s.roll_no)}</span></div>
      <div class="row"><span class="lbl">Enrollment No:</span><span class="val">${esc(s.enrollment_no)}</span></div>
      <div class="row"><span class="lbl">Name:</span><span class="val">${esc(s.student_name)}</span></div>
      <div class="row"><span class="lbl">Fathers Name:</span><span class="val">${esc(s.father_name)}</span></div>
      <div class="row"><span class="lbl">Course:</span><span class="val">${esc(s.course_name)}</span></div>
      <div class="row"><span class="lbl">Study Center:</span><span class="val">${esc(s.study_center)}</span></div>
    </div>
    <img src="${s.photo_url || PLACEHOLDER_PHOTO}" class="photo" alt="Student Photo" />
  </div>
</div>
<script>
  window.onload = function () { window.print(); window.close(); };
</script>
</body>
</html>`);
  win.document.close();
};

// =========================================================================
// PUBLIC RESULT CARD - Pass/Fail + Grade ONLY. This is the ONLY thing a
// student can ever view or print from the public result page. There is NO
// student-facing access to the subject-wise Marksheet or the Certificate -
// those stay strictly inside the Admin Dashboard.
// =========================================================================
export interface PrintResultSummary {
  roll_no: string;
  enrollment_no: string;
  student_name: string;
  father_name: string;
  course_name: string;
  percentage: number;
  grade: string;
  result: 'PASS' | 'FAIL';
  study_center: string;
  photo_url?: string;
}

export const printResultCard = (r: PrintResultSummary, existingWin?: Window | null) => {
  const win = existingWin || window.open('', '_blank');
  if (!win) {
    alert('Popup blocker active! Please allow popups for printing.');
    return;
  }

  win.document.write(`
<!DOCTYPE html>
<html>
<head>
<title>Result - ${esc(r.student_name)}</title>
<style>
  * { color: #000 !important; }
  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background: #fff; }
  .a4-page { width: 210mm; min-height: 160mm; margin: 0 auto; padding: 20mm; box-sizing: border-box; }
  ${logoHeadCss}
  .main { display: flex; justify-content: space-between; gap: 30px; align-items: flex-start; }
  .fields { flex: 1; font-size: 17px; line-height: 2.4; }
  .fields .row { display: flex; }
  .fields .lbl { font-weight: 800; width: 180px; flex-shrink: 0; }
  .fields .val { font-weight: 600; }
  .fields .val.strong { font-weight: 900; }
  .photo { width: 130px; height: 155px; border: 2px solid #000; object-fit: cover; flex-shrink: 0; }
  @page { size: A4; margin: 0; }
</style>
</head>
<body>
<div class="a4-page">
  ${logoHeaderHtml()}
  <div class="main">
    <div class="fields">
      <div class="row"><span class="lbl">Roll No:</span><span class="val">${esc(r.roll_no)}</span></div>
      <div class="row"><span class="lbl">Enrollment No:</span><span class="val">${esc(r.enrollment_no)}</span></div>
      <div class="row"><span class="lbl">Name:</span><span class="val">${esc(r.student_name)}</span></div>
      <div class="row"><span class="lbl">Fathers Name:</span><span class="val">${esc(r.father_name)}</span></div>
      <div class="row"><span class="lbl">Course:</span><span class="val">${esc(r.course_name)}</span></div>
      <div class="row"><span class="lbl">Percentage:</span><span class="val">${esc(r.percentage)}%</span></div>
      <div class="row"><span class="lbl">Grade:</span><span class="val strong">${esc(r.grade)}</span></div>
      <div class="row"><span class="lbl">Result:</span><span class="val strong">${esc(r.result === 'PASS' ? 'Pass' : 'Fail')}</span></div>
      <div class="row"><span class="lbl">Study Center:</span><span class="val">${esc(r.study_center)}</span></div>
    </div>
    <img src="${r.photo_url || PLACEHOLDER_PHOTO}" class="photo" alt="Student Photo" />
  </div>
</div>
<script>
  window.onload = function () { window.print(); window.close(); };
</script>
</body>
</html>`);
  win.document.close();
};