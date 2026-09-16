import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(request: Request) {
  try {
    const { instituteCode, password } = await request.json();

    if (!instituteCode || !password) {
      return NextResponse.json(
        { message: 'Institute Code and Password are required' },
        { status: 400 }
      );
    }

    // Default Fallback Demo Account
    if (instituteCode === 'MITM' && password === 'admin123') {
      return NextResponse.json({
        success: true,
        institute: {
          institute_code: 'MITM',
          institute_name: 'Manavta Head Campus',
          email: 'head@manavtainstitute.com',
        },
      });
    }

    // Query institutes table
    const { data: institute, error } = await supabase
      .from('institutes')
      .select('*')
      .eq('institute_code', instituteCode)
      .maybeSingle();

    if (error) {
      console.error('Login Supabase Error:', error);
      return NextResponse.json(
        { message: 'Database error' },
        { status: 500 }
      );
    }

    if (!institute || institute.password_hash !== password) {
      return NextResponse.json(
        { message: 'Invalid Institute Code or Password' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      institute: {
        institute_code: institute.institute_code,
        institute_name: institute.institute_name,
        email: institute.email,
      },
    });
  } catch (err: any) {
    console.error('Server Login Error:', err);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
