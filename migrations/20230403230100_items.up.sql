BEGIN TRANSACTION;
INSERT INTO items (name, description)
    VALUES ('Tomato', 'A delicious beefsteak tomato.'),
           ('Olives', 'Pimiento-stuffed Queen olives.'),
           ('Celery', 'Yuck.');
COMMIT;
