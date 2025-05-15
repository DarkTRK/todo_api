const express = require("express");
const cors = require("cors");

const sql = require("mssql");
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

sql.connect(config)
    .then(() => console.log("Connected to SQL Server!"))
    .catch(err => console.error("Failed to connect to SQL Server:", err));

const app = express();
const PORT = 1433;

app.use(express.json());
app.use(cors());

let tickets = []; // In-memory ticket storage (for testing)

// Create a new ticket
app.post('/create-bio', async (req, res) => {
    const { username, bio } = req.body;

    if (!username || !bio) {
        return res.status(400).json({ error: 'Username and bio are required.' });
    }

    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('Name', sql.NVarChar, username)
            .query('SELECT * FROM User_info WHERE Name = @Name AND deleted = 0');

        if (result.recordset.length > 0) {
            const user = result.recordset[0];
            if (user.bio) {
                return res.status(400).json({ error: 'text already exists. Use the update API to modify it.' });
            }

            await pool.request()
                .input('Name', sql.NVarChar, username)
                .input('text', sql.NVarChar, bio)
                .query('UPDATE User_info SET text= @text WHERE Name = @Name');
            res.status(201).json({ message: 'Bio created successfully' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});
app.post('/create-email', async (req, res) => {
    const { username, email } = req.body;

    if (!username || !email) {
        return res.status(400).json({ error: 'Username and email are required.' });
    }

    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('Email', sql.NVarChar, username)
            .query('SELECT * FROM User_info WHERE Email = @Email AND deleted = 0');

        if (result.recordset.length > 0) {
            const user = result.recordset[0];
            if (user.email) {
                return res.status(400).json({ error: 'Email already exists. Use the update API to modify it.' });
            }

            await pool.request()
                .input('Email', sql.NVarChar, username)
                .input('Email', sql.NVarChar, email)
                .query('UPDATE User_info SET Email= @Email WHERE Email = @Email');
            res.status(201).json({ message: 'Email created successfully' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

app.post('/create-issue', async (req, res) => {
    const { username, issue } = req.body;

    if (!username || !issue) {
        return res.status(400).json({ error: 'Username and issue are required.' });
    }

    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('Issue', sql.NVarChar, username)
            .query('SELECT * FROM User_info WHERE Issue = @Issue AND deleted = 0');

        if (result.recordset.length > 0) {
            const user = result.recordset[0];
            if (user.issue) {
                return res.status(400).json({ error: 'Issue already exists. Use the update API to modify it.' });
            }

            await pool.request()
                .input('Issue', sql.NVarChar, username)
                .input('Issue', sql.NVarChar, issue)
                .query('UPDATE User_info SET Issue= @Issue WHERE Issue = @Issue');
            res.status(201).json({ message: 'Issue created successfully' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

app.post('/create-comments', async (req, res) => {
    const { username, comments } = req.body;

    if (!username || !comments) {
        return res.status(400).json({ error: 'Username and comments are required.' });
    }

    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('Comments', sql.NVarChar, username)
            .query('SELECT * FROM User_info WHERE Comments = @Comments AND deleted = 0');

        if (result.recordset.length > 0) {
            const user = result.recordset[0];
            if (user.comments) {
                return res.status(400).json({ error: 'Comments already exist. Use the update API to modify them.' });
            }

            await pool.request()
                .input('Comments', sql.NVarChar, username)
                .input('Comments', sql.NVarChar, comments)
                .query('UPDATE User_info SET Comments= @Comments WHERE Comments = @Comments');
            res.status(201).json({ message: 'Comments created successfully' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Get all tickets
app.get("/tickets", (req, res) => {
    res.json(tickets);
});


// Update ticket comments
app.put('/update-Name', async (req, res) => {
    const { username, bio } = req.body;

    if (!username || !bio) {
        return res.status(400).send('Username and Name are required.');
    }

    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('userId', sql.NVarChar, username)
            .query('SELECT * FROM Users WHERE userId = @userId AND deleted = 0');

        if (result.recordset.length > 0) {
            await pool.request()
                .input('Name', sql.NVarChar, username)
                .input('text', sql.NVarChar, bio)
                .query('UPDATE User-info SET text = @text WHERE Name = @userId');
            res.status(200).json({ message: 'Bio updated successfully' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send(error.message);
    }
});

app.put('/update-email', async (req, res) => {
    const { username, email } = req.body;

    if (!username || !email) {
        return res.status(400).send('Username and email are required.');
    }

    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('userId', sql.NVarChar, username)
            .query('SELECT * FROM Users WHERE userId = @userId AND deleted = 0');

        if (result.recordset.length > 0) {
            await pool.request()
                .input('userId', sql.NVarChar, username)
                .input('email', sql.NVarChar, email)
                .query('UPDATE Users SET email = @email WHERE userId = @userId');
            res.status(200).json({ message: 'Email updated successfully' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send(error.message);
    }
});

app.put('/update-issue', async (req, res) => {
    const { username, issue } = req.body;

    if (!username || !issue) {
        return res.status(400).send('Username and issue are required.');
    }

    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('userId', sql.NVarChar, username)
            .query('SELECT * FROM Users WHERE userId = @userId AND deleted = 0');

        if (result.recordset.length > 0) {
            await pool.request()
                .input('userId', sql.NVarChar, username)
                .input('issue', sql.NVarChar, issue)
                .query('UPDATE Users SET issue = @issue WHERE userId = @userId');
            res.status(200).json({ message: 'Issue updated successfully' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send(error.message);
    }
});

app.put('/update-comments', async (req, res) => {
    const { username, comments } = req.body;

    if (!username || !comments) {
        return res.status(400).send('Username and comments are required.');
    }

    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('userId', sql.NVarChar, username)
            .query('SELECT * FROM Users WHERE userId = @userId AND deleted = 0');

        if (result.recordset.length > 0) {
            await pool.request()
                .input('userId', sql.NVarChar, username)
                .input('comments', sql.NVarChar, comments)
                .query('UPDATE Users SET comments = @comments WHERE userId = @userId');
            res.status(200).json({ message: 'Comments updated successfully' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send(error.message);
    }
});

app.listen(PORT, () => {
    console.log("http://localhost:1433");
});

