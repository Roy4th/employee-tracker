const db = require("./config/connection");
const inquirer = require("inquirer");
const cTable = require("console.table");

db.connect((err) => {
  if (err) throw err;
  console.log("Connected!");
  menu();
});

const menu = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "choice",
        message: "What would you like to do?",
        choices: [
          "View Departments",
          "View Roles",
          "View Employees",
          "Add Department",
          "Add Role",
          "Add Employee",
          "Update Employees",
        ],
      },
    ])
    .then((answers) => {
      let { choice } = answers;

      if (choice === "View Departments") {
        viewDepartments();
      } else if (choice === "View Roles") {
        viewRole();
      } else if (choice === "View Employees") {
        viewEmployees();
      } else if (choice === "Add Department") {
        addDepartment();
      } else if (choice === "Add Role") {
        addRole();
      } else if (choice === "Add Employee") {
        addEmployee();
      } else if (choice === "Update Employees") {
        updateEmployee();
      }
    })
    .catch((err) => {
      if (err) {
        console.log("error");
      } else {
        console.log("done");
      }
    });
};

const viewDepartments = () => {
  db.promise()
    .query("SELECT * FROM department")
    .then(([rows]) => {
      console.table(rows);
      menu();
    });
};

const viewRole = () => {
  db.promise()
    .query("SELECT * FROM role")
    .then(([rows]) => {
      console.table(rows);
      menu();
    });
};

const viewEmployees = () => {
  db.promise()
    .query(
      `SELECT 
    employee.id,
    employee.first_name,
    employee.last_name,
    role.title,
    department.name AS department,
    role.salary,
    CONCAT (manager.first_name," ", manager.last_name) AS manager
    FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON employee.manager_id = manager.id`
    )
    .then(([rows]) => {
      console.table(rows);
      menu();
    });
};

const addDepartment = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "department_name",
        message: "Enter name of new department! (Required)",
        validate: (depo) => {
          if (depo) {
            return true;
          } else {
            console.log("Please enter a new department name!");
            return false;
          }
        },
      },
    ])
    .then((answers) => {
      const { department } = answers;
      db.promise().query(
        `INSERT INTO department (name) VALUES ('${department}')`
      );
      viewDepartments();
    })
    .catch(console.log);
};

const addRole = () => {
  db.promise()
    .query("SELECT * FROM department")
    .then(([rows]) => {
      const roles = rows.map(({ name, id }) => ({ name: name, value: id }));
      inquirer
        .prompt([
          {
            type: "input",
            name: "title",
            message: "What is the name of the role for the employee?",
            validate: (title) => {
              if (title) {
                return true;
              } else {
                console.log("Please enter a title for the employee!");
                return false;
              }
            },
          },
          {
            type: "input",
            name: "salary",
            message: "What is the Salary of this employee?",
            validate: (sal) => {
              if (sal) {
                return true;
              } else {
                console.log("Please enter a salary for your employee!");
                return false;
              }
            },
          },
          {
            type: "list",
            name: "department_id",
            message: "What department does this employee work?",
            choices: roles,
          },
        ])
        .then((answers) => {
          const params = [answers.title, answers.salary, answers.department_id];
          const sql = `INSERT INTO role (title, salary, department_id) VALUES (?,?,?)`;

          db.promise()
            .query(sql, params)
            .then(([rows]) => {
              viewRole();
            });
        });
    })
    .catch(console.log);
};

const addEmployee = () => {
  db.promise()
    .query("SELECT * FROM role")
    .then(([rows]) => {
      const roles = rows.map(({ id, title }) => ({ name: title, value: id }));

      inquirer
        .prompt([
          {
            type: "input",
            name: "first_name",
            message: "Please enter the employee first name",
            validate: (name) => {
              if (name) {
                return true;
              } else {
                console.log("Please enter the employee first name!");
                return false;
              }
            },
          },
          {
            type: "input",
            name: "last_name",
            message: "Please enter the employee last name.",
            validate: (name) => {
              if (name) {
                return true;
              } else {
                console.log("Please enter the employee last name!");
                return false;
              }
            },
          },
          {
            type: "list",
            name: "role_id",
            message: "What is the role of the employee?",
            choices: roles,
          },
        ])
        .then((answers) => {
          const params = [
            answers.first_name,
            answers.last_name,
            answers.role_id,
          ];

          db.promise()
            .query("SELECT * FROM employee")
            .then(([rows]) => {
              const manager = rows.map(({ id, first_name, last_name }) => ({
                name: first_name + " " + last_name,
                value: id,
              }));

              inquirer
                .prompt([
                  {
                    type: "list",
                    name: "manager_id",
                    message: "who is the manager of this employee?",
                    choices: manager,
                  },
                ])
                .then((answers) => {
                  const manager = answers.manager_id;
                  params.push(manager);

                  const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`;

                  db.promise()
                    .query(sql, params)
                    .then(([rows]) => {
                      viewEmployees();
                    });
                });
            });
        });
    })
    .catch(console.log);
};

const updateEmployee = () => {
  db.promise()
    .query("SELECT * FROM employee")
    .then(([rows]) => {
      const employee = rows.map(({ id, first_name, last_name }) => ({
        name: first_name + " " + last_name,
        value: id,
      }));

      inquirer
        .prompt([
          {
            type: "list",
            name: "employee",
            message: "Which employee would you like to update?",
            choices: employee,
          },
        ])
        .then((answers) => {
          const updateArry = [];
          const employeeId = answers.employee;

          db.promise()
            .query(`SELECT * FROM employee WHERE id=${employeeId}`)
            .then((answers) => {
              db.promise()
                .query("SELECT * FROM role")
                .then(([rows]) => {
                  const roles = rows.map(({ title, id }) => ({
                    name: title,
                    value: id,
                  }));

                  inquirer
                    .prompt([
                      {
                        type: "list",
                        name: "newRole",
                        message: "What is the new role for the employee?",
                        choices: roles,
                      },
                    ])
                    .then((answers) => {
                      const role_id = answers.newRole;
                      const sql = `UPDATE employee SET role_id = ? where id = ?`;

                      updateArry.push(role_id);
                      updateArry.push(employeeId);

                      db.promise()
                        .query(sql, updateArry)
                        .then(({ rows }) => {
                          viewEmployees();
                        });
                    });
                });
            });
        });
    });
};
