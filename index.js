let inquire = require("inquirer");
const mysql = require('mysql2/promise');
let basicQuestions = [
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
      "exit"
    ],
  },
];
async function dothis(){
    const db = await mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // MySQL password
      password: 'likeafox',
      database: 'myBusiness_db'
    },
    console.log(`Connected to the myBusiness_db database.`)
  );
}

doMainQuestion();

let login = {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // MySQL password
    password: 'likeafox',
    database: 'myBusiness_db'
  };

function doMainQuestion(){
inquire.prompt(basicQuestions).then(async (answers) => {
  let next;
  console.log('Connecting to DB');
  const db = await mysql.createConnection(login,console.log(`Connected to the myBusiness_db database.`));

  switch (answers.mainMenu) {
    case "view all departments":
      // WHEN I choose to view all departments
      // THEN I am presented with a formatted table showing department names and department ids
      let depts = await db.execute('SELECT * FROM department');
      console.table(depts[0]);

      doMainQuestion();

      break;
    case "view all roles":
      // WHEN I choose to view all roles
      // THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
      let roles = await db.execute('SELECT * FROM role');
      console.table(roles[0]);
      doMainQuestion();

      break;
    case "view all employees":
      // WHEN I choose to view all employees
      // THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
      let employee = await db.execute('SELECT * FROM employee');
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
            filter: (val) => (val === "" ? "Fatherhood" : val),
        },        
      ];
      
      let answers = await inquire.prompt(q);
      console.log( answers.department, "is added");
      let deptsd = await db.execute('SELECT * FROM department');
      let newId = deptsd[0].length;
      newId = newId * newId;
      console.log(newId,answers.department);
      await db.execute(`INSERT INTO department (id, name) VALUES ('${newId}','${answers.department}');`);
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
            filter: (val) => (val === "" ? "Divish" : val),
        },        
        {
            type: "input",
            name: "salary",
            message: "Salary?",
            filter: (val) => (val === "" ? "Divish" : val),
        },        
        {
            type: "input",
            name: "dept_id",
            message: "department id?",
            filter: (val) => (val === "" ? "Divish" : val),
        },        
      ];
      let answers2 = await inquire.prompt(q2);
      console.log( answers2, "is added");

      let rolesd = await db.execute('SELECT * FROM role');
      let newId2 = rolesd[0].length;
      newId2 = newId2 * newId2;
      await db.execute(`INSERT INTO role (id, title,salary,department_id) VALUES ('${newId2}','${answers2.role}','${answers2.salary}','${answers2.dept_id}' );`);

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
            filter: (val) => (val === "" ? "Divish" : val),
        },        
        {
            type: "input",
            name: "last",
            message: "What is the last name?",
            filter: (val) => (val === "" ? "Divish" : val),
        },        
        {
            type: "input",
            name: "role_id",
            message: "What is the role id?",
            filter: (val) => (val === "" ? "Divish" : val),
        },        
        {
            type: "input",
            name: "manager_id",
            message: "Who is Manager ID?",
            filter: (val) => (val === "" ? "Divish" : val),
        },        
      ];
      let answers3 = await inquire.prompt(q3);
      console.log( answers3, "is added");
      let employeedd = await db.execute('SELECT * FROM employee');
      let newId3 = employeedd[0].length;
      newId3 = newId3 * newId3;
      await db.execute(`INSERT INTO employee (id, first_name,last_name,role_id,manager_id) VALUES ('${newId3}','${answers3.first}','${answers3.last}','${answers3.role_id}' ,'${answers3.manager_id}');`);

      doMainQuestion();

      break;
    case "update an employee role":
      // WHEN I choose to update an employee role
      // THEN I am prompted to select an employee to update and their new role and this information is updated in the database
      let thisQuery = await db.execute('SELECT * FROM employee');
      let allEmploy = thisQuery[0];
      let nameArray = [];

      for(let i in allEmploy){
        nameArray.push( 
            {
                name:allEmploy[i].first_name+ " " + allEmploy[i].last_name,
                id: allEmploy[i].role_id
            }
        );
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
            filter: (val) => (val === "" ? "Divish" : val),
        },        
      ];
      let answers4 = await inquire.prompt(q4);  
      // we need update id number
      let employeeID;
      for(let i in nameArray){
        if(nameArray[i].name === answers4.person){
            employeeID = nameArray[i].id;
            break;
        }
      }

      console.log("Employee ID", employeeID, " new role ID",answers4.new_id);

      await db.execute(`UPDATE employee SET role_id = "${answers4.new_id}" WHERE id = ${employeeID};`);

      doMainQuestion();

      break;

    case "exit":
        process.exit();
    break;
  }
});
// GIVEN a command-line application that accepts user input
};