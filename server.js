const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sql = require('mssql');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// SQL Server config
const config = {
    user: 'hostel database',
    password: 'YOUR_DB_PASSWORD',
    server: 'localhost', // or 'localhost\\SQLEXPRESS'
    database: 'Hostel',
    options: { encrypt: false, trustServerCertificate: true }
};

// Get all students
app.get('/students', async (req, res) => {
    try {
        let pool = await sql.connect(config);
        const result = await pool.request().query('SELECT * FROM Students');
        res.json(result.recordset);
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
});

// Insert new student
app.post('/students', async (req, res) => {
    const { name, email, phone, room } = req.body;
    try {
        let pool = await sql.connect(config);
        await pool.request()
            .input('Name', sql.NVarChar, name)
            .input('Email', sql.NVarChar, email)
            .input('Phone', sql.NVarChar, phone)
            .input('RoomNumber', sql.Int, room)
            .query('INSERT INTO Students (Name, Email, Phone, RoomNumber) VALUES (@Name,@Email,@Phone,@RoomNumber)');
        res.json({ message: 'Student added successfully!' });
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete student
app.delete('/students/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        let pool = await sql.connect(config);
        await pool.request()
            .input('StudentID', sql.Int, id)
            .query('DELETE FROM Students WHERE StudentID = @StudentID');
        res.json({ message: 'Student deleted successfully!' });
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
