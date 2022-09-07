const inquire = require("inquirer");
const mysql = require("mysql2/promise");

const basicQuestions = [
  {
    type: "list",
    name: "mainMenu",
    message: "Main Menu:",
    //view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
    choices: [
      "view all departments",
      "view all roles",
      "view all employees",
      "view employee by manager",
      "view employees by department",
      "view department budget",
      "add a department",
      "add a role",
      "add an employee",
      "update an employee role",
      "update employee manager",
      "delete employee",
      "delete role",
      "delete department",
      "exit",
    ],
  },
];

const login = {
  host: "localhost",
  // MySQL username,
  user: "root",
  // MySQL password
  password: "likeafox",
  database: "myBusiness_db",
};

function doMainQuestion() {
  inquire.prompt(basicQuestions).then(async (answers) => {
    const db = await mysql.createConnection(login);
    let thisQuery;
    let thisQuestions;
    let allEmploy;

    switch (answers.mainMenu) {
      case "view all departments":
        // WHEN I choose to view all departments
        // THEN I am presented with a formatted table showing department names and department ids
        let depts = await db.execute("SELECT * FROM department");
        console.table(depts[0]);
        doMainQuestion();

        break;
      case "view all roles":
        // WHEN I choose to view all roles
        // THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
        let roles = await db.execute("SELECT * FROM role");
        console.table(roles[0]);
        doMainQuestion();

        break;
      case "view all employees":
        // WHEN I choose to view all employees
        // THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
        let employee = await db.execute("SELECT * FROM employee");
        console.table(employee[0]);
        doMainQuestion();

        break;
      case "add a department":
        // WHEN I choose to add a department
        // THEN I am prompted to enter the name of the department and that department is added to the database
        let q = [
          {
            type: "input",
            name: "department",
            message: "What is the department name?",
          },
        ];

        let answers = await inquire.prompt(q);
        let allDeps = await db.execute("SELECT * FROM department");
        let newId = allDeps[0].length;
        newId = newId * newId;
        await db.execute(
          `INSERT INTO department (id, name) VALUES ('${newId}','${answers.department}');`
        );
        doMainQuestion();
        break;
      case "add a role":
        // WHEN I choose to add a role
        // THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
        let q2 = [
          {
            type: "input",
            name: "role",
            message: "What is the name?",
          },
          {
            type: "input",
            name: "salary",
            message: "Salary?",
          },
          {
            type: "input",
            name: "dept_id",
            message: "department id?",
          },
        ];
        let answers2 = await inquire.prompt(q2);
        let rolesd = await db.execute("SELECT * FROM role");
        let newId2 = rolesd[0].length;
        newId2 = newId2 * newId2;
        await db.execute(
          `INSERT INTO role (id, title,salary,department_id) VALUES ('${newId2}','${answers2.role}','${answers2.salary}','${answers2.dept_id}' );`
        );
        doMainQuestion();
        break;
      case "add an employee":
        // WHEN I choose to add an employee
        // THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
        let q3 = [
          {
            type: "input",
            name: "first",
            message: "What is the first name?",
          },
          {
            type: "input",
            name: "last",
            message: "What is the last name?",
          },
          {
            type: "input",
            name: "role_id",
            message: "What is the role id?",
          },
          {
            type: "input",
            name: "manager_id",
            message: "Who is Manager ID?",
          },
        ];
        let answers3 = await inquire.prompt(q3);
        let employeedd = await db.execute("SELECT * FROM employee");
        let newId3 = employeedd[0].length;
        newId3 = newId3 * newId3;
        await db.execute(
          `INSERT INTO employee (id, first_name,last_name,role_id,manager_id) VALUES ('${newId3}','${answers3.first}','${answers3.last}','${answers3.role_id}' ,'${answers3.manager_id}');`
        );

        doMainQuestion();

        break;
      case "update an employee role":
        // WHEN I choose to update an employee role
        // THEN I am prompted to select an employee to update and their new role and this information is updated in the database
        thisQuery = await db.execute("SELECT * FROM employee");
        let allEmploy = thisQuery[0];
        let nameArray = [];

        for (let i in allEmploy) {
          nameArray.push({
            name: allEmploy[i].first_name + " " + allEmploy[i].last_name,
            id: allEmploy[i].role_id,
          });
        }
        // go through and get all employee names and ids;
        let q4 = [
          {
            type: "list",
            name: "person",
            message: "Pick the person to update:",
            //view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
            choices: nameArray,
          },
          {
            type: "input",
            name: "new_id",
            message: "What is the new role id?",
          },
        ];

        let answers4 = await inquire.prompt(q4);
        let employeeID;
        for (let i in nameArray) {
          if (nameArray[i].name === answers4.person) {
            employeeID = nameArray[i].id;
            break;
          }
        }

        await db.execute(
          `UPDATE employee SET role_id = "${answers4.new_id}" WHERE id = ${employeeID};`
        );

        doMainQuestion();

        break;

      // Update employee managers.

      case "update employee manager":
        updateEmployeesManager(db);

        break;

      // View employees by manager.

      case "view employee by manager":
        thisQuery = await db.execute("SELECT * FROM employee");
        let allEmp = thisQuery[0];
        let managerArray = [];

        for (let i in allEmp) {
          managerArray.push(allEmp[i].manager_id);
        }

        managerArray = [...new Set(managerArray)]; // get uniques of this array;

        let namedArray = [];
        for (let i in allEmp) {
          if (managerArray.includes(allEmp[i].id)) {
            namedArray.push({
              name: allEmp[i].first_name + " " + allEmp[i].last_name,
              id: allEmp[i].id,
            });
          }
        }

        console.log(namedArray); // unique is ['a', 1, 2, '1']

        thisQuestions = [
          {
            type: "list",
            name: "manager",
            message: "Please pick the manager:",
            //view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
            choices: managerArray,
          },
        ];
        let vAnswer = await inquire.prompt(thisQuestions);
        console.log(vAnswer);
        let employeesOfMan = [];
        for (let i in allEmp) {
          if (allEmp[i].manager_id == vAnswer.manager) {
            employeesOfMan.push(allEmp[i]);
          }
        }

        console.table(employeesOfMan);

        doMainQuestion();
        break;

      case "view employees by department":
        showEmpByDept(db);
        break;

      // Delete departments, roles, and employees.
      case "delete department":
        delDept(db);
        break;
      case "delete role":
        delRole(db);
        break;
      case "delete employee":
        delEmp(db);
        break;

      // View the total utilized budget of a department—in other words, the combined salaries of all employees in that department.
      case "view department budget":
        calBudget(db);
        break;

      case "exit":
        process.exit();
        break;
    }
  });
}

async function calBudget(db) {
  // lets create an object that holds id too salary
  let anQuery = await db.execute("SELECT * FROM role");
  let allRoles = anQuery[0];
  let roleObj = {};
  for (let i in allRoles) {
    roleObj[allRoles[i].id] = allRoles[i].salary;
  }

  anQuery = await db.execute("SELECT * FROM department");
  let allDep = anQuery[0];
  let depName = [];
  for (let i in allDep) {
    depName.push(allDep[i].name);
  }

  let q = [
    {
      type: "list",
      name: "dept",
      message: "Please pick the department to calcuate:",
      choices: depName,
    },
  ];

  let theAnswer = await inquire.prompt(q);
  let idAnswer;
  for (let i in allDep) {
    if (allDep[i].name === theAnswer.dept) {
      idAnswer = allDep[i].id;
      break;
    }
  }
  console.log(
    "  Department Selected is:",
    theAnswer.dept,
    "ID of dept is:",
    idAnswer
  );

  let roleToCalc = [];
  for (let i in allRoles) {
    if (allRoles[i].department_id === idAnswer) {
      roleToCalc.push(allRoles[i].id);
      break;
    }
  }
  console.log("  RoleID in this department:", roleToCalc);

  let thisQuery = await db.execute("SELECT * FROM employee");
  let allEmploys = thisQuery[0];

  let totalBudget = 0;
  console.log('----------------------------------------------------');
  for (let emp of allEmploys) {
    if (roleToCalc.includes(emp.role_id)) {
      console.log(
        " ",
        emp.first_name,
        emp.last_name,
        " Salary: ",
        roleObj[emp.role_id]
      );
      totalBudget += parseInt(roleObj[emp.role_id]);
    }
  }
  console.log('----------------------------------------------------');
  console.log(
    "  Total budget:",
    totalBudget,
    " Budget for Department: ",
    theAnswer.dept
  );
  console.log();
  doMainQuestion();
}

async function delRole(db) {
  let thisQuery = await db.execute("SELECT * FROM role");
  let allRole = thisQuery[0];
  let roleArray = [];

  for (let i in allRole) {
    roleArray.push(allRole[i].title);
  }

  let q = [
    {
      type: "list",
      name: "role",
      message: "Please pick the role to delete:",
      choices: roleArray,
    },
  ];
  console.log(roleArray);
  let theAnswer = await inquire.prompt(q);
  await db.execute(`DELETE FROM role WHERE title='${theAnswer.role}';`);
  doMainQuestion();
}

async function delEmp(db) {
  let thisQuery = await db.execute("SELECT * FROM employee");
  let allRole = thisQuery[0];
  let roleArray = [];

  for (let i in allRole) {
    roleArray.push(allRole[i].first_name);
  }

  let q = [
    {
      type: "list",
      name: "employee",
      message: "Please pick the role to delete:",
      choices: roleArray,
    },
  ];
  let vAnswer = await inquire.prompt(q);
  await db.execute(
    `DELETE FROM employee WHERE first_name='${vAnswer.employee}';`
  );
  doMainQuestion();
}

async function delDept(db) {
  let thisQuery = await db.execute("SELECT * FROM department");
  let allDept = thisQuery[0];
  let deptArray = [];

  for (let i in allDept) {
    deptArray.push(allDept[i].name);
  }

  let q = [
    {
      type: "list",
      name: "dept",
      message: "Please pick the dept to delete:",
      choices: deptArray,
    },
  ];
  let vAnswer = await inquire.prompt(q);

  console.log(vAnswer.dept);
  await db.execute(`DELETE FROM department WHERE name='${vAnswer.dept}';`);
  // DELETE FROM products WHERE product_id=1;
  doMainQuestion();
}

async function showEmpByDept(db) {
  // View employees by department.

  let thisQuery = await db.execute("SELECT * FROM department");
  let allEmp = thisQuery[0];
  let deptArray = [];

  for (let i in allEmp) {
    deptArray.push(allEmp[i].name);
  }

  thisQuestions = [
    {
      type: "list",
      name: "dept",
      message: "Please pick the dept:",
      //view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
      choices: deptArray,
    },
  ];
  let vAnswer = await inquire.prompt(thisQuestions);
  let roleID;
  for (let e in allEmp) {
    if (allEmp[e].name === vAnswer.dept) {
      roleID = allEmp[e].id;
    }
  }
  let employeesOfMan = [];

  thisQuery = await db.execute("SELECT * FROM role");
  let allRoles = thisQuery[0];
  let roleArray = [];
  for (let role of allRoles) {
    if (role.department_id === roleID) {
      roleArray.push(role.id);
    }
  }
  thisQuery = await db.execute("SELECT * FROM employee");
  allEmp = thisQuery[0];
  for (let i in allEmp) {
    if (roleArray.includes(allEmp[i].role_id)) {
      employeesOfMan.push(allEmp[i]);
    }
  }

  console.table(employeesOfMan);
  doMainQuestion();
}

async function updateEmployeesManager(db) {
  // Update employee managers.

  let thisQuery = await db.execute("SELECT * FROM employee");
  let allEmploy = thisQuery[0];
  let nameArray = [];

  for (let i in allEmploy) {
    nameArray.push({
      name: allEmploy[i].first_name + " " + allEmploy[i].last_name,
      id: allEmploy[i].role_id,
    });
  }
  // go through and get all employee names and ids;
  let q4 = [
    {
      type: "list",
      name: "person",
      message: "Pick the person to update:",
      choices: nameArray,
    },
    {
      type: "input",
      name: "new_id",
      message: "What is the new manager id?",
    },
  ];

  let answers4 = await inquire.prompt(q4);
  let employeeID;
  for (let i in allEmploy) {
    let fullName = allEmploy[i].first_name + " " + allEmploy[i].last_name;
    if (fullName == answers4.person) {
      employeeID = allEmploy[i].id;
      break;
    }
  }
  await db.execute(
    `UPDATE employee SET manager_id = ${answers4.new_id} WHERE id = ${employeeID};`
  );
  doMainQuestion();
}

// GIVEN a command-line application that accepts user input
doMainQuestion();
