DROP TABLE IF EXISTS activity_log;
DROP TABLE IF EXISTS media;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS post_tags;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  role ENUM('admin', 'editor', 'author', 'subscriber') DEFAULT 'subscriber',
  bio TEXT,
  avatar VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL,
  is_active BOOLEAN DEFAULT TRUE,
  email_verified BOOLEAN DEFAULT FALSE,
  verification_token VARCHAR(255)
);

CREATE TABLE categories (
  category_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  parent_id INT NULL,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_categories_parent FOREIGN KEY (parent_id)
    REFERENCES categories(category_id) ON DELETE SET NULL
);

CREATE TABLE posts (
  post_id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  author_id INT NULL,
  category_id INT NULL,
  status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
  featured_image VARCHAR(255),
  view_count INT DEFAULT 0,
  like_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  published_at TIMESTAMP NULL,
  meta_title VARCHAR(255),
  meta_description TEXT,
  meta_keywords TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  allow_comments BOOLEAN DEFAULT TRUE,
  reading_time INT DEFAULT 1,
  CONSTRAINT fk_posts_author FOREIGN KEY (author_id)
    REFERENCES users(user_id) ON DELETE SET NULL,
  CONSTRAINT fk_posts_category FOREIGN KEY (category_id)
    REFERENCES categories(category_id) ON DELETE SET NULL
);

CREATE TABLE tags (
  tag_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE post_tags (
  post_id INT NOT NULL,
  tag_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (post_id, tag_id),
  CONSTRAINT fk_post_tags_post FOREIGN KEY (post_id)
    REFERENCES posts(post_id) ON DELETE CASCADE,
  CONSTRAINT fk_post_tags_tag FOREIGN KEY (tag_id)
    REFERENCES tags(tag_id) ON DELETE CASCADE
);

CREATE TABLE comments (
  comment_id INT AUTO_INCREMENT PRIMARY KEY,
  post_id INT NOT NULL,
  user_id INT NULL,
  parent_id INT NULL,
  content TEXT NOT NULL,
  status ENUM('pending', 'approved', 'spam', 'trash') DEFAULT 'pending',
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_comments_post FOREIGN KEY (post_id)
    REFERENCES posts(post_id) ON DELETE CASCADE,
  CONSTRAINT fk_comments_user FOREIGN KEY (user_id)
    REFERENCES users(user_id) ON DELETE SET NULL,
  CONSTRAINT fk_comments_parent FOREIGN KEY (parent_id)
    REFERENCES comments(comment_id) ON DELETE CASCADE
);

CREATE TABLE media (
  media_id INT AUTO_INCREMENT PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_type VARCHAR(50),
  file_size INT,
  mime_type VARCHAR(100),
  uploaded_by INT NULL,
  alt_text VARCHAR(255),
  caption TEXT,
  width INT,
  height INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_media_user FOREIGN KEY (uploaded_by)
    REFERENCES users(user_id) ON DELETE SET NULL
);

CREATE TABLE activity_log (
  log_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id INT,
  description TEXT,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_activity_user FOREIGN KEY (user_id)
    REFERENCES users(user_id) ON DELETE SET NULL
);

INSERT INTO users (username, email, password_hash, first_name, last_name, role, is_active, email_verified)
VALUES
  ('admin', 'admin@educms.com', '$2a$10$8K1p/a0dL3.R.Q4Vqkj1weJH.8H8j4LQ0Uq0QZ0X0X0X0X0X0X0X0', 'Admin', 'User', 'admin', TRUE, TRUE),
  ('editor', 'editor@educms.com', '$2a$10$8K1p/a0dL3.R.Q4Vqkj1weJH.8H8j4LQ0Uq0QZ0X0X0X0X0X0X0X0', 'Editor', 'User', 'editor', TRUE, TRUE),
  ('author', 'author@educms.com', '$2a$10$8K1p/a0dL3.R.Q4Vqkj1weJH.8H8j4LQ0Uq0QZ0X0X0X0X0X0X0X0', 'Author', 'User', 'author', TRUE, TRUE);

INSERT INTO categories (name, slug, description, display_order)
VALUES
  ('Computer Science', 'computer-science', 'Articles about computer science topics', 1),
  ('Programming', 'programming', 'Programming tutorials and guides', 2),
  ('Web Development', 'web-development', 'Web development resources', 3),
  ('Data Science', 'data-science', 'Data science and analytics', 4),
  ('Artificial Intelligence', 'artificial-intelligence', 'AI and machine learning topics', 5);

INSERT INTO tags (name, slug)
VALUES
  ('JavaScript', 'javascript'),
  ('Python', 'python'),
  ('React', 'react'),
  ('Node.js', 'nodejs'),
  ('Machine Learning', 'machine-learning'),
  ('Tutorial', 'tutorial'),
  ('Beginner', 'beginner'),
  ('Advanced', 'advanced');

INSERT INTO posts (title, slug, content, excerpt, author_id, category_id, status, published_at, is_featured, reading_time)
VALUES
  (
    'Getting Started with React.js',
    'getting-started-with-react',
    '<h2>Introduction to React</h2><p>React is a popular JavaScript library for building user interfaces...</p>',
    'Learn the basics of React.js and start building modern web applications',
    1,
    3,
    'published',
    CURRENT_TIMESTAMP,
    TRUE,
    10
  ),
  (
    'MySQL for Educational Apps',
    'mysql-for-educational-apps',
    '<h2>Why MySQL?</h2><p>MySQL provides reliable relational storage for structured content...</p>',
    'Structured relational storage for courses, posts, and comments',
    1,
    2,
    'published',
    CURRENT_TIMESTAMP,
    FALSE,
    8
  );

INSERT INTO post_tags (post_id, tag_id)
VALUES
  (1, 1),
  (1, 3),
  (1, 6),
  (2, 4),
  (2, 6);
