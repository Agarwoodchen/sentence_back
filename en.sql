CREATE TABLE users (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash CHAR(60) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  failed_attempts TINYINT UNSIGNED NOT NULL DEFAULT 0,
  lock_until TIMESTAMP NULL,
  role ENUM('user','admin','moderator') NOT NULL DEFAULT 'user',
  two_factor_enabled TINYINT(1) NOT NULL DEFAULT 0,
  two_factor_secret VARCHAR(255) NULL,
  reset_token VARCHAR(255) NULL,
  reset_token_exp TIMESTAMP NULL,
  last_password_change TIMESTAMP NULL,
  login_ip VARCHAR(45) NULL,
  login_device VARCHAR(255) NULL
);

CREATE TABLE login_logs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  ip_address VARCHAR(45) NULL,
  user_agent TEXT NULL,
  login_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  success TINYINT(1) NOT NULL,
  failure_reason VARCHAR(100) NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
