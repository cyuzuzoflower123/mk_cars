CREATE DATABASE IF NOT EXISTS employee_management;
USE employee_management;

-- =========================
-- TABLE: mk_user
-- =========================
CREATE TABLE mk_user (
    userID INT AUTO_INCREMENT PRIMARY KEY,
    userName VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- =========================
-- TABLE: mk_post
-- =========================
CREATE TABLE mk_post (
    postID INT AUTO_INCREMENT PRIMARY KEY,
    postName VARCHAR(100) NOT NULL
);

-- =========================
-- TABLE: mk_employees
-- =========================
CREATE TABLE mk_employees (
    employeeID INT AUTO_INCREMENT PRIMARY KEY,
    
    postID INT,

    FirstName VARCHAR(100) NOT NULL,
    LastName VARCHAR(100) NOT NULL,

    gender ENUM('Male', 'Female', 'Other'),

    DateOfBirth DATE,

    email VARCHAR(150) UNIQUE,

    phoneNumber VARCHAR(20),

    position VARCHAR(100),

    HireDate DATE,

    salary DECIMAL(10,2),

    status VARCHAR(50),

    department VARCHAR(100),

    address TEXT,

    CONSTRAINT fk_employee_post
        FOREIGN KEY (postID)
        REFERENCES mk_post(postID)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- =========================
-- OPTIONAL SAMPLE DATA
-- =========================

INSERT INTO mk_post(postName)
VALUES 
('Manager'),
('Accountant'),
('Software Developer'),
('HR Officer');

-- Example user
-- password = admin123
INSERT INTO mk_user(userName, password)
VALUES (
    'admin',
    '$2b$10$Q9bYpJ8zK5lY7H1Hn8Jq2eM0M2jz0K2r2g1W8nW6T8fM4mR9hY6fS'
);