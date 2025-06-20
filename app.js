const express = require('express');
const cors = require('cors'); 

// Importing all of the necessary routes
const userAuthRoutes = require('./src/routes/userAuthRoutes');
const userRoutes = require('./src/routes/userRoutes');
const learningModuleRoutes = require('./src/routes/learningModulesRoutes');
const quizzesRoutes = require('./src/routes/quizzesRoutes');
const FAQRoutes = require('./src/routes/userFAQRoutes');
const progressRoutes = require('./src/routes/userProgressRoutes');
const httpDemoRoutes = require('./src/routes/httpDemo');

const app = express();

app.use(cors(
  {
    origin: ['https://web-dev-basics-learning-system.onrender.com', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: '*',
    credentials: true
  }
)); 

app.use(express.json());

// Setting up the routes 
app.use('/webdev-learning/api', userAuthRoutes);
app.use('/webdev-learning/api', userRoutes);
app.use('/webdev-learning/api', learningModuleRoutes);
app.use('/webdev-learning/api', quizzesRoutes);
app.use('/webdev-learning/api', FAQRoutes);
app.use('/webdev-learning/api', progressRoutes);
app.use('/webdev-learning/api', httpDemoRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}. Listening for incoming HTTP requests...`);
})
