BEGIN TRANSACTION;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE IF NOT EXISTS items (
    item_id uuid DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    PRIMARY KEY (item_id)
);
END TRANSACTION;
