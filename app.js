const express = require('express');
const cors = require('cors'); 

// Importing all of the necessary routes
const userAuthRoutes = require('./src/routes/userAuthRoutes');
const userRoutes = require('./src/routes/userRoutes');
const learningModuleRoutes = require('./src/routes/learningModulesRoutes');
const quizzesRoutes = require('./src/routes/quizzesRoutes');
const FAQRoutes = require('./src/routes/userFAQRoutes');

const app = express();
app.use(cors()); 


app.use(express.json());
app.use('/webdev-learning/api', userAuthRoutes);
app.use('/webdev-learning/api', userRoutes);
app.use('/webdev-learning/api', learningModuleRoutes);
app.use('/webdev-learning/api', quizzesRoutes);
app.use('/webdev-learning/api', FAQRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`The server is running on port ${PORT}. Listening for incoming HTTP requests...`);
});
