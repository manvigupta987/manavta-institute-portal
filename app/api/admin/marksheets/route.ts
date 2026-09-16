import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const instituteCode = searchParams.get('instituteCode');
    const enrollmentNo = searchParams.get('enrollmentNo');

    let query = supabase.from('marksheets').select('*').order('created_at', { ascending: false });

    if (enrollmentNo) {
      query = query.eq('enrollment_no', enrollmentNo);
    } else if (instituteCode) {
      query = query.eq('institute_code', instituteCode);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({ marksheets: data || [] });
  } catch (err: any) {
    return NextResponse.json({ message: err?.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (Array.isArray(body.marksheets)) {
      const formatted = body.marksheets.map((m: any) => ({
        institute_code: m.instituteCode,
        enrollment_no: m.enrollmentNo,
        student_name: m.studentName,
        course_name: m.courseName,
        exam_session: m.examSession,
        semester_year: m.semesterYear,
        subjects: m.subjects,
        total_max_marks: m.totalMaxMarks,
        total_obtained_marks: m.totalObtainedMarks,
        percentage: m.percentage,
        result_status: m.resultStatus || 'PASS',
      }));

      const { data, error } = await supabase.from('marksheets').insert(formatted).select();

      if (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, count: data?.length || 0 });
    }

    const {
      instituteCode,
      enrollmentNo,
      studentName,
      courseName,
      examSession,
      semesterYear,
      subjects,
      totalMaxMarks,
      totalObtainedMarks,
      percentage,
      resultStatus,
    } = body;

    const { data, error } = await supabase
      .from('marksheets')
      .insert([
        {
          institute_code: instituteCode || 'MITM',
          enrollment_no: enrollmentNo,
          student_name: studentName,
          course_name: courseName,
          exam_session: examSession,
          semester_year: semesterYear,
          subjects: subjects,
          total_max_marks: totalMaxMarks,
          total_obtained_marks: totalObtainedMarks,
          percentage: percentage,
          result_status: resultStatus || 'PASS',
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, marksheet: data });
  } catch (err: any) {
    return NextResponse.json({ message: err?.message || 'Server error' }, { status: 500 });
  }
}
