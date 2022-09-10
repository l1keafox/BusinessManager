INSERT INTO department (id,name)
VALUES (1,"Family"),
        (2,"School"),
        (3,"Work"),
        (4,"Home");

INSERT INTO role (id, title,salary,department_id)
VALUES (1,"Father", 10000, 3),
        (2,"Mother", 10000, 1),
        (3,"Son", 5000, 2),
        (4,"Daughter", 5000, 4),
        (5,"Waiter", 5000, 2);

INSERT INTO employee (id, first_name,last_name,role_id,manager_id)
VALUES (1,"Raymond","Lewis",1,1),
        (2,"Evee","Lewis",2,2),
        (3,"William","Lewis",3,1),
        (4,"Amalia","Lewis",4,1),
        (5,"DeeDee","Who",3,2),
        (6,"Lava","You",5,2),
        (7,"Tee","Cee",3,1);
e