import db from '../config/db.js';

export const reportIncident = (req, res) => {
  console.log('Received incident:', req.body); // Log the incoming data
  const { 
    id,
    userId,
    date,
    time,
    location,
    type,
    description,
    status,
    reporter,
    evidence
  } = req.body;

  // Validate required fields
  if (!id || !userId || !date || !time || !location || !type || !description || !reporter) {
    console.error('Missing required field:', { id, userId, date, time, location, type, description, reporter });
    return res.status(400).json({ error: 'Missing required field', details: { id, userId, date, time, location, type, description, reporter } });
  }

  console.log('All required fields present. Preparing SQL query...');
  const sql = `
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

  const values = [
    id,
    userId,
    date,
    time.length === 5 ? time + ':00' : time, // Ensure time is in HH:MM:SS
    location,
    type,
    description,
    status || 'New',
    reporter,
    evidence ? 1 : 0
  ];

  console.log('SQL:', sql);
  console.log('Values:', values);

  db.query(
    sql,
    values,
    (err, result) => {
      if (err) {
        console.error('Error reporting incident:', err.sqlMessage || err.message || err);
        return res.status(500).json({ error: 'Incident report failed', details: err.sqlMessage || err.message || err });
      }
      console.log('Incident reported successfully:', result);
      res.status(201).json({ 
        message: 'Incident reported successfully',
        incidentId: result.insertId 
      });
    }
  );
};
