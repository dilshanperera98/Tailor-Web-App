const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://nawarathnanavod98:1998%23navod@cluster0.uxqik.mongodb.net/dressmaker?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Error connecting to MongoDB:', err));

module.exports = mongoose;