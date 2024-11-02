-- This script is responsible for creating all the tables on our backend database (hosted on google cloud compute VM)

-- TABLE 1: Users - Here we store user information for registration, login, and profile management

CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABLE 2: Modules - Contains the various learning modules (CSS, HTML) 

-- TABLE 3: Quizzes - Stores quiz data for each module

CREATE TABLE Quizzes (
    quiz_id INT AUTO_INCREMENT PRIMARY KEY,
    module_id INT FOREIGN KEY,
    title VARCHAR(50) NOT NULL 
);

-- TABLE 4: Questions

-- TABLE 5: Options

-- TABLE 6: UserProgress

-- TABLE 7: FAQs

-- TABLE 8: Feedback

-- TABLE 9: HTTP Demo Logs (Optional)