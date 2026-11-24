-- ============================================================================
-- STEP 1 & 2: DATABASE & NORMALIZED TABLE CREATION (3NF)
-- ============================================================================

DROP DATABASE IF EXISTS university_info_system;
CREATE DATABASE university_info_system;
USE university_info_system;

-- 1. Students Table
CREATE TABLE Students (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    age INT NOT NULL CHECK (age > 17)
);

-- 2. Instructors Table
CREATE TABLE Instructors (
    instructor_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL
);

-- 3. Courses Table (Linked to Instructors via Foreign Key for 3NF)
CREATE TABLE Courses (
    course_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL UNIQUE,
    credits INT NOT NULL CHECK (credits BETWEEN 1 AND 6),
    instructor_id INT NOT NULL,
    CONSTRAINT fk_course_instructor
        FOREIGN KEY (instructor_id) REFERENCES Instructors(instructor_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

-- 4. Enrollments Junction Table (Resolves Many-to-Many between Students & Courses)
CREATE TABLE Enrollments (
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    grade CHAR(2) CHECK (grade IN ('A', 'B', 'C', 'D', 'E', 'F') OR grade IS NULL),
    PRIMARY KEY (student_id, course_id),
    CONSTRAINT fk_enrollment_student
        FOREIGN KEY (student_id) REFERENCES Students(student_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_enrollment_course
        FOREIGN KEY (course_id) REFERENCES Courses(course_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

-- ============================================================================
-- STEP 3: INSERT SAMPLE DATA
-- ============================================================================

-- Insert 4 Students (4th student intentionally left unenrolled to test Query 3)
INSERT INTO Students (name, email, age) VALUES
    ('Golden-Joe Osegbe', 'golden.joe@university.edu', 24),
    ('Victory Osegbe', 'victory.o@university.edu', 22),
    ('Denzel Mensah', 'denzel.m@university.edu', 20),
    ('David Okafor', 'david.okafor@university.edu', 19);

-- Insert 3 Instructors
INSERT INTO Instructors (name, department) VALUES
    ('Dr. Ada Lovelace', 'Computer Science'),
    ('Prof. Alan Turing', 'Software Engineering'),
    ('Dr. Grace Hopper', 'Information Systems');

-- Insert 3 Courses
INSERT INTO Courses (title, credits, instructor_id) VALUES
    ('Database Systems', 4, 1),
    ('Web Architecture & APIs', 3, 2),
    ('Operating Systems', 4, 3);

-- Insert 4 Enrollment Records
INSERT INTO Enrollments (student_id, course_id, grade) VALUES
    (1, 1, 'A'),  -- Golden-Joe -> Database Systems
    (2, 1, 'B'),  -- Victory -> Database Systems
    (1, 2, 'A'),  -- Golden-Joe -> Web Architecture & APIs
    (3, 3, 'B');  -- Denzel -> Operating Systems

-- ============================================================================
-- STEP 4: QUERY EXECUTION
-- ============================================================================

-- 1. Retrieve all students enrolled in the course "Database Systems"
SELECT 
    s.student_id,
    s.name AS student_name,
    s.email,
    c.title AS course_title,
    e.grade
FROM Students s
INNER JOIN Enrollments e ON s.student_id = e.student_id
INNER JOIN Courses c ON e.course_id = c.course_id
WHERE c.title = 'Database Systems';

-- 2. List all courses along with the names of their instructors
SELECT 
    c.course_id,
    c.title AS course_title,
    c.credits,
    i.name AS instructor_name,
    i.department
FROM Courses c
INNER JOIN Instructors i ON c.instructor_id = i.instructor_id;

-- 3. Find students who are not enrolled in any course
SELECT 
    s.student_id,
    s.name,
    s.email,
    s.age
FROM Students s
LEFT JOIN Enrollments e ON s.student_id = e.student_id
WHERE e.course_id IS NULL;

-- 4. Update the email address of a student
UPDATE Students
SET email = 'goldenjoe.osegbe@university.edu'
WHERE student_id = 1;

-- Verify the update
SELECT student_id, name, email FROM Students WHERE student_id = 1;

-- 5. Delete a course by its ID (e.g., course_id = 3)
DELETE FROM Courses
WHERE course_id = 3;

-- Verify remaining courses
SELECT * FROM Courses;