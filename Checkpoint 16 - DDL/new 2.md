# SQL DDL Exercise: Relational Model Implementation

## 1. Problem Statement
The goal is to implement a relational database schema based on the provided logical model. 
The schema consists of three tables: **Customer**, **Product**, and **Orders**, with specific data types and integrity constraints.

### Table Specifications
*   **Customer Table**:
    *   `Customer_ID`: VARCHAR2(20), Primary Key.
    *   `Customer_Name`: VARCHAR2(20), NOT NULL.
    *   `Customer_Tel`: NUMBER.
*   **Product Table**:
    *   `Product_ID`: VARCHAR2(20), Primary Key.
    *   `Product_Name`: VARCHAR2(20), NOT NULL.
    *   `Price`: NUMBER, must be a positive value (> 0).
*   **Orders Table**:
    *   `Customer_ID`: VARCHAR2(20), Foreign Key referencing Customer.
    *   `Product_ID`: VARCHAR2(20), Foreign Key referencing Product.
    *   `Quantity`: NUMBER.
    *   `Total_Amount`: NUMBER.
    *   **Constraint**: A Composite Primary Key is formed by (`Customer_ID`, `Product_ID`).

---

## 2. SQL Implementation

### Create Tables
The following scripts create the initial table structures and define primary/foreign key relationships.
```sql
-- Create Customer Table
CREATE TABLE Customer (
    Customer_ID VARCHAR2(20) PRIMARY KEY,
    Customer_Name VARCHAR2(20) NOT NULL,
    Customer_Tel NUMBER
);

-- Create Product Table
CREATE TABLE PRODUCT (
    Product_ID VARCHAR2(20) PRIMARY KEY,
    Product_Name VARCHAR2(20) NOT NULL,
    Price NUMBER CHECK (Price > 0)
);

-- Create Orders Table with Composite Primary Key
CREATE TABLE ORDERS (
    Customer_ID VARCHAR2(20) REFERENCES Customer(Customer_ID),
    Product_ID VARCHAR2(20) REFERENCES Product(Product_ID),
    Quantity NUMBER,
    Total_Amount NUMBER,
    CONSTRAINT pk_orders PRIMARY KEY (Customer_ID, Product_ID)
);

### Alter Tables
The following commands modify the existing tables to add new columns and default values.

```sql
-- 1. Add Category column to PRODUCT table
ALTER TABLE PRODUCT 
ADD Category VARCHAR2(20);

-- 2. Add OrderDate column to ORDERS table with SYSDATE as default
ALTER TABLE ORDERS 
ADD OrderDate DATE DEFAULT SYSDATE;