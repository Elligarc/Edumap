-- V7: Rename users.password_hash to users.password

ALTER TABLE users RENAME COLUMN password_hash TO password;
