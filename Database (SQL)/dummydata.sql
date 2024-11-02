-- Insert data into the Users table
INSERT INTO Users (username, email, password_hash) VALUES
('john_doe43', 'john.d@example.com', 'hashed_password_1'),
('eniel662', 'eniel662@mtroyal.ca', 'hashed_passes_do_not_look_like_this'),
('jane_doe12', 'jane.d@example.com', 'hashed_password_2');

-- Insert data into the Modules table
INSERT INTO Modules (title, module_description, content, banner_image_path) VALUES
('Introduction to HTML', 'Learn the basics of HTML', '<p>This is the HTML basics content</p>', '/images/html_banner.jpg'),
('Introduction to CSS', 'Learn the basics of CSS', '<p>This is the CSS basics content</p>', '/images/css_banner.jpg');

-- Insert data into the Quizzes table
INSERT INTO Quizzes (module_id, title) VALUES
(1, 'HTML Basics Quiz'),
(2, 'CSS Basics Quiz');

-- Insert data into the Questions table
INSERT INTO Questions (quiz_id, question_text, correct_answer) VALUES
(1, 'What does HTML stand for?', 'Hyper Text Markup Language'),
(1, 'What is the correct HTML element for inserting a line break?', '<br>'),
(2, 'What does CSS stand for?', 'Cascading Style Sheets'),
(2, 'Which CSS property controls text size?', 'font-size');

-- Insert data into the Options table
INSERT INTO Options (question_id, option_text) VALUES
(1, 'Hyper Text Markup Language'),
(1, 'Home Tool Markup Language'),
(1, 'Hyperlinks Text Markdown Language'),
(2, '<br>'),
(2, '<lb>'),
(2, '<hr>')
(3, 'Cascading Style Sheets'),
(3, 'Colorful Style Sections'),
(3, 'Creative Styles Selections')
(4, 'font-size'),
(4, 'text-size');

-- Insert data into the UserProgress table
INSERT INTO UserProgress (user_id, module_id, quiz_id, score, completed_at) VALUES
(1, 1, 1, 85, NOW()),
(1, 2, 2, 90, NOW()),
(2, 1, NULL, NULL, NULL);

-- Insert data into the FAQs table
INSERT INTO FAQs (faq_id, question, answer) VALUES
(1, 'What is HTML?', 'HTML stands for Hyper Text Markup Language.'),
(2, 'Who built this website?', 'Anton Angeles, Tim Ho, Simon Truong, and Eric Nielsen.');

-- Insert data into the Feedback table
INSERT INTO Feedback (feedback_id, user_id, feedback_text) VALUES
(1, 1, 'Thanks to this platform, I am now an HTML master!'),
(2, 2, 'This course could use some additional CSS examples.');
