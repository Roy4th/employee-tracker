INSERT INTO department (name)
VALUES
('Installer'),
('Supervisor'),
('Programer');

INSERT INTO role (title, salary, department_id)
VALUES
('Installer', 30000, 1),
('Installer Manager', 35000, 1),
('Supervisor', 40000, 2),
('Supervisor Manager', 45000, 2),
('Programer', 50000, 3),
('Programer Manager', 55000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Chris', 'Foster', 2, null),
('Rob', 'Lincoln', 4, null),
('Patrick', 'Brantly', 6, null),
('Grant', 'Grinch', 1, 1),
('Tyler', 'James', 1, 1),
('Mike', 'Palonski', 3, 2),
('Sam', 'Wake', 3, 2),
('Jacob', 'Peterson', 1, 1),
('Pedro', 'Grant', 5, 3),
('Meagan', 'Smith', 5, 3);
