import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// GET: Fetch all registered students for Admin Table
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase Error:', error);
      return NextResponse.json({ message: 'Error fetching students list' }, { status: 500 });
    }

    return NextResponse.json({ students: data || [] });
  } catch (err) {
    console.error('Server Error:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// POST: Insert or Update Single Student Admission Details (Full Extended Fields)
export async function POST(request: Request) {
  try {
    const studentData = await request.json();

    if (!studentData.enrollment_no || !studentData.student_name || !studentData.course_name) {
      return NextResponse.json(
        { message: 'Enrollment No, Student Name, and Course Name are required fields.' },
        { status: 400 }
      );
    }

    // Upsert student record into Supabase
    const { data, error } = await supabase
      .from('students')
      .upsert(
        {
          enrollment_no: studentData.enrollment_no.trim(),
          roll_no: studentData.roll_no || null,
          student_name: studentData.student_name.trim(),
          father_name: studentData.father_name.trim(),
          mother_name: studentData.mother_name || null,
          course_name: studentData.course_name.trim(),
          admission_date: studentData.admission_date || '11.04.2025',
          dob: studentData.dob || null,
          mobile_no: studentData.mobile_no || null,
          alt_mobile_no: studentData.alt_mobile_no || null,
          photo_url: studentData.photo_url || null,
          aadhar_no: studentData.aadhar_no || null,
          qualification: studentData.qualification || null,
          address: studentData.address || null,
          institute_name: studentData.institute_name || 'MITM',
        },
        { onConflict: 'enrollment_no' }
      )
      .select();

    if (error) {
      console.error('Supabase Upsert Error:', error);
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Student details saved successfully', student: data });
  } catch (err) {
    console.error('Server Error:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
