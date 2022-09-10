INSERT INTO department (name)
VALUES ("Family"),
        ("School"),
        ("Work"),
        ("Home");

INSERT INTO role ( title,salary,department_id)
VALUES ("Father", 10000, 3),
        ("Mother", 10000, 1),
        ("Son", 5000, 2),
        ("Daughter", 5000, 4);

INSERT INTO employee ( first_name,last_name,role_id,manager_id)
VALUES ("Raymond","Lewis",1,1),
        ("Evee","Lewis",2,2),
        ("William","Lewis",3,1),
        ("Amalia","Lewis",4,1),
        ("Dee","Boo",3,2),
        ("Lava","You",4,2),
        ("Tee","Cee",3,1);
