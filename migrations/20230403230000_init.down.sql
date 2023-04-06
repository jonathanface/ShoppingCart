BEGIN;
DROP INDEX IF EXISTS list_id_idx;
DROP TABLE IF EXISTS shopping_cart.list_items;
DROP TABLE IF EXISTS shopping_cart.lists;
DROP EXTENSION IF EXISTS "uuid-ossp";
DROP SCHEMA IF EXISTS shopping_cart;
COMMIT;
