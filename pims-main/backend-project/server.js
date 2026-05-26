const express = require('express');
const bcrypt = require('bcrypt');
const db = require('./db.js');
const app = express();
const api = express.Router();
const port = 3000;
const session = require('express-session');
const cors = require('cors');
const corsOrigins = new Set([
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://web.postman.co',
    'https://app.postman.com',
]);
app.use(cors({
    origin(origin, callback) {
        if (!origin) {
            return callback(null, true);
        }
        if (corsOrigins.has(origin)) {
            return callback(null, true);
        }
        if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
            return callback(null, true);
        }
        return callback(null, false);
    },
    credentials: true,
}));
app.use(express.json());
app.use(session({
    secret: 'password',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: false
    }
}));
async function createUser(req, res) {
    const { userName, password } = req.body;
    const sql = 'INSERT INTO mk_user(userName,password)VALUES(?,?)';
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.execute(sql, [userName, hashedPassword]);
        res.status(201).json({ message: 'user created' });
    } catch (err) {
        console.error('create user error:', err);
        res.status(500).json({ error: 'error when creating' });
    }
}
async function getUser(req, res) {
    const { userName, password } = req.body;
    const sql = 'SELECT * FROM mk_user WHERE userName=?';
    try {
        const [rows] = await db.execute(sql, [userName]);
        if (!rows.length) {
            return res.status(404).json({ error: 'User not found' });
        }
        const user = rows[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        res.status(200).json([{ userID: user.userID, userName: user.userName }]);
    } catch (err) {
        console.error('Get user error:', err);
        res.status(500).json({ error: 'Retrieving error' });
    }
}
async function login(req, res) {
    const { userName, password } = req.body;
    const sql = 'SELECT * FROM mk_user WHERE userName=?';
    try {
        const [rows] = await db.execute(sql, [userName]);
        if (rows.length > 0) {
            const user = rows[0];
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                req.session.user = {
                    id: user.userID,
                    userName: user.userName
                };
                res.status(200).json({
                    message: 'Login successful',
                    user: req.session.user
                });
            } else {
                res.status(401).json({ error: 'Invalid credentials' });
            }
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'DB error' });
    }
}
function sessionUser(req, res) {
    if (req.session.user) {
        return res.json({ user: req.session.user });
    }
    res.status(401).json({ error: 'Unauthorized' });
}
async function getPost(req, res) {
    try {
        const [rows] = await db.execute(
            'SELECT * FROM mk_post ORDER BY postID'
        );
        res.json(rows);
    } catch (err) {
        console.error('getPost:', err);
        res.status(500).json({ error: 'Failed to list Posts' });
    }
}
async function updatePost(req, res) {
    const id = req.params.id;
    const { postName } = req.body;
    try {
        await db.execute(
            'UPDATE mk_post SET postName=? WHERE postID=?',
            [postName, id]
        );
        res.json({ message: 'Post updated' });
    } catch (err) {
        console.error('updatePost:', err);
        res.status(500).json({ error: 'Failed to update post' });
    }
}
async function deletePost(req, res) {
    const id = req.params.id;
    try {
        await db.execute('DELETE FROM mk_post WHERE postID=?', [id]);
        res.json({ message: 'post deleted' });
    } catch (err) {
        console.error('deletePost:', err);
        res.status(500).json({ error: 'Failed to delete post' });
    }
}
async function post(req, res) {
    const { postName } = req.body;
    const sql = `
        INSERT INTO mk_post(postName)
        VALUES(?)
    `;
    try {
        await db.execute(sql, [postName]);
        res.status(200).json({ message: 'Added to post' });
    } catch (err) {
        console.error('post error:', err);
        res.status(500).json({ error: 'Error when adding post' });
    }
}
async function getEmployees(req, res) {
    try {
        const [rows] = await db.execute(`
            SELECT m.*, p.postName AS post
            FROM mk_employees m
            LEFT JOIN mk_post p ON p.postID = m.postID
            ORDER BY m.employeeID
        `);
        res.json(rows);
    } catch (err) {
        console.error('getEmployee:', err);
        res.status(500).json({ error: 'Failed to list employees' });
    }
}
async function updateEmployee(req, res) {
    const id = req.params.id;
    const {postID,FirstName,LastName,gender, DateOfBirth,email,phoneNumber,position,HireDate,salary,status,department,address } = req.body;
    try {
        await db.execute(
            'UPDATE mk_employees SET postID=?,FirstName=?,LastName=?,gender=?, DateOfBirth=?,email=?,phoneNumber=?,position=?,HireDate=?,salary=?,status=?,department=?,address=? WHERE employeeID=?',
            [postID,FirstName,LastName,gender, DateOfBirth,email,phoneNumber,position,HireDate,salary,status,department,address, id]
        );
        res.json({ message: 'employee updated' });
    } catch (err) {
        console.error('updateEmployee:', err);
        res.status(500).json({ error: 'Failed to update employee' });
    }
}
async function deleteEmployee(req, res) {
    const id = req.params.id;
    try {
        await db.execute('DELETE FROM mk_employees WHERE employeeID=?', [id]);
        res.json({ message: 'employee deleted' });
    } catch (err) {
        console.error('deleteEmployee:', err);
        res.status(500).json({ error: 'Failed to delete employee' });
    }
}
async function employee(req, res) {
    const { postID,FirstName,LastName,gender, DateOfBirth,email,phoneNumber,position,HireDate,salary,status,department,address } = req.body;
    const sql = `
        INSERT INTO mk_employees
        (postID,FirstName,LastName,gender, DateOfBirth,email,phoneNumber,position,HireDate,salary,status,department,address)
        VALUES (?, ?, ?, ?,?,?,?,?,?,?,?,?,?);
    `;
    try {
        await db.execute(sql, [postID,FirstName,LastName,gender, DateOfBirth,email,phoneNumber,position,HireDate,salary,status,department,address]);
        res.status(200).json({ message: 'employee added' });
    } catch (err) {
        console.error('employee error:', err);
        res.status(500).json({ error: 'Failed to employee' });
    }
}
async function logout(req, res) {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Could not logout' });
        }
        res.status(200).json({ message: 'Logged out successfully' });
    });
}
app.post('/users', createUser);
app.post('/getuser', getUser);
app.post('/login', login);
app.get('/session', sessionUser);
app.post('/logout', logout);
app.get('/posts', getPost);
app.post('/posting', post);
app.put('/posts/:id', updatePost);
app.delete('/posts/:id', deletePost);
app.get('/employees', getEmployees);
app.post('/employee', employee);
app.put('/employee/:id', updateEmployee);
app.delete('/employee/:id', deleteEmployee);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});