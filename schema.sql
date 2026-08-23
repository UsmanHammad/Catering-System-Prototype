-- ============================================================
-- Food Catering Business Management and Online Ordering System
-- Database Schema (matches the Assessment 1 ERD, Crow's Foot notation)
-- Engine: MySQL 8 / MariaDB
-- ============================================================

CREATE DATABASE IF NOT EXISTS catering_system;
USE catering_system;

-- ---------- Customer ----------
CREATE TABLE Customer (
    CustomerID   INT AUTO_INCREMENT PRIMARY KEY,
    Name         VARCHAR(100) NOT NULL,
    Email        VARCHAR(150) NOT NULL UNIQUE,
    Phone        VARCHAR(20)  NOT NULL,
    CreatedAt    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------- Category ----------
CREATE TABLE Category (
    CategoryID   INT AUTO_INCREMENT PRIMARY KEY,
    Name         VARCHAR(50) NOT NULL UNIQUE
);

-- ---------- FoodItem (many-to-one with Category) ----------
CREATE TABLE FoodItem (
    FoodItemID   INT AUTO_INCREMENT PRIMARY KEY,
    Name         VARCHAR(100) NOT NULL,
    Description  TEXT,
    Price        DECIMAL(8,2) NOT NULL,
    Availability BOOLEAN DEFAULT TRUE,
    CategoryID   INT NOT NULL,
    FOREIGN KEY (CategoryID) REFERENCES Category(CategoryID)
);

-- ---------- CateringPackage ----------
CREATE TABLE CateringPackage (
    PackageID    INT AUTO_INCREMENT PRIMARY KEY,
    Name         VARCHAR(100) NOT NULL,
    Description  TEXT,
    Price        DECIMAL(8,2) NOT NULL,
    Availability BOOLEAN DEFAULT TRUE
);

-- ---------- PackageItem (many-to-many bridge: Package <-> FoodItem) ----------
CREATE TABLE PackageItem (
    PackageItemID INT AUTO_INCREMENT PRIMARY KEY,
    PackageID     INT NOT NULL,
    FoodItemID    INT NOT NULL,
    Quantity      INT DEFAULT 1,
    FOREIGN KEY (PackageID) REFERENCES CateringPackage(PackageID),
    FOREIGN KEY (FoodItemID) REFERENCES FoodItem(FoodItemID)
);

-- ---------- Order (many-to-one with Customer) ----------
CREATE TABLE `Order` (
    OrderID      INT AUTO_INCREMENT PRIMARY KEY,
    CustomerID   INT NOT NULL,
    OrderDate    DATE NOT NULL,
    EventDate    DATE NOT NULL,
    EventLocation VARCHAR(200) NOT NULL,
    GuestCount   INT NOT NULL,
    Status       ENUM('Pending','Confirmed','Completed','Cancelled') DEFAULT 'Pending',
    TotalPrice   DECIMAL(10,2) DEFAULT 0,
    FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID)
);

-- ---------- OrderItem (many-to-one with Order and FoodItem) ----------
CREATE TABLE OrderItem (
    OrderItemID  INT AUTO_INCREMENT PRIMARY KEY,
    OrderID      INT NOT NULL,
    FoodItemID   INT NOT NULL,
    Quantity     INT NOT NULL DEFAULT 1,
    UnitPrice    DECIMAL(8,2) NOT NULL,
    FOREIGN KEY (OrderID) REFERENCES `Order`(OrderID),
    FOREIGN KEY (FoodItemID) REFERENCES FoodItem(FoodItemID)
);

-- ---------- Sample seed data ----------
INSERT INTO Category (Name) VALUES ('Starters'), ('Mains'), ('Desserts'), ('Drinks');

INSERT INTO FoodItem (Name, Description, Price, CategoryID) VALUES
('Garden Salad', 'Fresh mixed greens, cherry tomato, house dressing', 15.00, 1),
('Grilled Chicken', 'Herb-marinated grilled chicken breast', 25.00, 2),
('Creamy Pasta', 'Penne in a creamy garlic parmesan sauce', 20.00, 2),
('Chocolate Brownie', 'Warm brownie with vanilla ice cream', 12.00, 3),
('Iced Lemon Tea', 'Refreshing house-brewed lemon iced tea', 6.00, 4);

INSERT INTO CateringPackage (Name, Description, Price) VALUES
('Bronze Package', 'Starter + Main for up to 20 guests', 350.00),
('Silver Package', 'Starter + Main + Dessert for up to 40 guests', 650.00),
('Gold Package', 'Full course + drinks for up to 80 guests', 1200.00);
