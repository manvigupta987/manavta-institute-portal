import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

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

// POST: Insert or Update Single Student Admission Details (All Compulsory except alt_mobile_no)
export async function POST(request: Request) {
  try {
    const studentData = await request.json();

    // Check required fields (everything except alt_mobile_no)
    const compulsory = [
      'enrollment_no',
      'roll_no',
      'student_name',
      'father_name',
      'mother_name',
      'course_name',
      'admission_date',
      'dob',
      'mobile_no',
      'photo_url',
      'aadhar_no',
      'qualification',
      'address',
      'institute_name'
    ];

    const missingFields = compulsory.filter(f => !studentData[f] || !studentData[f].toString().trim());

    if (missingFields.length > 0) {
      return NextResponse.json(
        { message: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Upsert student record into Supabase
    const { data, error } = await supabase
      .from('students')
      .upsert(
        {
          enrollment_no: studentData.enrollment_no.trim(),
          roll_no: studentData.roll_no.trim(),
          student_name: studentData.student_name.trim(),
          father_name: studentData.father_name.trim(),
          mother_name: studentData.mother_name.trim(),
          course_name: studentData.course_name.trim(),
          admission_date: studentData.admission_date.trim(),
          dob: studentData.dob.trim(),
          mobile_no: studentData.mobile_no.trim(),
          alt_mobile_no: studentData.alt_mobile_no ? studentData.alt_mobile_no.trim() : null, // OPTIONAL
          photo_url: studentData.photo_url.trim(),
          aadhar_no: studentData.aadhar_no.trim(),
          qualification: studentData.qualification.trim(),
          address: studentData.address.trim(),
          institute_name: studentData.institute_name.trim(),
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
