-- Create and use a new bamazon database
DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

-- Create a products table
CREATE TABLE products (
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(25),
    department_name VARCHAR(25),
    price DECIMAL(10,2),
    stock_quantity INTEGER(11),
    PRIMARY KEY (item_id)
);

-- Populate the database with 10 mock products
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("camera", "electronics", "129.95", 50), ("hat", "clothing", "18.99", 100),("notebook", "office supplies", "1.50", 400), ("gummy bears", "food/drinks", "11.06", 200), ("socks", "clothing", "13.50", 1000), ("laptop", "electronics", "999.95", 45), ("video game console", "electronics", "299.95", 30), ("dog food", "pet supplies", "30.50", 75), ("shoes", "clothing", "60.00", 100), ("granola bars", "food/drinks", "10.99", 100);