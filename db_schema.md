              +------------------+
              |      USER        |
              | (tblOwners)      |
              +------------------+
              | id (PK)          |
              | name             |
              | email            |
              | phone            |
              | comment          |
              +------------------+
                 |           \
                 |1           \ N
                 |             \
                 |              \
                 |               \
                 |                \
         N       |                 \ N
+--------------------------+     +--------------------------+
|        OWNERSHIP         |     |   COMPANY_MEMBERSHIP     |
| (tblPropertyOwners)      |     +--------------------------+
+--------------------------+     | id (PK)                  |
| id (PK)                  |     | user_id (FK)             |
| user_id (FK)             |     | company_id (FK)          |
| property_id (FK)         |     | role (admin)             |
| role (owner/tenant)      |     +--------------------------+
| date_from                |              |
| date_to                  |              | N
| comment                  |              |
+--------------------------+              | 1
        | N                                |
        |                                  |
        | 1                                |
+--------------------------+               |
|        PROPERTY          |---------------+
| (tblProperties)          |
+--------------------------+
| id (PK)                  |
| name                     |
| company_id (FK)          |
| block_id (FK)            |
| address                  |
| comment                  |
+--------------------------+
        |
        | N
        | 1
+--------------------------+
|          BLOCK           |
| (tblBlocks)              |
+--------------------------+
| id (PK)                  |
| name                     |
| company_id (FK)          |
| comment                  |
+--------------------------+
        |
        | N
        | 1
+--------------------------+
|         COMPANY          |
+--------------------------+
| id (PK)                  |
| name                     |
| address                  |
| comment                  |
+--------------------------+