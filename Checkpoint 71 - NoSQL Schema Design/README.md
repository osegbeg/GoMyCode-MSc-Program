\# NoSQL Database Schema Design \& Refactoring — E-Commerce Platform



\## Part 1: Initial Schema Design (Core E-Commerce \& High-Throughput Writes)



\### Chosen Data Model \& Rationale

\* \*\*Primary Store — Document Model (e.g., MongoDB):\*\* Product catalogs have varying attributes by category (electronics specs, apparel sizes, etc.), and orders naturally group customer snapshots with line items so a single document read/write captures an order without multi-table joins.

\* \*\*Hot-Path Cache / Session \& Cart Store — Key-Value Model (e.g., Redis):\*\* Supports sub-millisecond reads for active shopping carts, sessions, and frequently browsed catalog pages under thousands of transactions per second (TPS).



\### Key Entities, Relationships \& Indexes



\#### 1. `users` Collection (Document)

Stores customer account profiles and shipping addresses.

\* \*\*Relationship:\*\* Referenced by `userId` in `orders` (one-to-many).

```json

{

&#x20; "\_id": "ObjectId('6740a1b2c3d4e5f6a7b8c9d0')",

&#x20; "email": "ada.okafor@example.com",

&#x20; "fullName": "Ada Okafor",

&#x20; "phone": "+2348012345678",

&#x20; "defaultShippingAddress": {

&#x20;   "street": "14 Admiralty Way",

&#x20;   "city": "Lagos",

&#x20;   "state": "Lagos",

&#x20;   "country": "Nigeria"

&#x20; },

&#x20; "createdAt": "2026-11-20T09:15:00Z"

}

```

\* \*\*Indexes:\*\* Unique index on `{ "email": 1 }`.



\#### 2. `products` Collection (Document)

Stores searchable catalog items with flexible category attributes.

\* \*\*Relationship:\*\* Referenced by `productId` inside order `items\[]` (embedded line-item snapshot + product reference).

```json

{

&#x20; "\_id": "ObjectId('6740a2b2c3d4e5f6a7b8c9d1')",

&#x20; "sku": "WM-HIS-12KG-01",

&#x20; "title": "Hisense 12kg Front Load Washing Machine",

&#x20; "brand": "Hisense",

&#x20; "category": "Appliances",

&#x20; "tags": \["washing machine", "front load", "12kg", "high spin"],

&#x20; "price": 420000,

&#x20; "currency": "NGN",

&#x20; "stockQuantity": 38,

&#x20; "attributes": {

&#x20;   "capacityKg": 12,

&#x20;   "spinRpm": 1400,

&#x20;   "hasDryer": false

&#x20; },

&#x20; "updatedAt": "2026-11-25T14:00:00Z"

}

```

\* \*\*Indexes:\*\*

&#x20; \* Text index on `{ "title": "text", "brand": "text", "tags": "text" }` for product search.

&#x20; \* Compound index on `{ "category": 1, "price": 1 }` for category browsing and price filtering.

&#x20; \* Unique index on `{ "sku": 1 }`.



\#### 3. `orders` Collection (Document)

Stores orders with denormalized customer and line-item snapshots so historical order details remain accurate even if a user updates their address or a product price changes later.

```json

{

&#x20; "\_id": "ObjectId('6740a3b2c3d4e5f6a7b8c9d2')",

&#x20; "orderNumber": "ORD-20261125-88412",

&#x20; "userId": "ObjectId('6740a1b2c3d4e5f6a7b8c9d0')",

&#x20; "customerSnapshot": {

&#x20;   "fullName": "Ada Okafor",

&#x20;   "email": "ada.okafor@example.com",

&#x20;   "shippingAddress": {

&#x20;     "street": "14 Admiralty Way",

&#x20;     "city": "Lagos",

&#x20;     "country": "Nigeria"

&#x20;   }

&#x20; },

&#x20; "items": \[

&#x20;   {

&#x20;     "productId": "ObjectId('6740a2b2c3d4e5f6a7b8c9d1')",

&#x20;     "sku": "WM-HIS-12KG-01",

&#x20;     "title": "Hisense 12kg Front Load Washing Machine",

&#x20;     "quantity": 1,

&#x20;     "unitPrice": 420000

&#x20;   }

&#x20; ],

&#x20; "totalAmount": 420000,

&#x20; "currency": "NGN",

&#x20; "deliveryStatus": "CONFIRMED",

&#x20; "createdAt": "2026-11-25T15:10:00Z",

&#x20; "updatedAt": "2026-11-25T15:10:00Z"

}

```

\* \*\*Indexes:\*\*

&#x20; \* Compound index on `{ "userId": 1, "createdAt": -1 }` for customer order history.

&#x20; \* Index on `{ "deliveryStatus": 1, "updatedAt": -1 }` for fulfillment tracking.



\### Initial Scalability \& Consistency Considerations

\* \*\*High Write Throughput:\*\* Order creation writes a single self-contained order document; conditional atomic stock decrements (`stockQuantity >= qty`) prevent overselling.

\* \*\*Consistency:\*\* Order creation and `deliveryStatus` transitions prioritize strong consistency (`writeConcern: "majority"`, `readConcern: "local"` or `"majority"` on status checks) so customers see accurate order and delivery states.



\---



\## Part 2: Refactored Schema (Analytics, High Availability \& Partition Tolerance)



\### New Requirements \& Refactoring Strategies Applied

1\. \*\*Sharding (Horizontal Scaling \& High Write Throughput):\*\*

&#x20;  \* Shard `orders` using a compound/hashed shard key `{ "userId": "hashed" }` or `{ "region": 1, "orderId": "hashed" }` to spread high-velocity writes evenly across shards without hotspotting on monotonically increasing timestamps.

&#x20;  \* Shard `products` on `{ "category": 1, "\_id": 1 }` to group category lookups while distributing catalog scale.

2\. \*\*Replication (High Availability \& Partition Tolerance):\*\*

&#x20;  \* Deploy replica sets (e.g., 3+ nodes per shard across availability zones) with automatic failover so reads/writes continue when a node or zone fails.

&#x20;  \* Under network partitions (CAP trade-off), keep transactional order writes available on the majority partition while serving catalog reads from local replicas (`readPreference: "nearest"` / `"secondaryPreferred"`) where brief staleness is acceptable.

3\. \*\*Denormalization \& Pre-Aggregated Analytics (`daily\_product\_sales` + `daily\_sales\_summary`):\*\*

&#x20;  \* Running heavy aggregation scans directly over millions of transactional `orders` slows live checkout traffic. We introduce pre-aggregated daily rollups updated incrementally (via change streams / event stream / scheduled aggregation jobs) for fast sales and product trend queries.



\### Refactored Collections



\#### 1. `daily\_product\_sales` Collection (Pre-Aggregated Product Trends)

```json

{

&#x20; "\_id": {

&#x20;   "date": "2026-11-25",

&#x20;   "productId": "ObjectId('6740a2b2c3d4e5f6a7b8c9d1')"

&#x20; },

&#x20; "date": "2026-11-25",

&#x20; "productId": "ObjectId('6740a2b2c3d4e5f6a7b8c9d1')",

&#x20; "sku": "WM-HIS-12KG-01",

&#x20; "title": "Hisense 12kg Front Load Washing Machine",

&#x20; "category": "Appliances",

&#x20; "unitsSold": 142,

&#x20; "grossRevenue": 59640000,

&#x20; "cancelledUnits": 3,

&#x20; "deliveredUnits": 118,

&#x20; "lastAggregatedAt": "2026-11-25T23:55:00Z"

}

```

\* \*\*Indexes:\*\* Compound index on `{ "date": -1, "unitsSold": -1 }` and `{ "category": 1, "date": -1 }` for fast top-product and category trend queries.



\#### 2. `daily\_sales\_summary` Collection (Pre-Aggregated Store \& Regional Sales)

```json

{

&#x20; "\_id": "2026-11-25\_Lagos",

&#x20; "date": "2026-11-25",

&#x20; "region": "Lagos",

&#x20; "totalOrders": 4820,

&#x20; "totalItemsSold": 7915,

&#x20; "totalRevenue": 1845000000,

&#x20; "statusBreakdown": {

&#x20;   "PENDING": 120,

&#x20;   "CONFIRMED": 940,

&#x20;   "SHIPPED": 1820,

&#x20;   "DELIVERED": 1890,

&#x20;   "CANCELLED": 50

&#x20; },

&#x20; "updatedAt": "2026-11-25T23:55:00Z"

}

```



\#### 3. Updated `orders` Document (Adding `region` \& `analyticsProcessed` Flag)

```json

{

&#x20; "\_id": "ObjectId('6740a3b2c3d4e5f6a7b8c9d2')",

&#x20; "orderNumber": "ORD-20261125-88412",

&#x20; "userId": "ObjectId('6740a1b2c3d4e5f6a7b8c9d0')",

&#x20; "region": "Lagos",

&#x20; "customerSnapshot": {

&#x20;   "fullName": "Ada Okafor",

&#x20;   "email": "ada.okafor@example.com",

&#x20;   "shippingAddress": {

&#x20;     "street": "14 Admiralty Way",

&#x20;     "city": "Lagos",

&#x20;     "country": "Nigeria"

&#x20;   }

&#x20; },

&#x20; "items": \[

&#x20;   {

&#x20;     "productId": "ObjectId('6740a2b2c3d4e5f6a7b8c9d1')",

&#x20;     "sku": "WM-HIS-12KG-01",

&#x20;     "title": "Hisense 12kg Front Load Washing Machine",

&#x20;     "quantity": 1,

&#x20;     "unitPrice": 420000

&#x20;   }

&#x20; ],

&#x20; "totalAmount": 420000,

&#x20; "currency": "NGN",

&#x20; "deliveryStatus": "CONFIRMED",

&#x20; "analyticsProcessed": true,

&#x20; "createdAt": "2026-11-25T15:10:00Z",

&#x20; "updatedAt": "2026-11-25T15:10:00Z"

}

```



\---



\## Reflection Report



Refactoring the e-commerce NoSQL schema for large-scale analytics, high availability, and partition tolerance surfaced clear trade-offs between write throughput, data freshness, and consistency. One main challenge was choosing shard keys that avoid hotspotting while still supporting common query patterns; sharding transactional orders by a hashed user or regional key distributes write load evenly, whereas querying across all shards for global reports becomes more expensive. Another challenge was keeping denormalized order snapshots and pre-aggregated daily sales rollups synchronized with live order updates and status changes without slowing checkout writes.



The new requirements shifted the design from a purely transactional document layout toward a separation of operational and analytical workloads. Rather than running heavy aggregations directly against raw order history during peak traffic, pre-aggregated collections (`daily\_product\_sales` and `daily\_sales\_summary`) store rolled-up metrics for fast trend and revenue reporting. To support high availability and partition tolerance under growing user traffic, multi-node replication enables automatic failover, while explicit consistency trade-offs keep order creation and delivery-status updates reliable on the active primary partition and allow secondary or cached reads for catalog browsing and analytics where slight eventual consistency is acceptable.



Overall, the refactor improved scalability by distributing storage and write throughput across shards, strengthened availability and fault tolerance through replica sets and resilient read/write routing, and dramatically improved analytical query performance by replacing full-collection scans with indexed, pre-aggregated summaries.



