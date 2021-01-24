const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    //Verify if authorization is provided
    if(!authHeader)
        return res.status(401).send({error: 'Not authorized.'})

    const parts = authHeader.split(' ');

    //Verify if format length is correct
    if(!parts.length === 2)
        return res.status(401).send('Token error');

    const [ scheme, token ] = parts;

    //Verify is first part contains Bearer keyword
    if(!/^Bearer$/i.test(scheme))
        return res.status(401).send({error: 'Token malformatted'})

    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if(err) return res.status(401).send({error: 'Token invalid'})

        req.userId = decoded.id;

        // Next simply gives access to the controller if token is valid
        next();
    })
}