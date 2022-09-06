let inquire = require("inquirer");
let basicQuestions = [
  // {
  //     type: "input",
  //     name: "personName",
  //     message: "What is your Name?",
  //     filter: (val) => (val === "" ? "Raymond" : val),
  //   },
  // WHEN I start the application
  // THEN I am presented with the following options:
  {
    type: "list",
    name: "mainMenu",
    message: "Main Menu:",
    //view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
    choices: [
      "view all departments",
      "view all roles",
      "view all employees",
      "add a department",
      "add a role",
      "add an employee",
      "update an employee role",
    ],
  },
];
inquire.prompt(basicQuestions).then(async (answers) => {
  let next;
  switch (answers.mainMenu) {
    case "view all departments":
      // WHEN I choose to view all departments
      // THEN I am presented with a formatted table showing department names and department ids
      break;
    case "view all roles":
      // WHEN I choose to view all roles
      // THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role

      break;
    case "view all employees":
      // WHEN I choose to view all employees
      // THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to

      break;
    case "add a department":
      // WHEN I choose to add a department
      // THEN I am prompted to enter the name of the department and that department is added to the database
      break;
    case "add a role":
      // WHEN I choose to add a role
      // THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
      break;
    case "add an employee":
      // WHEN I choose to add an employee
      // THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
      break;
    case "update an employee role":
      // WHEN I choose to update an employee role
      // THEN I am prompted to select an employee to update and their new role and this information is updated in the database
      break;
  }
});
// GIVEN a command-line application that accepts user input
