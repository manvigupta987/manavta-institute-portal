import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(request: Request) {
  try {
    const { studentName, dob } = await request.json();

    if (!studentName || !dob) {
      return NextResponse.json(
        { message: 'Both Student Name and Date of Birth are required.' },
        { status: 400 }
      );
    }

    // Query Supabase for student matching Name (case-insensitive) and DOB
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .ilike('student_name', studentName.trim())
      .eq('dob', dob.trim())
      .maybeSingle();

    if (error) {
      console.error('Supabase Error:', error);
      return NextResponse.json(
        { message: 'Database error occurred' },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { message: 'No student found matching this Name and Date of Birth.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ student: data });
  } catch (err) {
    console.error('Server Error:', err);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
