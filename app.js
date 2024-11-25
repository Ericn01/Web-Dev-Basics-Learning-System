// Creating the express application
const express = require('express')
const userAuthRoutes = require('./src/routes/userAuthRoutes');
const userRoutes = require('./src/routes/userRoutes');
const learningModuleRoutes = require('./src/routes/learningModulesRoutes');
const quizzesRoutes = require('./src/routes/quizzesRoutes');
require('dotenv').config();

const app = express();

app.use(express.json()); // middleware that helps with parsin requests.
app.use('/webdev-learning/api', userAuthRoutes);
app.use('/webdev-learning/api', userRoutes);
app.use('/webdev-learning/api', learningModuleRoutes);
app.use('/webdev-learning/api', quizzesRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`The server is running on port ${PORT}. Listening for incoming HTTP requests...`);
});

