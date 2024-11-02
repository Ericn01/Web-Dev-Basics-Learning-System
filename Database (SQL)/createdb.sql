-- This script is responsible for creating all the tables on our backend database (hosted on google cloud compute VM)


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
