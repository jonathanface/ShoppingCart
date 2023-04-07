BEGIN TRANSACTION;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE IF NOT EXISTS list_items (
    item_id uuid DEFAULT uuid_generate_v4(),
    list_id uuid NOT NULL,
    name varchar(25) NOT NULL,
    description varchar(100) NOT NULL,
    quantity int NOT NULL DEFAULT 1,
    purchased boolean NOT NULL default FALSE,
    PRIMARY KEY (item_id)
);
CREATE INDEX IF NOT EXISTS list_id_idx ON list_items (list_id);
END TRANSACTION;
