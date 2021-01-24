const mongoose = require('mongoose');

try {
    mongoose.connect('mongodb://localhost/noderest', {
        useNewUrlParser: true,
        useUnifiedTopology: true, 
        useCreateIndex: true
    });

} catch (error) {
    console.log(`DB Connection error: ${error}`);
}

module.exports = mongoose