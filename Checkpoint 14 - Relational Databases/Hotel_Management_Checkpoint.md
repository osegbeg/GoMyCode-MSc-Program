### Checkpoint: Hotel Management Relational Schema

**Objective:** Convert the provided Entity-Relationship Model (Conceptual) into a Relational Diagram (Logical Schema).

---

### 1. Relational Schema Diagram
The visual diagram is attached as an image file in the repository (see `Relationship_Diagram.png`).

> **Note:** The diagram illustrates the table structures, **Primary Keys (PK)**, **Foreign Keys (FK)**, and the referential integrity links between entities.

---

### 2. Table Definitions & Mapping Logic
The following tables were derived from the ER model using standard normalization and mapping rules:

#### A. Core Entities
* **TYPE**: (`Type_Id` [PK], `Type_Name`)
    * *Purpose:* A lookup table for hotel classifications.
* **CATEGORY**: (`Category_Id` [PK], `Category_Name`, `Price`, `Beds_Number`)
    * *Purpose:* Defines the pricing and physical specifications for various room types.
* **HOTEL**: (`Hotel_Id` [PK], `Hotel_Name`, `Type_Id` [FK])
    * *Mapping:* Implements a 1:N relationship. The `Type_Id` migrates from the **TYPE** table to the **HOTEL** table as a Foreign Key.
* **EMPLOYEE**: (`Employee_Id` [PK], `Employee_Name`, `Hotel_Id` [FK], `Manager_Id` [FK])
    * *Mapping (Works Relationship):* `Hotel_Id` migrates from the **HOTEL** table.
    * *Mapping (Leads Relationship):* Implements a **Recursive Foreign Key** (`Manager_Id`) pointing back to the same table's Primary Key (`Employee_Id`) to handle the management hierarchy.

#### B. Specialized Structures
* **ROOM**: (`Hotel_Id` [PK/FK], `Room_No` [PK], `Floor`, `Category_Id` [FK])
    * *Logic:* Implemented as a **Weak Entity**. We utilize a **Composite Primary Key** consisting of (`Hotel_Id` + `Room_No`) because room numbers are only unique within the context of a specific hotel.
* **EMPLOYEE_SPECIALTY**: (`Specialty_Id` [PK], `Specialty_Name`, `Employee_Id` [FK])
    * *Logic:* Created to resolve the **Multi-valued Attribute** "Specialty" from the original ERD. This ensures the database adheres to **First Normal Form (1NF)** by avoiding comma-separated values in a single cell.

---

### 3. Data Integrity Rules Applied
* **Entity Integrity:** Every relation has a clearly defined Primary Key.
* **Referential Integrity:** All Foreign Keys correspond to existing Primary Keys in their respective parent tables, ensuring no orphaned records.
* **Domain Integrity:** Attributes are structured to ensure data consistency (e.g., pricing in **CATEGORY** and identifiers as unique integers).

---

*Created for the Hotel Management System Database Project.*
