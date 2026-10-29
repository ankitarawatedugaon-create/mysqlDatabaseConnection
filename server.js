
const express = require('express');
const app = express();

const db = require('./db');

app.use(express.json());

// GET API - Fetch all students
app.get('/students', (req, res) => {

    const sql = 'SELECT * FROM students';

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Error fetching students',
                error: err.message
            });
        }

        res.status(200).json({
            success: true,
            message: 'Students fetched successfully',
            count: result.length,
            data: result
        });
    });
});


 // POST API - Create a new student
app.post('/students', (req, res) => {

    const { name, email, course } = req.body;

    // Validate input
    if (!name || !email || !course) {
        return res.status(400).json({
            success: false,
            message: 'Name, email and course are required'
        });
    }

    const sql = `
        INSERT INTO students (name, email, course)
        VALUES (?, ?, ?)
    `;

    const values = [name, email, course];

    db.query(sql, values, (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Error creating student',
                error: err.message
            });
        }

        res.status(201).json({
            success: true,
            message: 'Student created successfully',
            data: {
                id: result.insertId,
                name: name,
                email: email,
                course: course
            }
        });
    });
});


 // PUT API - Update student by ID
app.put('/students/:id', (req, res) => {

    const { id } = req.params;
    const { name, email, course } = req.body;

    // Validate input
    if (!name || !email || !course) {
        return res.status(400).json({
            success: false,
            message: 'Name, email and course are required'
        });
    }

    const sql = `
        UPDATE students
        SET name = ?, email = ?, course = ?
        WHERE id = ?
    `;

    const values = [name, email, course, id];

    db.query(sql, values, (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Error updating student',
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Student updated successfully',
            data: {
                id: Number(id),
                name,
                email,
                course
            }
        });
    });
});


 // PATCH API - Update specific student fields
app.patch('/students/:id', (req, res) => {

    const { id } = req.params;
    const { name, email, course } = req.body;

    // Check if at least one field is provided
    if (name === undefined && email === undefined && course === undefined) {
        return res.status(400).json({
            success: false,
            message: 'Please provide at least one field to update'
        });
    }

    // Build the update query dynamically
    const fields = [];
    const values = [];

    if (name !== undefined) {
        fields.push('name = ?');
        values.push(name);
    }

    if (email !== undefined) {
        fields.push('email = ?');
        values.push(email);
    }

    if (course !== undefined) {
        fields.push('course = ?');
        values.push(course);
    }

    const sql = `
        UPDATE students
        SET ${fields.join(', ')}
        WHERE id = ?
    `;

    values.push(id);

    db.query(sql, values, (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Error updating student',
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Student not found or no changes made'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Student updated successfully'
        });
    });
});


 // DELETE API - Delete student by ID
app.delete('/students/:id', (req, res) => {

    const { id } = req.params;

    const sql = 'DELETE FROM students WHERE id = ?';

    db.query(sql, [id], (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Error deleting student',
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Student deleted successfully'
        });
    });
});


const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
