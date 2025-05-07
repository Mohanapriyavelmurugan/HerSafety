import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hersafety_db',
};

// Helper function to format date and time
function formatDateTime(isoDate: string) {
  const date = new Date(isoDate);
  return {
    date: date.toISOString().split('T')[0] // YYYY-MM-DD
  };
}

// GET /api/incidents - Fetch all incidents
export async function GET() {
  try {
    console.log('Fetching all incidents...');
    const connection = await mysql.createConnection(dbConfig);
    
    const [rows] = await connection.execute(`
      SELECT 
        id,
        user_id,
        date,
        time,
        location,
        type,
        description,
        status,
        reporter,
        has_evidence,
        created_at,
        updated_at
      FROM incidents 
      ORDER BY created_at DESC
    `);
    
    await connection.end();
    
    console.log('Fetched incidents:', JSON.stringify(rows, null, 2));
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch incidents' },
      { status: 500 }
    );
  }
}

// POST /api/incidents - Create a new incident
export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Creating new incident with data:', JSON.stringify(body, null, 2));
    
    const { 
      id,
      user_id, 
      date: isoDate,
      time,
      location, 
      type,
      description,
      reporter,
      has_evidence = 0
    } = body;

    // Format date if it's an ISO string
    const { date } = formatDateTime(isoDate);

    // Validate required fields
    if (!id || !user_id || !date || !time || !location || !type || !description || !reporter) {
      console.log('Missing required fields:', { id, user_id, date, time, location, type, description, reporter });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate ID format (either YYYYMMDD-XXXX or INC-XXXXXX)
    const idRegex = /^(\d{8}-[A-F0-9]{4}|INC-\d{6})$/;
    if (!idRegex.test(id)) {
      console.log('Invalid ID format:', id);
      return NextResponse.json(
        { error: 'Invalid ID format. Use either YYYYMMDD-XXXX or INC-XXXXXX' },
        { status: 400 }
      );
    }

    const connection = await mysql.createConnection(dbConfig);
    
    const [result] = await connection.execute(
      `INSERT INTO incidents (
        id, user_id, date, time, location, type, 
        description, reporter, has_evidence, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'New')`,
      [id, user_id, date, time, location, type, description, reporter, has_evidence]
    );
    
    await connection.end();
    
    console.log('Successfully created incident with ID:', id);
    return NextResponse.json({ 
      message: 'Incident created successfully',
      id: id
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to create incident' },
      { status: 500 }
    );
  }
} 