INSERT INTO department (name)
VALUES
('Sales'),
('Engineering'),
('Finance');

INSERT INTO role (title, salary, department_id)
VALUES
('Sales person', 30000, 1),
('Sales Manager', 35000, 1),
('Software Engineer', 40000, 2),
('Head Software Engineer', 45000, 2),
('Accountant', 50000, 3),
('Accountant Manager', 55000, 3);

-- dont forget to add back manager_id
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('James', 'Fraser', 2, null),
('Jack', 'London', 4, null),
('Robert', 'Bruce', 6, null),
('Peter', 'Greenaway', 1, 1),
('Derek', 'Jarman', 1, 1),
('Paolo', 'Pasolini', 3, 2),
('Heathcote', 'Williams', 3, 2),
('Sandy', 'Powell', 1, 1),
('Emil', 'Zola', 5, 3),
('Sissy', 'Coalpits', 5, 3);
