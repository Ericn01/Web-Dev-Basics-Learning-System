-- This script is responsible for creating all the tables on our backend database (hosted on google cloud compute VM)

DROP DATABASE IF EXISTS WebDevLearning; -- Remove the database if it already exists (This script should only be ran once on a given MySQL instance)

CREATE DATABASE WebDevLearning;
USE WebDevLearning;

-- TABLE 1: Users - Here we store user information for registration, login, and profile management
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABLE 2: Modules - Contains the various learning modules (CSS, HTML) 
CREATE TABLE Modules (
    module_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    module_description VARCHAR(255),
    content TEXT NOT NULL, -- This section might include HTML formatted text
    banner_image_path VARCHAR(255), -- URL or path to the banner image
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABLE 3: Quizzes - Stores quiz data for each module
CREATE TABLE Quizzes (
    quiz_id INT AUTO_INCREMENT PRIMARY KEY,
    module_id INT NOT NULL,
    title VARCHAR(50) NOT NULL,
    FOREIGN KEY (module_id) REFERENCES Modules(module_id) ON DELETE CASCADE
);

-- TABLE 4: Questions - Stores individual questions for each quiz.
CREATE TABLE Questions (
    question_id INT AUTO_INCREMENT PRIMARY KEY,
    quiz_id INT NOT NULL,
    question_text TEXT NOT NULL, 
    correct_answer VARCHAR(100) NOT NULL,
    FOREIGN KEY (quiz_id) REFERENCES Quizzes(quiz_id) ON DELETE CASCADE
);


-- TABLE 5: Options - Stores answer options for each question.
CREATE TABLE Options (
    option_id INT AUTO_INCREMENT PRIMARY KEY,
    question_id INT NOT NULL,
    option_text VARCHAR(255) NOT NULL,
    FOREIGN KEY (question_id) REFERENCES Questions(question_id)
);

-- TABLE 6: UserProgress - Tracks users' progress across modules and quizzes.
CREATE Table UserProgress (
    progress_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    module_id INT NOT NULL,
    quiz_id INT,
    score INT,
    completed_at TIMESTAMP DEFAULT NULL, -- Defaults to null as this is the state it's in when a quiz or module isn't completed.
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE, -- removes child 
    FOREIGN KEY (module_id) REFERENCES Modules(module_id) ON DELETE CASCADE,
    FOREIGN KEY (quiz_id) REFERENCES Quizzes(quiz_id) ON DELETE SET NULL  
);

-- TABLE 7: FAQs - Stores frequently asked questions and their answers (Not sure if we're actually going to implement this)
CREATE TABLE FAQs (
    faq_id INT AUTO_INCREMENT PRIMARY KEY,
    question VARCHAR(255) NOT NULL,
    answer VARCHAR(255) NOT NULL
);

-- TABLE 8: Feedback - Collects user feedback and suggestions
CREATE TABLE Feedback (
    feedback_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    feedback_text TEXT, 
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE -- delete all feedback for a user if their user_id is deleted
);

-- Now that we've created the tables, we can insert some dummy data into them (mostly for testing purposes, will be removed once we have an actual DB running on the VM)

-- 1) Users table data - note that the hashes passwords will not look anything like this
INSERT INTO Users (username, email, password_hash) VALUES
('john_doe43', 'john.d@example.com', 'hashed_password_1'),
('eniel662', 'eniel662@mtroyal.ca', 'hashed_passes_do_not_look_like_this'),
('jane_doe12', 'jane.d@example.com', 'hashed_password_2');

-- 2) Modules table - The basic structure of a module, where content will contain HTML code
INSERT INTO Modules (title, module_description, content, banner_image_path) VALUES
('Introduction to HTML', 'Learn the basics of HTML', '<p>This is the HTML basics content</p>', '/images/html_banner.jpg'),
('Introduction to CSS', 'Learn the basics of CSS', '<p>This is the CSS basics content</p>', '/images/css_banner.jpg');

-- 3) Quizzes table - Pretty simple stuff, a foreign key to the module it belongs to and the name of the quiz
INSERT INTO Quizzes (module_id, title) VALUES
(1, 'HTML Basics Quiz'),
(2, 'CSS Basics Quiz');

-- 4) Questions table - Each quiz has multiple questions, so we have a foreign key for that as well
INSERT INTO Questions (quiz_id, question_text, correct_answer) VALUES
(1, 'What does HTML stand for?', 'Hyper Text Markup Language'),
(1, 'What is the correct HTML element for inserting a line break?', '<br>'),
(2, 'What does CSS stand for?', 'Cascading Style Sheets'),
(2, 'Which CSS property controls text size?', 'font-size');

-- 5) Options table - Every question has multiple options so even more foreign keys, here it becomes clear that the data would be deeply nested in a document-based DB. 
INSERT INTO Options (question_id, option_text) VALUES
(1, 'Hyper Text Markup Language'),
(1, 'Home Tool Markup Language'),
(1, 'Hyperlinks Text Markdown Language'),
(2, '<br>'),
(2, '<lb>'),
(2, '<hr>'),
(3, 'Cascading Style Sheets'),
(3, 'Colorful Style Sections'),
(3, 'Creative Styles Selections'),
(4, 'font-size'),
(4, 'text-size');

-- 6) UserProgress table - keeps track of the progress that a given user has so far. module_id may be redundant, haven't thought it through much tbh.
INSERT INTO UserProgress (user_id, module_id, quiz_id, score, completed_at) VALUES
(1, 1, 1, 85, NOW()),
(1, 2, 2, 90, NOW()),
(2, 1, NULL, NULL, NULL);

-- 7) FAQ table - Data for the frequently asked questions part of the website.
INSERT INTO FAQs (faq_id, question, answer) VALUES
(1, 'What is the best way to learn HTML and CSS?', 'There is no precise best way to learn these languages, but by using our website and practicing often you will be great in no time!'),
(2, 'Who built this website?', 'Anton Angeles, Tim Ho, Simon Truong, and Eric Nielsen.');

-- 8) Feedback table - feedback for the website. Could be part of a 'testimonies section'. Might modify into comments for each quiz instead??
INSERT INTO Feedback (feedback_id, user_id, feedback_text) VALUES
(1, 1, 'Thanks to this platform, I am now an HTML master!'),
(2, 2, 'This course could use some additional CSS examples.');
