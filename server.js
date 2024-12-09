const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./models');
const User = require('./models/user');
const cors = require('cors');
const app = express();
const port = 3000;
app.use(cors());
app.use(bodyParser.json());
// Login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.send({ error: 'email_not_exist' });
        }

        if (user.password === password) {
            return res.send({ status: 'success' });
        } else {
            return res.send({ error: 'password_incorrect' });
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).send({ error: 'Database query error' });
    }
});

app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if user already exists
        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        await User.create({ name, email, password });
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
});
