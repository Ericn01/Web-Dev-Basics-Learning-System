-- This script is responsible for creating all the tables on our backend database (hosted on google cloud compute VM)

DROP DATABASE IF EXISTS WebDevLearning; -- Remove the database if it already exists (This script should only be ran once on a given MySQL instance)

CREATE DATABASE WebDevLearning;
USE WebDevLearning;

-- TABLE 1: Users - Here we store user information for registration, login, and profile management
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    user_role VARCHAR(10) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP DEFAULT NULL
);

-- TABLE 4: Modules - Stores information for the teaching modules
CREATE TABLE Modules (
    module_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    module_description VARCHAR(255),
    content TEXT NOT NULL,
    banner_image_path VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP DEFAULT NULL
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

-- TABLE 9: Json Web Tokens - Connects a user to a JSON web token

CREATE TABLE Tokens (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  token VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- Now that we've created the tables, we can insert some dummy data into them (mostly for testing purposes, will be removed once we have an actual DB running on the VM)

INSERT INTO Modules (title, module_description, content, banner_image_path) VALUES
-- Part 1: basic HTML module
('Basic HTML', 'Learn the basics of HTML', 
'<div class="module-content>
    <h1>Basic HTML - Getting Started with Web Development</h1>

    <section class="introduction">
        <h2>What is HTML?</h2>
        <p>HTML (HyperText Markup Language) is the standard language used to create web pages. Think of it as the skeleton of every website you visit. It provides the basic structure that tells web browsers how to display content.</p>
    </section>

    <section class="basic-structure">
        <h2>Basic HTML Document Structure</h2>
        <p>Every HTML document follows a standard structure. Here is what it looks like:</p>
        <pre class="code-example">
&lt;!DOCTYPE html&gt;
&lt;html&gt;
    &lt;head&gt;
        &lt;title&gt;My First Webpage&lt;/title&gt;
    &lt;/head&gt;
    &lt;body&gt;
        Content goes here
    &lt;/body&gt;
&lt;/html&gt;
        </pre>
        <ul>
            <li><strong>&lt;!DOCTYPE html&gt;</strong> - Tells the browser this is an HTML5 document</li>
            <li><strong>&lt;html&gt;</strong> - The root element of the page</li>
            <li><strong>&lt;head&gt;</strong> - Contains metadata about the document</li>
            <li><strong>&lt;title&gt;</strong> - Sets the page title (shown in browser tab)</li>
            <li><strong>&lt;body&gt;</strong> - Contains the visible content</li>
        </ul>
    </section>

    <section class="basic-elements">
        <h2>Essential HTML Elements</h2>
        
        <h3>Headings</h3>
        <p>HTML has six levels of headings, from h1 (most important) to h6 (least important):</p>
        <div class="example">
            <h1>This is h1</h1>
            <h2>This is h2</h2>
            <h3>This is h3</h3>
            <p>(and so on to h6)</p>
        </div>

        <h3>Paragraphs</h3>
        <p>Use the &lt;p&gt; tag to create paragraphs of text:</p>
        <pre class="code-example">
&lt;p&gt;This is a paragraph. It can contain lots of text.&lt;/p&gt;
&lt;p&gt;This is another paragraph.&lt;/p&gt;
        </pre>

        <h3>Text Formatting</h3>
        <p>HTML provides several ways to format text:</p>
        <ul>
            <li><strong>&lt;strong&gt;</strong> - Makes text bold</li>
            <li><strong>&lt;em&gt;</strong> - Emphasizes text (usually italic)</li>
            <li><strong>&lt;br&gt;</strong> - Creates a line break</li>
        </ul>

        <h3>Links</h3>
        <p>Links are created using the &lt;a&gt; tag:</p>
        <pre class="code-example">
&lt;a href="https://www.example.com"&gt;Click here to visit Example.com&lt;/a&gt;
        </pre>

        <h3>Images</h3>
        <p>Images are added using the &lt;img&gt; tag:</p>
        <pre class="code-example">
&lt;img src="image.jpg" alt="Description of the image"&gt;
        </pre>
        <p>The "alt" attribute provides alternative text for screen readers and displays if the image fails to load.</p>
    </section>

    <section class="practice-tips">
        <h2>Best Practices</h2>
        <ul>
            <li>Always close your HTML tags</li>
            <li>Use meaningful names for files and folders</li>
            <li>Include proper indentation for better readability</li>
            <li>Always include the alt attribute for images</li>
            <li>Use semantic elements (we will cover these in the next module)</li>
        </ul>
    </section>

    <section class="common-mistakes">
        <h2>Common Mistakes to Avoid</h2>
        <ul>
            <li>Forgetting to close tags</li>
            <li>Skipping the DOCTYPE declaration</li>
            <li>Using incorrect file extensions (always use .html)</li>
            <li>Forgetting to save files before viewing them in the browser</li>
        </ul>
    </section>
</div>'
, '/images/html_banner.jpg'),

-- Part 2: Semantic HTML module
('Semantic HTML', 'Learn how to write meaningful, accessible HTML using semantic elements', 

'
<div class="module-content">
    <h1>Semantic HTML - Writing Meaningful Code</h1>

    <section class="introduction">
        <h2>What is Semantic HTML?</h2>
        <p>Semantic HTML uses tags that clearly describe their meaning to both browsers and developers. Instead of using generic div elements everywhere, semantic HTML provides specific tags that explain the purpose of the content they contain.</p>
    </section>

    <section class="importance">
        <h2>Why Use Semantic HTML?</h2>
        <ul>
            <li>Better accessibility for screen readers and assistive technologies</li>
            <li>Easier code maintenance and readability</li>
            <li>Improved SEO (Search Engine Optimization)</li>
            <li>Clearer code structure</li>
        </ul>
    </section>

    <section class="common-elements">
        <h2>Common Semantic Elements</h2>

        <h3>Page Structure Elements</h3>
        <pre class="code-example">
&lt;header&gt;    - Page header or section header
&lt;nav&gt;       - Navigation links
&lt;main&gt;      - Main content area
&lt;article&gt;   - Independent, self-contained content
&lt;section&gt;   - Thematic grouping of content
&lt;aside&gt;     - Sidebar content
&lt;footer&gt;    - Page footer or section footer
        </pre>

        <h3>Text Elements</h3>
        <pre class="code-example">
&lt;figure&gt;    - Self-contained content like images, diagrams
&lt;figcaption&gt; - Caption for a figure element
&lt;mark&gt;      - Highlighted text
&lt;time&gt;      - Dates and times
&lt;address&gt;   - Contact information
        </pre>
    </section>

    <section class="example">
        <h2>Example Structure</h2>
        <pre class="code-example">
&lt;body&gt;
    &lt;header&gt;
        &lt;h1&gt;My Website&lt;/h1&gt;
        &lt;nav&gt;
            &lt;ul&gt;
                &lt;li&gt;&lt;a href="#"&gt;Home&lt;/a&gt;&lt;/li&gt;
                &lt;li&gt;&lt;a href="#"&gt;About&lt;/a&gt;&lt;/li&gt;
                &lt;li&gt;&lt;a href="#"&gt;Contact&lt;/a&gt;&lt;/li&gt;
            &lt;/ul&gt;
        &lt;/nav&gt;
    &lt;/header&gt;

    &lt;main&gt;
        &lt;article&gt;
            &lt;h2&gt;Article Title&lt;/h2&gt;
            &lt;p&gt;Article content goes here...&lt;/p&gt;
            
            &lt;figure&gt;
                &lt;img src="image.jpg" alt="Description"&gt;
                &lt;figcaption&gt;Image caption&lt;/figcaption&gt;
            &lt;/figure&gt;
        &lt;/article&gt;

        &lt;aside&gt;
            &lt;h3&gt;Related Content&lt;/h3&gt;
            &lt;p&gt;Sidebar content...&lt;/p&gt;
        &lt;/aside&gt;
    &lt;/main&gt;

    &lt;footer&gt;
        &lt;p&gt;&copy; 2024 My Website&lt;/p&gt;
    &lt;/footer&gt;
&lt;/body&gt;
        </pre>
    </section>

    <section class="best-practices">
        <h2>Best Practices</h2>
        <ul>
            <li>Use semantic elements whenever possible instead of generic divs</li>
            <li>Ensure proper nesting of elements</li>
            <li>Use only one &lt;h1&gt; per page</li>
            <li>Keep the document structure logical and clear</li>
            <li>Consider accessibility when choosing elements</li>
        </ul>
    </section>
</div>', 

'/images/semantic_html_banner.jpg'),

-- Part 3: HTML forms module
('HTML Forms', 'Learn everything there is to know about creating HTML forms!', 

'<div class="module-content">
    <h1>HTML Forms - Collecting User Input</h1>

    <section class="introduction">
        <h2>What are HTML Forms?</h2>
        <p>HTML forms are essential elements that allow users to input data on websites. Every time you log into a website, search for something, or fill out an online survey, you are using an HTML form. Forms create an interactive bridge between users and websites.</p>
    </section>

    <section class="basic-structure">
        <h2>Basic Form Structure</h2>
        <p>Forms are created using the &lt;form&gt; element, which contains various input elements:</p>
        <pre class="code-example">
&lt;form action="/submit" method="post"&gt;
    &lt;label for="username"&gt;Username:&lt;/label&gt;
    &lt;input type="text" id="username" name="username"&gt;
    
    &lt;button type="submit"&gt;Submit&lt;/button&gt;
&lt;/form&gt;
        </pre>
    </section>

    <section class="form-elements">
        <h2>Common Form Elements</h2>

        <h3>Text Input</h3>
        <pre class="code-example">
&lt;label for="firstname"&gt;First Name:&lt;/label&gt;
&lt;input type="text" id="firstname" name="firstname" placeholder="Enter your first name"&gt;
        </pre>

        <h3>Password Input</h3>
        <pre class="code-example">
&lt;label for="pwd"&gt;Password:&lt;/label&gt;
&lt;input type="password" id="pwd" name="pwd"&gt;
        </pre>

        <h3>Email Input</h3>
        <pre class="code-example">
&lt;label for="email"&gt;Email:&lt;/label&gt;
&lt;input type="email" id="email" name="email" required&gt;
        </pre>

        <h3>Radio Buttons</h3>
        <pre class="code-example">
&lt;p&gt;Select your gender:&lt;/p&gt;
&lt;input type="radio" id="male" name="gender" value="male"&gt;
&lt;label for="male"&gt;Male&lt;/label&gt;

&lt;input type="radio" id="female" name="gender" value="female"&gt;
&lt;label for="female"&gt;Female&lt;/label&gt;

&lt;input type="radio" id="other" name="gender" value="other"&gt;
&lt;label for="other"&gt;Other&lt;/label&gt;
        </pre>

        <h3>Checkboxes</h3>
        <pre class="code-example">
&lt;p&gt;Select your hobbies:&lt;/p&gt;
&lt;input type="checkbox" id="reading" name="hobby" value="reading"&gt;
&lt;label for="reading"&gt;Reading&lt;/label&gt;

&lt;input type="checkbox" id="gaming" name="hobby" value="gaming"&gt;
&lt;label for="gaming"&gt;Gaming&lt;/label&gt;
        </pre>

        <h3>Select Dropdown</h3>
        <pre class="code-example">
&lt;label for="country"&gt;Country:&lt;/label&gt;
&lt;select id="country" name="country"&gt;
    &lt;option value=""&gt;Select a country&lt;/option&gt;
    &lt;option value="usa"&gt;USA&lt;/option&gt;
    &lt;option value="canada"&gt;Canada&lt;/option&gt;
    &lt;option value="uk"&gt;UK&lt;/option&gt;
&lt;/select&gt;
        </pre>

        <h3>Textarea</h3>
        <pre class="code-example">
&lt;label for="message"&gt;Message:&lt;/label&gt;
&lt;textarea id="message" name="message" rows="4" cols="50"&gt;&lt;/textarea&gt;
        </pre>
    </section>

    <section class="form-attributes">
        <h2>Important Form Attributes</h2>
        <ul>
            <li><strong>required</strong> - Makes a field mandatory</li>
            <li><strong>placeholder</strong> - Shows hint text in empty fields</li>
            <li><strong>disabled</strong> - Makes a field unusable</li>
            <li><strong>readonly</strong> - Makes a field uneditable but still submittable</li>
            <li><strong>maxlength</strong> - Sets maximum number of characters</li>
            <li><strong>min/max</strong> - Sets minimum/maximum values for number inputs</li>
        </ul>
    </section>

    <section class="complete-example">
        <h2>Complete Form Example</h2>
        <pre class="code-example">
&lt;form action="/submit" method="post"&gt;
    &lt;div class="form-group"&gt;
        &lt;label for="fullname"&gt;Full Name:&lt;/label&gt;
        &lt;input type="text" id="fullname" name="fullname" required&gt;
    &lt;/div&gt;

    &lt;div class="form-group"&gt;
        &lt;label for="email"&gt;Email:&lt;/label&gt;
        &lt;input type="email" id="email" name="email" required&gt;
    &lt;/div&gt;

    &lt;div class="form-group"&gt;
        &lt;label for="age"&gt;Age:&lt;/label&gt;
        &lt;input type="number" id="age" name="age" min="18" max="120"&gt;
    &lt;/div&gt;

    &lt;div class="form-group"&gt;
        &lt;label for="interests"&gt;Interests:&lt;/label&gt;
        &lt;select id="interests" name="interests" multiple&gt;
            &lt;option value="sports"&gt;Sports&lt;/option&gt;
            &lt;option value="music"&gt;Music&lt;/option&gt;
            &lt;option value="technology"&gt;Technology&lt;/option&gt;
            &lt;option value="art"&gt;Art&lt;/option&gt;
        &lt;/select&gt;
    &lt;/div&gt;

    &lt;div class="form-group"&gt;
        &lt;label for="bio"&gt;Biography:&lt;/label&gt;
        &lt;textarea id="bio" name="bio" rows="4" cols="50" 
            placeholder="Tell us about yourself..."&gt;&lt;/textarea&gt;
    &lt;/div&gt;

    &lt;div class="form-group"&gt;
        &lt;label&gt;
            &lt;input type="checkbox" name="terms" required&gt;
            I agree to the terms and conditions
        &lt;/label&gt;
    &lt;/div&gt;

    &lt;button type="submit"&gt;Submit Form&lt;/button&gt;
    &lt;button type="reset"&gt;Reset Form&lt;/button&gt;
&lt;/form&gt;
        </pre>
    </section>

    <section class="best-practices">
        <h2>Form Best Practices</h2>
        <ul>
            <li>Always use labels for form controls</li>
            <li>Group related form elements using fieldset</li>
            <li>Provide clear feedback for validation errors</li>
            <li>Use appropriate input types (email, tel, number, etc.)</li>
            <li>Make forms keyboard-accessible</li>
            <li>Include proper form validation</li>
            <li>Use clear and descriptive error messages</li>
            <li>Keep forms as simple as possible</li>
        </ul>
    </section>
</div>)', 
'/images/html_forms_banner.jpg'),

-- Part 4: HTML Tables
('HTML Tables', 'HTML tables are pretty cool eh?',

'<div class="module-content">
    <h1>HTML Tables - Organizing Data</h1>

    <section class="introduction">
        <h2>What are HTML Tables?</h2>
        <p>HTML tables allow you to organize data into rows and columns. They are perfect for displaying structured information like spreadsheets, schedules, or any data that benefits from a grid layout.</p>
    </section>

    <section class="basic-structure">
        <h2>Basic Table Structure</h2>
        <pre class="code-example">
&lt;table&gt;
    &lt;tr&gt;           <!-- Table Row -->
        &lt;th&gt;Header 1&lt;/th&gt;    <!-- Table Header -->
        &lt;th&gt;Header 2&lt;/th&gt;
    &lt;/tr&gt;
    &lt;tr&gt;
        &lt;td&gt;Data 1&lt;/td&gt;      <!-- Table Data -->
        &lt;td&gt;Data 2&lt;/td&gt;
    &lt;/tr&gt;
&lt;/table&gt;
        </pre>
    </section>

    <section class="table-elements">
        <h2>Essential Table Elements</h2>
        <ul>
            <li><strong>&lt;table&gt;</strong> - Defines the table</li>
            <li><strong>&lt;tr&gt;</strong> - Creates a table row</li>
            <li><strong>&lt;th&gt;</strong> - Defines a header cell</li>
            <li><strong>&lt;td&gt;</strong> - Defines a data cell</li>
            <li><strong>&lt;thead&gt;</strong> - Groups header content</li>
            <li><strong>&lt;tbody&gt;</strong> - Groups body content</li>
            <li><strong>&lt;tfoot&gt;</strong> - Groups footer content</li>
        </ul>
    </section>

    <section class="table-attributes">
        <h2>Table Attributes</h2>
        <h3>Cell Spanning</h3>
        <pre class="code-example">
&lt;td colspan="2"&gt;Spans two columns&lt;/td&gt;
&lt;td rowspan="3"&gt;Spans three rows&lt;/td&gt;
        </pre>

        <h3>Accessibility Attributes</h3>
        <pre class="code-example">
&lt;table&gt;
    &lt;caption&gt;Monthly Budget&lt;/caption&gt;
    &lt;tr&gt;
        &lt;th scope="col"&gt;Item&lt;/th&gt;
        &lt;th scope="col"&gt;Amount&lt;/th&gt;
    &lt;/tr&gt;
&lt;/table&gt;
        </pre>
    </section>

    <section class="complete-example">
        <h2>Complete Table Example</h2>
        <pre class="code-example">
&lt;table&gt;
    &lt;caption&gt;Quarterly Sales Report&lt;/caption&gt;
    &lt;thead&gt;
        &lt;tr&gt;
            &lt;th scope="col"&gt;Quarter&lt;/th&gt;
            &lt;th scope="col"&gt;Revenue&lt;/th&gt;
            &lt;th scope="col"&gt;Costs&lt;/th&gt;
            &lt;th scope="col"&gt;Profit&lt;/th&gt;
        &lt;/tr&gt;
    &lt;/thead&gt;
    &lt;tbody&gt;
        &lt;tr&gt;
            &lt;th scope="row"&gt;Q1&lt;/th&gt;
            &lt;td&gt;$10,000&lt;/td&gt;
            &lt;td&gt;$8,000&lt;/td&gt;
            &lt;td&gt;$2,000&lt;/td&gt;
        &lt;/tr&gt;
        &lt;tr&gt;
            &lt;th scope="row"&gt;Q2&lt;/th&gt;
            &lt;td&gt;$12,000&lt;/td&gt;
            &lt;td&gt;$9,000&lt;/td&gt;
            &lt;td&gt;$3,000&lt;/td&gt;
        &lt;/tr&gt;
    &lt;/tbody&gt;
    &lt;tfoot&gt;
        &lt;tr&gt;
            &lt;th scope="row"&gt;Total&lt;/th&gt;
            &lt;td&gt;$22,000&lt;/td&gt;
            &lt;td&gt;$17,000&lt;/td&gt;
            &lt;td&gt;$5,000&lt;/td&gt;
        &lt;/tr&gt;
    &lt;/tfoot&gt;
&lt;/table&gt;
        </pre>
    </section>

    <section class="best-practices">
        <h2>Best Practices</h2>
        <ul>
            <li>Use tables only for tabular data, not for layout</li>
            <li>Include proper table headers with scope attributes</li>
            <li>Add captions to describe table content</li>
            <li>Use thead, tbody, and tfoot for better organization</li>
            <li>Keep tables simple and avoid excessive nesting</li>
        </ul>
    </section>
</div>', 
'/images/html_tables_banner.jpg'),

('CSS Basics', 'CSS is some cool stuff dude', 
'<div class="module-content">
    <h1>CSS Basics - Styling Your Web Pages</h1>

    <section class="introduction">
        <h2>What is CSS?</h2>
        <p>CSS (Cascading Style Sheets) is a language used to style HTML documents. It describes how elements should be displayed on screen, on paper, or in other media.</p>
    </section>

    <section class="css-syntax">
        <h2>CSS Syntax</h2>
        <pre class="code-example">
selector {
    property: value;
    another-property: value;
}
        </pre>

        <h3>Example:</h3>
        <pre class="code-example">
p {
    color: blue;
    font-size: 16px;
}
        </pre>
    </section>

    <section class="selectors">
        <h2>Common CSS Selectors</h2>
        <pre class="code-example">
/* Element Selector */
p { color: red; }

/* Class Selector */
.highlight { background-color: yellow; }

/* ID Selector */
#header { font-size: 24px; }

/* Descendant Selector */
div p { margin-left: 20px; }

/* Multiple Selectors */
h1, h2, h3 { font-family: Arial; }
        </pre>
    </section>

    <section class="properties">
        <h2>Essential CSS Properties</h2>

        <h3>Colors and Background</h3>
        <pre class="code-example">
.element {
    color: blue;                      /* Text color */
    background-color: #f0f0f0;        /* Background color */
    border: 1px solid black;          /* Border */
}
        </pre>

        <h3>Typography</h3>
        <pre class="code-example">
.text {
    font-family: Arial, sans-serif;
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    line-height: 1.5;
}
        </pre>

        <h3>Box Model</h3>
        <pre class="code-example">
.box {
    margin: 10px;        /* Space outside the border */
    padding: 15px;       /* Space inside the border */
    border: 1px solid;   /* Border around element */
    width: 200px;
    height: 100px;
}
        </pre>

        <h3>Display and Positioning</h3>
        <pre class="code-example">
.element {
    display: block;          /* or inline, inline-block, flex */
    position: relative;      /* or absolute, fixed, static */
    top: 10px;
    left: 20px;
}
        </pre>
    </section>

    <section class="applying-css">
        <h2>Ways to Apply CSS</h2>

        <h3>1. Inline CSS</h3>
        <pre class="code-example">
&lt;p style="color: blue; font-size: 16px;"&gt;This is a paragraph&lt;/p&gt;
        </pre>

        <h3>2. Internal CSS</h3>
        <pre class="code-example">
&lt;head&gt;
    &lt;style&gt;
        p {
            color: blue;
            font-size: 16px;
        }
    &lt;/style&gt;
&lt;/head&gt;
        </pre>

        <h3>3. External CSS</h3>
        <pre class="code-example">
&lt;head&gt;
    &lt;link rel="stylesheet" href="styles.css"&gt;
&lt;/head&gt;
        </pre>
    </section>

    <section class="best-practices">
        <h2>CSS Best Practices</h2>
        <ul>
            <li>Use external stylesheets for maintainability</li>
            <li>Follow a consistent naming convention</li>
            <li>Organize CSS properties logically</li>
            <li>Avoid inline styles when possible</li>
            <li>Use meaningful class names</li>
            <li>Keep selectors simple and efficient</li>
        </ul>
    </section>
</div>',
'/images/css_basics_banner.jpg'),

('HTTP GET and POST', 'Retrieve and add data from/to a remote server!', 
'<div class="module-content">
    <h1>HTTP GET and POST Methods</h1>

    <section class="introduction">
        <h2>Understanding HTTP Methods</h2>
        <p>HTTP methods are the foundation of client-server communication on the web. GET and POST are the two most commonly used methods for sending data between a web browser and a server.</p>
    </section>

    <section class="get-method">
        <h2>The GET Method</h2>
        <p>GET requests data from a specified resource. It is the most common HTTP method.</p>

        <h3>Characteristics of GET:</h3>
        <ul>
            <li>Data is sent as part of the URL</li>
            <li>Data is visible in the browser address bar</li>
            <li>Can be bookmarked</li>
            <li>Has length restrictions</li>
            <li>Should only retrieve data, not modify it</li>
        </ul>

        <h3>Example GET Request:</h3>
        <pre class="code-example">
&lt;a href="search.php?query=dogs&category=pets"&gt;Search for Dogs&lt;/a&gt;

&lt;form action="/search" method="get"&gt;
    &lt;input type="text" name="query"&gt;
    &lt;input type="submit" value="Search"&gt;
&lt;/form&gt;
        </pre>

        <p>Resulting URL: <code>https://example.com/search?query=dogs&category=pets</code></p>
    </section>

    <section class="post-method">
        <h2>The POST Method</h2>
        <p>POST submits data to be processed to a specified resource.</p>

        <h3>Characteristics of POST:</h3>
        <ul>
            <li>Data is sent in the request body</li>
            <li>Data is not visible in the URL</li>
            <li>Cannot be bookmarked</li>
            <li>No size restrictions</li>
            <li>Used for submitting sensitive data</li>
        </ul>

        <h3>Example POST Form:</h3>
        <pre class="code-example">
&lt;form action="/login" method="post"&gt;
    &lt;input type="text" name="username"&gt;
    &lt;input type="password" name="password"&gt;
    &lt;input type="submit" value="Login"&gt;
&lt;/form&gt;
        </pre>
    </section>

    <section class="comparison">
        <h2>GET vs POST Comparison</h2>
        <table>
            <tr>
                <th>Feature</th>
                <th>GET</th>
                <th>POST</th>
            </tr>
            <tr>
                <td>Visibility</td>
                <td>Data visible in URL</td>
                <td>Data not visible in URL</td>
            </tr>
            <tr>
                <td>Security</td>
                <td>Less secure</td>
                <td>More secure</td>
            </tr>
            <tr>
                <td>Caching</td>
                <td>Can be cached</td>
                <td>Not cached</td>
            </tr>
            <tr>
                <td>Length restrictions</td>
                <td>Yes (URL length limits)</td>
                <td>No</td>
            </tr>
            <tr>
                <td>Typical use</td>
                <td>Retrieving data</td>
                <td>Submitting data</td>
            </tr>
        </table>
    </section>

    <section class="when-to-use">
        <h2>When to Use Each Method</h2>

        <h3>Use GET when:</h3>
        <ul>
            <li>Requesting data (reading operations)</li>
            <li>Performing searches</li>
            <li>Sharing links</li>
            <li>Bookmarking functionality is needed</li>
        </ul>

        <h3>Use POST when:</h3>
        <ul>
            <li>Submitting login forms</li>
            <li>Uploading files</li>
            <li>Sending sensitive data</li>
            <li>Modifying database records</li>
        </ul>
    </section>

    <section class="security-considerations">
        <h2>Security Considerations</h2>
        <ul>
            <li>Never use GET for sensitive data</li>
            <li>Always use HTTPS for secure communications</li>
            <li>Validate all input data on both client and server</li>
            <li>Protect against CSRF attacks</li>
            <li>Consider rate limiting for form submissions</li>
        </ul>
    </section>
</div>',
'/images/http_methods_banner.jpg');

-- First, create the quizzes
INSERT INTO Quizzes (module_id, title) VALUES
(1, 'HTML Fundamentals Quiz'),
(1, 'HTML Elements and Syntax Quiz'),
(2, 'Understanding Semantic HTML'),
(3, 'HTML Forms Basics Quiz'),
(3, 'HTML Form Elements and Attributes Quiz'),
(4, 'HTML tables Quiz'),
(5, 'CSS basics Quiz'),
(6, 'HTTP GET Quiz'),
(6, 'HTTP POST Quiz');

INSERT INTO Questions (quiz_id, question_text, correct_answer) VALUES

-- Questions for Quiz 1: Basic HTML
(1, 'What does HTML stand for?', 'HyperText Markup Language'),
(1, 'Which tag is used to define the root element of an HTML document?', '<html>'),
(1, 'What is the correct file extension for HTML files?', '.html'),
(1, 'Which tag contains metadata about the HTML document?', '<head>'),
(1, 'Which tag contains the visible content of a webpage?', '<body>'),

-- Questions for Quiz 2: HTML Elements and Syntax
(2, 'Which HTML element is used to define the most important heading?', '<h1>'),
(2, 'What is the correct HTML element for inserting a line break?', '<br>'),
(2, 'Which attribute is used to provide alternative text for an image?', 'alt'),
(2, 'Which HTML element is used to create a hyperlink?', '<a>'),
(2, 'How do you create a paragraph in HTML?', '<p>'),

-- Questions for Quiz 3: Semantic HTML
(3, 'Which semantic element should be used to mark up the main navigation menu of a website?', '<nav>'),
(3, 'What is the most appropriate semantic element for a blog post or news article?', '<article>'),
(3, 'Which semantic element should be used for content that is related but not essential to the main content?', '<aside>'),
(3, 'What semantic element should wrap the main content area of your webpage?', '<main>'),
(3, 'Which semantic element should be used to group a set of related content with its own heading?', '<section>'),

-- Questions for Quiz 4: HTML Forms Basics
(4, 'Which HTML element is used to create a form?', '<form>'),
(4, 'What attribute specifies where form data should be sent?', 'action'),
(4, 'Which input type creates a password field that masks text?', 'password'),
(4, 'What attribute makes a form field required?', 'required'),
(4, 'Which button type clears all form fields to their default value?', 'reset'),

(5, 'Which input type is used for multiple-choice selections where multiple answers are allowed?', 'checkbox'),
(5, 'What element creates a dropdown selection menu?', '<select>'),
(5, 'Which element is used for multi-line text input?', '<textarea>'),
(5, 'What input type should be used for email addresses?', 'email'),
(5, 'Which attribute provides a short hint describing the expected value of an input field?', 'placeholder'),

-- Quiz 6: HTML Tables
(6, 'Which HTML tag defines a table header cell?', '<th>'),
(6, 'What attribute is used to make a cell span multiple columns?', 'colspan'),
(6, 'Which tag is used to group header content in a table?', '<thead>'),
(6, 'What is the correct tag for creating a table row?', '<tr>'),
(6, 'Which attribute should be used on table headers to specify whether it is a header for a row or column?', 'scope'),

-- Questions for Quiz 7: CSS Basics Quiz */
(7, 'Which symbol is used to specify a class selector in CSS?', '.'),
(7, 'What property is used to change the text color in CSS?', 'color'),
(7, 'Which CSS property controls the space outside an element border?', 'margin'),
(7, 'What value of the display property makes an element a flex container?', 'flex'),
(7, 'Which property is used to change the font size in CSS?', 'font-size'),

-- Questions for Quiz 8: HTTP GET
(8, 'What is the main purpose of HTTP GET method?', 'To retrieve data from a specified resource'),
(8, 'Which of the following is true about data sent using GET method?', 'Data is visible in the URL'),
(8, 'What is the maximum length of a URL in modern browsers?', '2048 characters'),
(8, 'Are GET requests cached by browsers?', 'Yes'),
(8, 'Can GET requests be bookmarked?', 'Yes'),

-- Questions for Quiz 9: HTTP POST
(9, 'What is the primary purpose of HTTP POST method?', 'To submit data to be processed to a specified resource'),
(9, 'How is data sent in POST requests?', 'In the request body'),
(9, 'Are POST requests cached?', 'No'),
(9, 'Which HTTP status code typically indicates a successful POST request?', '201 Created'),
(9, 'Can POST requests be bookmarked?', 'No');

-- Options for Quiz 1 questions
INSERT INTO Options (question_id, option_text) VALUES
-- Options for "What does HTML stand for?"
(1, 'HyperText Markup Language'),
(1, 'High-Level Text Management Language'),
(1, 'Home Tool Markup Language'),
(1, 'Hyperlinks and Text Markup Language'),

-- Options for "Which tag is used to define the root element of an HTML document?"
(2, '<html>'),
(2, '<root>'),
(2, '<main>'),
(2, '<document>'),

-- Options for "What is the correct file extension for HTML files?"
(3, '.html'),
(3, '.htm'),
(3, '.web'),
(3, '.doc'),

-- Options for "Which tag contains metadata about the HTML document?"
(4, '<head>'),
(4, '<meta>'),
(4, '<header>'),
(4, '<top>'),

-- Options for "Which tag contains the visible content of a webpage?"
(5, '<body>'),
(5, '<content>'),
(5, '<main>'),
(5, '<page>');

-- OPTIONS FOR QUIZ 2 QUESTIONS
INSERT INTO Options (question_id, option_text) VALUES
-- Options for "Which HTML element is used to define the most important heading?"
(6, '<h1>'),
(6, '<heading>'),
(6, '<head>'),
(6, '<title>'),

-- Options for "What is the correct HTML element for inserting a line break?"
(7, '<br>'),
(7, '<break>'),
(7, '<lb>'),
(7, '<newline>'),

-- Options for "Which attribute is used to provide alternative text for an image?"
(8, 'alt'),
(8, 'title'),
(8, 'description'),
(8, 'text'),

-- Options for "Which HTML element is used to create a hyperlink?"
(9, '<a>'),
(9, '<link>'),
(9, '<href>'),
(9, '<url>'),

-- Options for "How do you create a paragraph in HTML?"
(10, '<p>'),
(10, '<paragraph>'),
(10, '<text>'),
(10, '<para>');


-- Add options for each question
INSERT INTO Options (question_id, option_text) VALUES 
-- Navigation question options
(11, '<nav>'),
(11, '<menu>'),
(11, '<navigation>'),
(11, '<navbar>'),

-- Article question options
(12, '<article>'),
(12, '<content>'),
(12, '<post>'),
(12, '<text>'),

-- Aside question options
(13, '<aside>'),
(13, '<sidebar>'),
(13, '<related>'),
(13, '<secondary>'),

-- Main content question options
(14, '<main>'),
(14, '<content>'),
(14, '<primary>'),
(14, '<body>'),

-- Section question options
(15, '<section>'),
(15, '<div>'),
(15, '<group>'),
(15, '<content>');


-- Options for Quiz 1
INSERT INTO Options (question_id, option_text) VALUES 
-- Form element options
(16, '<form>'),
(16, '<input>'),
(16, '<field>'),
(16, '<formfield>'),

-- Action attribute options
(17, 'action'),
(17, 'submit'),
(17, 'destination'),
(17, 'sendto'),

-- Password field options
(18, 'password'),
(18, 'secret'),
(18, 'hidden'),
(18, 'secure'),

-- Required attribute options
(19, 'required'),
(19, 'mandatory'),
(19, 'needed'),
(19, 'important'),

-- Reset button options
(20, 'reset'),
(20, 'clear'),
(20, 'default'),
(20, 'refresh');


INSERT INTO Options (question_id, option_text) VALUES 
-- Checkbox options
(21, 'checkbox'),
(21, 'multiple'),
(21, 'choice'),
(21, 'select'),

-- Dropdown menu options
(22, '<select>'),
(22, '<dropdown>'),
(22, '<option>'),
(22, '<menu>'),

-- Textarea options
(23, '<textarea>'),
(23, '<textbox>'),
(23, '<multiline>'),
(23, '<input type="text">'),

-- Email type options
(24, 'email'),
(24, 'mail'),
(24, 'text'),
(24, 'address'),

-- Placeholder options
(25, 'placeholder'),
(25, 'hint'),
(25, 'preview'),
(25, 'default');

INSERT INTO Options (question_id, option_text) VALUES
(26, '<th>'),
(26, '<td>'),
(26, '<header>'),
(26, '<thead>'),

(27, 'colspan'),
(27, 'rowspan'),
(27, 'span'),
(27, 'colwidth'),

(28, '<thead>'),
(28, '<header>'),
(28, '<th>'),
(28, '<thead>'),

(29, '<tr>'),
(29, '<row>'),
(29, '<td>'),
(29, '<tablerow>'),

(30, 'scope'),
(30, 'type'),
(30, 'header'),
(30, 'format');

INSERT INTO Options (question_id, option_text) VALUES
(31, '.'),
(31, '#'),
(31, '@'),
(31, '*'),

(32, 'color'),
(32, 'text-color'),
(32, 'font-color'),
(32, 'text-style'),

(33, 'margin'),
(33, 'padding'),
(33, 'spacing'),
(33, 'border-space'),

(34, 'flex'),
(34, 'flexbox'),
(34, 'flexible'),
(34, 'flex-box'),

(35, 'font-size'),
(35, 'text-size'),
(35, 'size'),
(35, 'text-font-size');

-- Insert options for HTTP GET Quiz questions
INSERT INTO Options (question_id, option_text) VALUES
(36, 'To retrieve data from a specified resource'),
(36, 'To submit data to be processed to a specified resource'),
(36, 'To update a resource'),
(36, 'To delete a resource'),

(37, 'Data is visible in the URL'),
(37, 'Data is hidden from the URL'),
(37, 'Data is encrypted in transit'),
(37, 'Data can only be sent as JSON'),

(38, '2048 characters'),
(38, '1024 characters'),
(38, 'Unlimited length'),
(38, '512 characters'),

(39, 'Yes'),
(39, 'No'),
(39, 'Only if specified in headers'),
(39, 'Only in private browsing mode'),

(40, 'Yes'),
(40, 'No'),
(40, 'Only if encoded properly'),
(40, 'Only in modern browsers');

-- Insert options for HTTP POST Quiz questions
INSERT INTO Options (question_id, option_text) VALUES
(41, 'To submit data to be processed to a specified resource'),
(41, 'To retrieve data from a specified resource'),
(41, 'To delete a resource'),
(41, 'To check if a resource exists'),

(42, 'In the request body'),
(42, 'In the URL parameters'),
(42, 'In the request headers only'),
(42, 'In cookies only'),

(43, 'No'),
(43, 'Yes'),
(43, 'Only if specified in headers'),
(43, 'Depends on the browser'),

(44, '201 Created'),
(44, '200 OK'),
(44, '204 No Content'),
(44, '202 Accepted'),

(45, 'No'),
(45, 'Yes'),
(45, 'Only if data is encoded'),
(45, 'Only with modern browsers');


-- 1) Create mock users and some basic user progress values
INSERT INTO Users (username, email, `password`) VALUES
('sarah_dev', 'sarah.dev@gmail.com', 'hashed_password_123'),
('code_master', 'master.coder@outlook.com', 'hashed_password_456'),
('web_learner', 'learning.web@yahoo.com', 'hashed_password_789'),
('html_enthusiast', 'html.fan@hotmail.com', 'hashed_password_012'),
('css_ninja', 'css.ninja@gmail.com', 'hashed_password_345');


-- Sarah's progress (completed everything with high scores)
INSERT INTO UserProgress (user_id, module_id, quiz_id, score, completed_at) VALUES
(1, 1, 1, 95, '2024-11-15 10:00:00'),
(1, 1, 2, 90, '2024-11-15 11:30:00'),
(1, 2, 3, 88, '2024-11-16 14:20:00'),
(1, 3, 4, 92, '2024-11-17 09:45:00'),
(1, 4, 5, 85, '2024-11-18 16:30:00'),
(1, 5, 6, 94, '2024-11-19 13:15:00'),
(1, 6, 7, 89, '2024-11-20 11:00:00');

-- Code Master's progress (completed first few modules with average scores)
INSERT INTO UserProgress (user_id, module_id, quiz_id, score, completed_at) VALUES
(2, 1, 1, 75, '2024-11-15 09:00:00'),
(2, 1, 2, 82, '2024-11-15 10:30:00'),
(2, 2, 3, 78, '2024-11-16 14:00:00'),
(2, 3, 4, 80, '2024-11-17 11:45:00'),
(2, 4, 5, NULL, NULL),
(2, 5, 6, NULL, NULL),
(2, 6, 7, NULL, NULL);

-- Web Learner's progress (just starting out, completed only first module)
INSERT INTO UserProgress (user_id, module_id, quiz_id, score, completed_at) VALUES
(3, 1, 1, 65, '2024-11-20 15:30:00'),
(3, 1, 2, 70, '2024-11-20 16:45:00'),
(3, 2, 3, NULL, NULL),
(3, 3, 4, NULL, NULL),
(3, 4, 5, NULL, NULL),
(3, 5, 6, NULL, NULL),
(3, 6, 7, NULL, NULL);

-- HTML Enthusiast's progress (focused on HTML modules, skipped CSS)
INSERT INTO UserProgress (user_id, module_id, quiz_id, score, completed_at) VALUES
(4, 1, 1, 88, '2024-11-10 10:00:00'),
(4, 1, 2, 92, '2024-11-10 11:30:00'),
(4, 2, 3, 85, '2024-11-11 14:00:00'),
(4, 3, 4, 90, '2024-11-12 16:30:00'),
(4, 4, 5, 87, '2024-11-13 13:45:00'),
(4, 5, 6, NULL, NULL),
(4, 6, 7, NULL, NULL);

-- CSS Ninja's progress (skipped to CSS module)
INSERT INTO UserProgress (user_id, module_id, quiz_id, score, completed_at) VALUES
(5, 1, 1, NULL, NULL),
(5, 1, 2, NULL, NULL),
(5, 2, 3, NULL, NULL),
(5, 3, 4, NULL, NULL),
(5, 4, 5, NULL, NULL),
(5, 5, 6, 96, '2024-11-19 09:30:00'),
(5, 6, 7, NULL, NULL);


-- User Feedback entries
INSERT INTO Feedback (user_id, feedback_text, submitted_at) VALUES
(1, 'Great learning experience! The progression from basic HTML to more complex topics was well structured. Would love to see some JavaScript modules added in the future.', '2024-11-20 14:30:00'),
(1, 'The quizzes really helped reinforce the concepts. Maybe add some practical exercises too?', '2024-11-21 09:15:00'),

(2, 'The HTML modules were helpful, but I found some of the examples a bit too basic. Could use more real-world scenarios.', '2024-11-17 16:45:00'),
(2, 'Interactive elements in the lessons would make learning more engaging.', '2024-11-18 11:20:00'),

(3, 'As a complete beginner, I appreciate how well the basic HTML module explains concepts. The examples are very clear.', '2024-11-20 17:00:00'),

(4, 'The HTML sections are excellent! Very comprehensive coverage of tables and forms. Looking forward to starting the CSS modules.', '2024-11-13 15:30:00'),
(4, 'Would be great to have some downloadable cheat sheets for quick reference.', '2024-11-14 10:45:00'),

(5, 'The CSS module was perfect for my needs. Consider adding some advanced CSS topics like animations and flexbox layouts.', '2024-11-19 13:25:00');

-- FAQ entries
INSERT INTO FAQs (question, answer) VALUES
('How long does it take to complete all modules?', 'The time varies per person, but most students complete all modules within 4-6 weeks when studying 1-2 hours per day.'),

('Do I need any prior programming experience?', 'No prior experience is needed! Our modules start from the basics and gradually progress to more advanced topics.'),

('Can I skip to advanced modules if I already know the basics?', 'Yes! While we recommend following the curriculum order, you can choose which modules to complete based on your knowledge level.'),

('Are the quizzes mandatory to progress?', 'Quizzes are recommended to test your understanding, but you can review the learning material without taking them.'),

('How often is the content updated?', 'We regularly review and update our content to ensure it aligns with current web development standards and best practices.'),

('Is there a mobile version for learning on the go?', 'Yes! Our platform is fully responsive and can be accessed on any device with a web browser.'),

('What should I learn after completing these modules?', 'We recommend learning JavaScript next, followed by a backend programming language like Python or Node.js.'),

('Do you provide certificates upon completion?', 'Yes! You receive a certificate of completion after finishing all modules with a minimum average score of 70%.'),

('Can I get help if I''m stuck on a concept?', 'Absolutely! You can post questions in our community forum or use the "Ask for Help" feature in each module.'),

('Are there any prerequisites for the CSS modules?', 'Basic understanding of HTML is recommended before starting the CSS modules, as CSS works hand-in-hand with HTML.');