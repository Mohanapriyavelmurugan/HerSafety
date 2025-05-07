import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

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

// GET /api/incidents/[id] - Get a specific incident
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Fetching incident with ID:', params.id);
    const connection = await mysql.createConnection(dbConfig);
    
    const [rows] = await connection.execute(
      `SELECT 
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
       WHERE id = ?`,
      [params.id]
    );
    
    await connection.end();
    
    if (!rows[0]) {
      console.log('Incident not found with ID:', params.id);
      return NextResponse.json(
        { error: 'Incident not found' },
        { status: 404 }
      );
    }
    
    console.log('Fetched incident:', JSON.stringify(rows[0], null, 2));
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch incident' },
      { status: 500 }
    );
  }
}

// PATCH /api/incidents/[id] - Update an incident
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    console.log('Updating incident with ID:', params.id);
    console.log('Update data:', JSON.stringify(body, null, 2));
    
    const { 
      date: isoDate,
      location,
      type,
      description,
      status,
      reporter,
      has_evidence
    } = body;

    if (!isoDate && !location && !type && !description && !status && !reporter && has_evidence === undefined) {
      console.log('No fields to update provided');
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    // Format date if it's an ISO string
    let date;
    if (isoDate) {
      const formatted = formatDateTime(isoDate);
      date = formatted.date;
    }

    // Validate status if provided
    if (status && !['New', 'In Progress', 'Resolved'].includes(status)) {
      console.log('Invalid status provided:', status);
      return NextResponse.json(
        { error: 'Invalid status. Must be one of: New, In Progress, Resolved' },
        { status: 400 }
      );
    }

    const connection = await mysql.createConnection(dbConfig);
    
    let updateQuery = 'UPDATE incidents SET ';
    const updateValues = [];
    
    if (date) {
      updateQuery += 'date = ?, ';
      updateValues.push(date);
    }
    if (location) {
      updateQuery += 'location = ?, ';
      updateValues.push(location);
    }
    if (type) {
      updateQuery += 'type = ?, ';
      updateValues.push(type);
    }
    if (description) {
      updateQuery += 'description = ?, ';
      updateValues.push(description);
    }
    if (status) {
      updateQuery += 'status = ?, ';
      updateValues.push(status);
    }
    if (reporter) {
      updateQuery += 'reporter = ?, ';
      updateValues.push(reporter);
    }
    if (has_evidence !== undefined) {
      updateQuery += 'has_evidence = ?, ';
      updateValues.push(has_evidence);
    }
    
    // Remove trailing comma and space
    updateQuery = updateQuery.slice(0, -2);
    updateQuery += ' WHERE id = ?';
    updateValues.push(params.id);
    
    console.log('Update query:', updateQuery);
    console.log('Update values:', updateValues);
    
    const [result] = await connection.execute(updateQuery, updateValues);
    
    await connection.end();
    
    if (result.affectedRows === 0) {
      console.log('No incident found to update with ID:', params.id);
      return NextResponse.json(
        { error: 'Incident not found' },
        { status: 404 }
      );
    }
    
    console.log('Successfully updated incident with ID:', params.id);
    return NextResponse.json({ message: 'Incident updated successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to update incident' },
      { status: 500 }
    );
  }
}

// DELETE /api/incidents/[id] - Delete an incident
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Deleting incident with ID:', params.id);
    const connection = await mysql.createConnection(dbConfig);
    
    const [result] = await connection.execute(
      'DELETE FROM incidents WHERE id = ?',
      [params.id]
    );
    
    await connection.end();
    
    if (result.affectedRows === 0) {
      console.log('No incident found to delete with ID:', params.id);
      return NextResponse.json(
        { error: 'Incident not found' },
        { status: 404 }
      );
    }
    
    console.log('Successfully deleted incident with ID:', params.id);
    return NextResponse.json({ message: 'Incident deleted successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to delete incident' },
      { status: 500 }
    );
  }
} 