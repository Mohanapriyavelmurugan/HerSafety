import db from '../config/db.js';
import crypto from 'crypto';

export const reportIncident = async (req, res) => {
  try {
    console.log('Incoming incident report:', {
      headers: req.headers,
      body: req.body,
      method: req.method
    });

    // Ensure we have a valid request body
    if (!req.body || typeof req.body !== 'object') {
      console.error('Invalid request body:', req.body);
      return res.status(400).json({
        error: 'Invalid request body',
        details: 'Request body must be a valid JSON object'
      });
    }

    console.log('Received incident report:', req.body);
    const { 
      userId,
      date,
      time,
      location,
      type,
      description,
      evidence
    } = req.body;

    // Validate required fields
    const requiredFields = ['userId', 'date', 'time', 'location', 'type', 'description'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return res.status(400).json({ 
        error: 'Missing required fields', 
        missing: missingFields,
        received: req.body
      });
    }

    // Validate field formats
    const errors = [];
    
    // Validate date
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      errors.push('Invalid date format. Expected YYYY-MM-DD');
    }
    
    // Validate time
    if (!/^\d{2}:\d{2}:\d{2}$/.test(time)) {
      errors.push('Invalid time format. Expected HH:MM:SS');
    }
    
    // Validate location length
    if (location.length < 5) {
      errors.push('Location must be at least 5 characters');
    }
    
    // Validate description length
    if (description.length < 10) {
      errors.push('Description must be at least 10 characters');
    }
    
    // Validate incident type
    const validTypes = ['harassment', 'assault', 'stalking', 'domestic_violence', 'workplace_harassment', 'other'];
    if (!validTypes.includes(type)) {
      errors.push(`Invalid incident type. Valid types are: ${validTypes.join(', ')}`);
    }
    
    if (errors.length > 0) {
      console.error('Validation errors:', errors);
      return res.status(400).json({ 
        error: 'Validation failed', 
        errors
      });
    }

    // Generate a unique incident ID (format: YYYYMMDD-XXXX)
    const incidentId = `${new Date(date).toISOString().slice(0, 10).replace(/-/g, '')}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;

    // Insert incident
    const insertIncidentQuery = `
      INSERT INTO incidents (
        id,
        user_id,
        date,
        time,
        location,
        type,
        description,
        status,
        reporter,
        has_evidence
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const userResult = await db.query('SELECT name FROM users WHERE id = ?', [userId]);
    const reporterName = userResult[0][0].name;

    const incidentData = [
      incidentId,
      userId,
      date,
      time.length === 5 ? time + ':00' : time,
      location,
      type,
      description,
      'New',
      reporterName,
      evidence ? 1 : 0
    ];

    await db.query(insertIncidentQuery, incidentData);

    // Create case tracking entry
    const [policeResult] = await db.query('SELECT id FROM police ORDER BY RAND() LIMIT 1');
    if (!policeResult[0]) {
      throw new Error('No police officers available to assign case');
    }

    const caseTrackingQuery = `
      INSERT INTO case_tracking (
        incident_id,
        police_id,
        status,
        notes
      ) VALUES (?, ?, ?, ?)
    `;

    await db.query(caseTrackingQuery, [
      incidentId,
      policeResult[0].id,
      'New',
      'Case created and assigned to police officer'
    ]);

    // Get the assigned police officer details
    const [assignedPoliceResult] = await db.query('SELECT name, station FROM police WHERE id = ?', [policeResult[0].id]);

    res.status(201).json({
      message: 'Incident reported successfully',
      incidentId,
      caseTrackingId: incidentId,
      assignedPolice: {
        name: assignedPoliceResult[0].name,
        station: assignedPoliceResult[0].station
      }
    });

  } catch (error) {
    console.error('Error reporting incident:', error);
    const statusCode = error.statusCode || 500;
    const errorMessage = error.message || 'Failed to report incident';
    
    // Log detailed error for debugging
    console.error('Incident Report Error Details:', {
      statusCode,
      errorMessage,
      stack: error.stack
    });

    res.status(statusCode).json({ 
      error: errorMessage,
      details: error.details || error.message
    });
  }
}
