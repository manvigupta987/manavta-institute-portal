import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Same URL + anon key jo supabaseClient.js mein use ki thi
const supabaseUrl = 'https://mhpmchzegdgotzsbdwuw.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ocG1jaHplZ2Rnb3R6c2Jkd3V3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzOTUwNzAsImV4cCI6MjEwNDk3MTA3MH0.Fj4FDEIVFQiL04aKA3lnc8OkgnhU7enT-R7YGNKGZs4'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Aapke students table ke columns ke hisab se data map ho raha hai
    const studentData = {
      enrollment_no: body.enrollment_no,
      student_name: body.student_name,
      father_name: body.father_name,
      mother_name: body.mother_name || null,
      course_name: body.course_name,
      admission_date: body.admission_date,
      dob: body.dob || null,
      photo_url: body.photo_url || null,
      roll_no: body.roll_no || null,
      mobile_no: body.mobile_no || null,
      alt_mobile_no: body.alt_mobile_no || null,
      aadhar_no: body.aadhar_no || null,
      qualification: body.qualification || null,
      address: body.address || null,
      serial_no: body.serial_no || null,
      session: body.session || null,
      status: body.status || 'APPROVED',
      study_center: body.study_center || 'MITM',
      branch_code: body.branch_code || null,
    }

    // Required fields check
    if (
      !studentData.enrollment_no ||
      !studentData.student_name ||
      !studentData.father_name ||
      !studentData.course_name ||
      !studentData.admission_date
    ) {
      return NextResponse.json(
        { error: 'Required fields missing: enrollment_no, student_name, father_name, course_name, admission_date' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('students')
      .insert([studentData])
      .select()

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (err: any) {
    console.error('Server error:', err)
    return NextResponse.json({ error: err.message || 'Something went wrong' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Something went wrong' }, { status: 500 })
  }
}