require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sql = require("mssql");

const app = express();
const PORT = 1433;

app.use(express.json());
app.use(cors());

// Configure SQL Server Connection (Using Zanie's Credentials)
const config = {
    user: process.env.DB_USER || "Zanie", // Username from .env
    password: process.env.DB_PASSWORD || "one", // Password from .env
    server: process.env.DB_SERVER || "localhost", // SQL Server instance
    database: process.env.DB_NAME || "todo_db", // Database name
    options: {
        trustServerCertificate: true, // Bypass certificate validation
        encrypt: false, // Disable encryption for local connections
    },
    port: 1433, // Default SQL Server port
};

// Connect to SQL Server
sql.connect(dbConfig)
    .then(() => console.log("Connected to SQL Server"))
    .catch(err => console.error("Database connection failed:", err));

// GET all tickets
app.get("/tickets", async (req, res) => {
    try {
        const result = await sql.query("SELECT * FROM tickets");
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST a new ticket (safe version with parameters)
app.post("/tickets", async (req, res) => {
    const { name, email, issue, comments } = req.body;
    try {
        const request = new sql.Request();
        request.input("name", sql.VarChar, name);
        request.input("email", sql.VarChar, email);
        request.input("issue", sql.VarChar, issue);
        request.input("comments", sql.VarChar, comments);

        await request.query(`
            INSERT INTO tickets (name, email, issue, comments)
            VALUES (@name, @email, @issue, @comments)
        `);

        res.json({ message: "Ticket submitted!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT update comments on a ticket (safe version with parameters)
app.put("/tickets/:id", async (req, res) => {
    const { comments } = req.body;
    const ticketId = parseInt(req.params.id);
    try {
        const request = new sql.Request();
        request.input("comments", sql.VarChar, comments);
        request.input("id", sql.Int, ticketId);

        await request.query(`
            UPDATE tickets SET comments = @comments WHERE id = @id
        `);

        res.json({ message: "Comments updated!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

// public/Script.js (frontend only)
// Example: Submit a ticket using fetch
document.getElementById('ticketForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const issue = document.getElementById('issue').value;
    const comments = document.getElementById('comments').value;

    const res = await fetch('/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, issue, comments })
    });
    const data = await res.json();
    alert(data.message || data.error);
});
