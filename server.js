const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { insertUser, findUserByEmail } = require('./database');
const { authenticateToken } = require('./auth');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = "my_secret_key";

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Register route
app.post('/api/register', async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        await insertUser(email, hashedPassword);
        res.send("สมัครสมาชิกสำเร็จ!");
    } catch (err) {
        res.status(400).send("มีผู้ใช้นี้อยู่แล้ว หรือข้อมูลไม่ถูกต้อง");
    }
});

// Login route
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user) return res.status(400).send("ไม่พบบัญชีผู้ใช้");
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).send("รหัสผ่านไม่ถูกต้อง");
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '2h' });
    res.json({ token });
});

// Protected route
app.get('/api/dashboard', authenticateToken, (req, res) => {
    res.send(`ยินดีต้อนรับ ${req.user.email} เข้าสู่ระบบ Dashboard!`);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));