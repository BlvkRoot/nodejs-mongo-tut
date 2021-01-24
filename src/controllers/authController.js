const express = require('express');
const User = require('../database/models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');
const fs = require('fs');
const {join} = require('path');

const router = express.Router();
const filePath = join(__dirname, '../tokens', 'tokens.json');

const generateToken = (params = {}) => {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400,
    })
}

router.post('/register', async (req, res) => {
    const { email } = req.body
    try {
        if (await User.findOne({ email }))
            return res.status(400).send({ error: 'User already exists..' })

        const user = await User.create(req.body);

        user.password = undefined;

        return res.send({ 
            user,
            token: generateToken({id: user.id}) 
        });

    } catch (error) {
        return res.status(400).send({ error: 'Registration failed.' });
    }
});

router.post('/authenticate', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user)
        res.status(400).send({ error: 'User not found.' })

    if (!await bcrypt.compare(password, user.password))
        res.status(400).send({ error: 'Invalid password' })

    user.password = undefined;


    // For testing purposes only
    fs.writeFileSync(filePath, JSON.stringify({tokenString: generateToken({id: user.id})}, null, '\t'));

    res.status(200).send({ 
        user, 
        token: generateToken({id: user.id}) 
    })
})

module.exports = app => app.use('/auth', router);