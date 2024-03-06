//importing student model
const Student = require('../models/student');
const pool = require('../db/db');

const teacher_login_get = (req, res) => {
  res.render("teacher/teacherLogin");
};

const teacher_login_post = (req, res) => {
  if (req.body.password == "pswd") {
    res.redirect("/teacher/option");
  }
  else {
    res.render("teacher/teacherLogin", {
      error: "Please Enter Correct Password"
    })
  }
};

const teacher_viewall_get = async (req, res) => {
  try {
    const query = 'SELECT * FROM students';
    const { rows } = await pool.query(query);

    res.render('teacher/viewall', { student: rows });
  } catch (error) {
    console.error('Error fetching all students:', error);
    res.status(500).send('Internal Server Error');
  }
};

const teacher_edit_get = async (req, res) => {
  try {
    const query = {
      text: 'SELECT * FROM students WHERE roll = $1',
      values: [req.params.roll],
    };

    const { rows } = await pool.query(query);

    if (rows.length > 0) {
      res.render('teacher/edit', { user: rows[0] });
    } else {
      res.status(404).send('Student not found');
    }
  } catch (error) {
    console.error('Error fetching student for editing:', error);
    res.status(500).send('Internal Server Error');
  }
};

const teacher_edit_post = async (req, res) => {
  try {
    const query = {
      text: 'UPDATE students SET roll = $1, name = $2, dob = $3, score = $4 WHERE roll = $5 RETURNING *',
      values: [req.body.roll, req.body.name, req.body.dob, req.body.score, req.params.roll],
    };

    const { rows } = await pool.query(query);

    res.redirect('/teacher/viewall');
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).send('Internal Server Error');
  }
};

const teacher_delete_get = async (req, res) => {
  try {
    const query = {
      text: 'DELETE FROM students WHERE roll = $1',
      values: [req.params.roll],
    };

    await pool.query(query);

    res.redirect('/teacher/viewall');
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).send('Internal Server Error');
  }
};

const teacher_option_get = (req, res) => {
  res.render("teacher/option")
};

const teacher_add_get = (req, res) => {
  res.render("teacher/addstudent");
};

const teacher_add_post = async (req, res) => {
  const { name, roll, dob, score } = req.body;

  try {
    const insertQuery = {
      text: 'INSERT INTO students(name, roll, dob, score) VALUES($1, $2, $3, $4) RETURNING *',
      values: [name, roll, dob, score],
    };

    const { rows } = await pool.query(insertQuery);
    res.render("teacher/option")
  } catch (error) {
    console.error('Error adding student:', error);
    res.status(500).send('Internal Server Error');
  }
};

//exporting teacher controller functions
module.exports = {
  teacher_login_get,
  teacher_login_post,
  teacher_viewall_get,
  teacher_edit_get,
  teacher_edit_post,
  teacher_delete_get,
  teacher_add_post,
  teacher_add_get,
  teacher_option_get
}