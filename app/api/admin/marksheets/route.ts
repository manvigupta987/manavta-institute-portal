import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// GET: Fetch marksheets
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const enrollmentNo = searchParams.get('enrollmentNo');

    let query = supabase.from('marksheets').select('*').order('created_at', { ascending: false });

    if (enrollmentNo) {
      query = query.eq('enrollment_no', enrollmentNo);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase Error:', error);
      return NextResponse.json({ message: 'Error fetching marksheets' }, { status: 500 });
    }

    return NextResponse.json({ marksheets: data || [] });
  } catch (err) {
    console.error('Server Error:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// POST: Insert or Update Student Marksheet
export async function POST(request: Request) {
  try {
    const markData = await request.json();

    if (!markData.enrollment_no || !markData.student_name || !markData.course_name) {
      return NextResponse.json(
        { message: 'Enrollment No, Student Name, and Course Name are required.' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('marksheets')
      .insert({
        enrollment_no: markData.enrollment_no.trim(),
        roll_no: markData.roll_no || null,
        student_name: markData.student_name.trim(),
        course_name: markData.course_name.trim(),
        exam_session: markData.exam_session || '2025-2026',
        semester_year: markData.semester_year || '1st Year',
        subjects: markData.subjects || [],
        total_max_marks: markData.total_max_marks || 0,
        total_obtained_marks: markData.total_obtained_marks || 0,
        percentage: markData.percentage || 0,
        grade: markData.grade || 'A',
        result_status: markData.result_status || 'PASS',
        issue_date: markData.issue_date || '20.05.2025'
      })
      .select();

    if (error) {
      console.error('Supabase Marksheet Error:', error);
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Marksheet saved successfully', marksheet: data });
  } catch (err) {
    console.error('Server Error:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
