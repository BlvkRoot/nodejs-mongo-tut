const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 7000;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

require('./controllers/authController')(app);
app.listen(PORT, () => console.log(`Server running at ${PORT} .......`));