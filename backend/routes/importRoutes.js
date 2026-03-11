import express from 'express';
import multer from 'multer';
import * as xlsx from 'xlsx';
import Student from '../../database/models/Student.js';
import Marks from '../../database/models/Marks.js';
import Attendance from '../../database/models/Attendance.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * Build a lowercase-trimmed key map for one Excel row.
 * This lets us do case-insensitive exact lookups: lc(row)["student reg no"]
 */
const lc = (row) => {
  const out = {};
  for (const k of Object.keys(row)) {
    out[k.trim().toLowerCase()] = row[k];
  }
  return out;
};

const str = (v) => (v !== undefined && v !== null && String(v).trim() !== '') ? String(v).trim() : null;
const num = (v) => { const n = Number(v); return isNaN(n) ? 0 : n; };

// ═══════════════════════════════════════════════════════════════
//  POST /api/import/students
// ═══════════════════════════════════════════════════════════════
router.post('/students', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

    const wb   = xlsx.read(req.file.buffer, { type: 'buffer' });
    const ws   = wb.Sheets[wb.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(ws, { defval: '' });

    // ── Direct map using exact (lowercased) Excel column names ───────────
    const students = rows.map(row => {
      const r = lc(row);    // lowercase key → original value

      // Mappings as requested
      const regNo     = str(r['register number']) || str(r['register no']) || str(r['reg no']) || str(r['regno']) || str(r['student_regi_id']) || null;
      
      const firstName = str(r['firstname'])   || str(r['first name'])  || '';
      const lastName  = str(r['lastname'])    || str(r['last name'])   || str(r['surname']) || '';
      const fullName  = str(r['student name']) || str(r['name']) || str(r['student_name']) || str(r['name of the student']) || null;
      const name      = fullName || (`${firstName} ${lastName}`).trim() || null;

      const department = str(r['department']) || str(r['dept']) || str(r['branch']) || str(r['branname']) || 'Unknown';
      const year = num(r['year']) || num(r['academic year']) || num(r['year of study']) || 2;
      const section = str(r['section']) || str(r['sec']) || 'A';
      const semester = num(r['semester']) || num(r['sem']) || 1;
      const email = str(r['email']) || str(r['mail id']) || str(r['email id']) || null;
      const phone = str(r['phone']) || str(r['mobile']) || str(r['mobile number']) || str(r['mobile no']) || null;
      const dob = str(r['dob']) || str(r['date of birth']) || null;
      const community = str(r['community']) || str(r['category']) || str(r['caste']) || null;

      // Unrequested but potentially useful fields from previous implementation
      const gender = str(r['gender']) || null;

      return {
        regNo,
        name,
        department,
        year,
        section,
        semester,
        email,
        phone,
        dob,
        community,
        gender
      };
    });

    // Filter out rows with no regNo or no name
    const valid   = students.filter(s => s.regNo && s.name);
    const validCount = valid.length;
    
    // Log skipped rows for debugging
    const skippedRows = students.filter(s => !s.regNo || !s.name);
    const skippedCount = skippedRows.length;
    if (skippedCount > 0) {
      console.warn(`[IMPORT_STUDENTS] Skipped ${skippedCount} rows due to missing regNo or name. Examples:`, JSON.stringify(skippedRows.slice(0, 3), null, 2));
    }

    let inserted = 0;
    const errors = [];
    for (const s of valid) {
      try {
        await Student.findOneAndUpdate(
          { regNo: s.regNo },
          { $set: s },
          { upsert: true, new: true, runValidators: true }
        );
        inserted++;
      } catch (err) {
        errors.push(`${s.regNo}: ${err.message}`);
      }
    }

    console.log(`[IMPORT_STUDENTS] Success: ${inserted}  Skipped: ${skippedCount}  Errors: ${errors.length}`);

    res.json({
      success: true,
      message: 'Import successful',
      recordsInserted: inserted,
      skipped: skippedCount,
      errors: errors.slice(0, 10)
    });
  } catch (err) {
    console.error('[IMPORT_STUDENTS] Fatal:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════
//  POST /api/import/marks
// ═══════════════════════════════════════════════════════════════
router.post('/marks', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

    const wb   = xlsx.read(req.file.buffer, { type: 'buffer' });
    const ws   = wb.Sheets[wb.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(ws, { defval: '' });

    let inserted = 0;
    let skipped = 0;
    const errors = [];
    const skippedReasons = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const r = lc(row);
      
      const regNo = str(row['regNo']) || str(r['register number']) || str(r['reg no']) || str(r['regno']);
      const studentName = str(row['studentName']) || str(r['studentname']) || str(r['student name']) || str(r['name']) || '';
      const subject = str(row['subject']) || str(r['subject name']) || str(r['course']) || str(r['subject code']);
      const sem = num(row['sem']) || num(r['semester']) || 1;
      const cycle1 = num(row['cycle1']) || num(r['cycle 1']) || 0;
      const cycle2 = num(row['cycle2']) || num(r['cycle 2']) || 0;
      const internal1 = num(row['internal1']) || num(r['internal 1']) || 0;
      const internal2 = num(row['internal2']) || num(r['internal 2']) || 0;
      const model = num(row['model']) || num(r['model exam']) || 0;
      const total = num(row['total']) || num(r['total mark']) || num(r['marks']) || 0;

      const mark = { regNo, studentName, subject, sem, cycle1, cycle2, internal1, internal2, model, total };

      if (!regNo || !subject) {
        skipped++;
        if (skippedReasons.length < 5) skippedReasons.push(`Row ${i+2}: Missing regNo or subject`);
        continue;
      }

      try {
        // Verify student exists before adding marks
        const studentRecord = await Student.findOne({ regNo });
        if (!studentRecord) {
          skipped++;
          if (skippedReasons.length < 5) skippedReasons.push(`${regNo}: Student not found in database`);
          continue;
        }

        await Marks.findOneAndUpdate(
          { regNo: mark.regNo, sem: mark.sem, subject: mark.subject },
          { $set: mark },
          { upsert: true, new: true }
        );
        inserted++;
      } catch (err) {
        errors.push(`${regNo}/${subject}: ${err.message}`);
      }
    }

    console.log(`[IMPORT_MARKS] Success: ${inserted}  Skipped: ${skipped}  Errors: ${errors.length}`);

    res.json({
      success: true,
      message: 'Marks import successful',
      recordsInserted: inserted,
      skipped,
      skippedReasons,
      errors: errors.slice(0, 10)
    });
  } catch (err) {
    console.error('[IMPORT_MARKS] Fatal:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════
//  POST /api/import/attendance
// ═══════════════════════════════════════════════════════════════
router.post('/attendance', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

    const wb   = xlsx.read(req.file.buffer, { type: 'buffer' });
    const ws   = wb.Sheets[wb.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(ws, { defval: '' });

    let inserted = 0;
    let skipped = 0;
    const errors = [];
    const skippedReasons = [];

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const r = lc(row);
        
        const regNo = str(row['regNo']) || str(r['register number']) || str(r['reg no']) || str(r['regno']) || str(r['student_regi_id']);
        const studentName = str(row['studentName']) || str(r['studentname']) || str(r['student name']) || str(r['name']);
        const subject = str(row['subject']) || str(row['subjectCode']) || str(r['subject code']) || str(r['course']) || str(r['subject name']);
        const hoursConducted = num(row['hoursConducted']) || num(row['hoursCondu']) || num(r['total hours']) || num(r['hours conducted']);
        const hoursPresent = num(row['hoursPresent']) || num(row['hoursPresen']) || num(r['attended hours']) || num(r['hours present']);
        const percentage = num(row['percentage']) || num(r['perc']) || num(r['attendance percentage']);
  
        if (!regNo) {
          skipped++;
          if (skippedReasons.length < 5) skippedReasons.push(`Row ${i+2}: Missing regNo`);
          continue;
        }
  
        try {
          // You do not strictly need the student name to upsert if the regNo exists
          // Upsert aggregate attendance based purely on regNo and subject
          await Attendance.updateOne(
            { regNo, subject: subject || 'General' },
            { 
               $set: { 
                 regNo, 
                 studentName: studentName || '',
                 subject: subject || 'General', 
                 hoursConducted, 
                 hoursPresent, 
                 percentage 
               } 
            },
            { upsert: true }
          );
          inserted++;
        } catch (err) {
          errors.push(`${regNo}/${subject}: ${err.message}`);
        }
      }
  
      console.log(`[IMPORT_ATTENDANCE] Success: ${inserted}  Skipped: ${skipped}  Errors: ${errors.length}`);
  
      res.json({
        success: true,
        message: 'Attendance import successful',
        recordsInserted: inserted,
        skipped,
        skippedReasons,
        errors: errors.slice(0, 10)
      });
  } catch (err) {
    console.error('[IMPORT_ATTENDANCE] Fatal:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
