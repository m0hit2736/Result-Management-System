const pool = require('../db/db');
const Student = require('../models/student');

const student_login_get = (req, res) => {
  res.render("student/login");
};

const student_login_post = async (req, res) => {
  try {
    const Sturoll = req.body.roll;
    const dob = req.body.dob;
    console.log(dob);
    const query = {
      text: 'SELECT * FROM students WHERE roll = $1',
      values: [Sturoll],
    };

    const { rows } = await pool.query(query);

    if (rows.length === 0) {
      res.render('student/login', {
        error: 'Login with correct roll number',
      });
    } else {
      const student = rows[0];

      const dbDateString = new Date(student.dob).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
      const dbDate = new Date(dbDateString);
      const formattedDate = `${dbDate.getFullYear()}-${padZero(dbDate.getMonth() + 1)}-${padZero(dbDate.getDate())}`;

      // Check if the D.O.B. matches
      if (formattedDate !== dob) {
        res.render('student/login', {
          error: 'Incorrect Date of Birth',
        });
      } else {
        res.render('student/view', { one: student });
      }
    }
  } catch (error) {
    console.error('Error in student login:', error);
    res.status(500).send('Internal Server Error');
  }
};

// Function to pad single-digit months/days with leading zero
function padZero(value) {
  return value < 10 ? `0${value}` : value;
}

//exporting student controller functions
module.exports = {
  student_login_get,
  student_login_post
}