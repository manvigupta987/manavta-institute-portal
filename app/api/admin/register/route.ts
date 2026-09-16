import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(request: Request) {
  try {
    const { instituteCode, instituteName, email, mobileNo, password } = await request.json();

    if (!instituteCode || !instituteName || !email || !mobileNo || !password) {
      return NextResponse.json(
        { message: 'All fields are required.' },
        { status: 400 }
      );
    }

    // Check if institute_code or email already exists
    const { data: existingCode } = await supabase
      .from('institutes')
      .select('id')
      .eq('institute_code', instituteCode)
      .maybeSingle();

    if (existingCode) {
      return NextResponse.json(
        { message: `Institute Code '${instituteCode}' is already registered. Please use a unique code.` },
        { status: 400 }
      );
    }

    const { data: existingEmail } = await supabase
      .from('institutes')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existingEmail) {
      return NextResponse.json(
        { message: `Email '${email}' is already registered.` },
        { status: 400 }
      );
    }

    // Insert new institute record
    const { data: newInstitute, error } = await supabase
      .from('institutes')
      .insert([
        {
          institute_code: instituteCode,
          institute_name: instituteName,
          email: email,
          mobile_no: mobileNo,
          password_hash: password, // In production, hash with bcrypt
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Registration Insert Error:', error);
      return NextResponse.json(
        { message: 'Failed to create institute account. ' + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Institute registered successfully.',
      institute: {
        instituteCode: newInstitute.institute_code,
        instituteName: newInstitute.institute_name,
        email: newInstitute.email,
      },
    });
  } catch (err: any) {
    console.error('Server Registration Error:', err);
    return NextResponse.json(
      { message: 'Internal server error: ' + (err?.message || '') },
      { status: 500 }
    );
  }
}
