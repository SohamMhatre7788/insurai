-- Create admin user for Insurai application
-- Password: admin123

INSERT INTO users (first_name, last_name, email, password_hash, role, created_at, updated_at)
VALUES ('Admin', 'User', 'admin@insurai.com', 
'$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GykIJZLIZJui', 
'ADMIN', NOW(), NOW());
-- To update in db... 
use Insurai_db;
UPDATE users 
SET role = 'ADMIN'
WHERE id=123;