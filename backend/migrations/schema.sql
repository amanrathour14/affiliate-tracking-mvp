-- Affiliates table
CREATE TABLE IF NOT EXISTS affiliates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Clicks table
CREATE TABLE IF NOT EXISTS clicks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    affiliate_id INT NOT NULL,
    campaign_id INT NOT NULL,
    click_id VARCHAR(100) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (affiliate_id) REFERENCES affiliates(id),
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id),
    UNIQUE KEY unique_click (affiliate_id, campaign_id, click_id)
);

-- Conversions table
CREATE TABLE IF NOT EXISTS conversions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    click_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (click_id) REFERENCES clicks(id)
);

-- Insert sample data
INSERT IGNORE INTO affiliates (name) VALUES 
('Affiliate One'),
('Affiliate Two'),
('Affiliate Three');

INSERT INTO campaigns (name) VALUES 
('Summer Sale Campaign'),
('Black Friday Campaign'),
('New Year Campaign');

-- Insert sample clicks
INSERT IGNORE INTO clicks (affiliate_id, campaign_id, click_id) VALUES 
(1, 1, 'click123'),
(1, 2, 'click456'),
(2, 1, 'click789'),
(3, 3, 'click101');

-- Insert sample conversions
INSERT IGNORE INTO conversions (click_id, amount, currency) VALUES 
(1, 99.99, 'USD'),
(3, 149.50, 'USD');
