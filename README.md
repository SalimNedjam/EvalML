# Challenges
###### The platform is used by teachers and students of the Bachelor's and Master's degree in computer science at Sorbonne University.
###### The platform is entirely created by me. 
## Informations
The platform allows students to submit results for assignments, the admin at the creation of the challenge presents a script that allows to evaluate the student's results.
The project is done in DJANGO for the server side, on the client side it is more like reactJS, the management of asynchronous tasks for script evaluation is done with the RabitMQ server and the Celery library. 

## Database
For the storage of information, my choice was made on a non-relational database ( MongoDB), which allows the storage of massive information, but also for its internal functioning, indeed a NOSQL database, allows not to have a predefined schema, this flexibility helps to have a diversity on the structure of the challenges that one can compose, I added to that constraints between the different collections to ensure the integrity of the data.



## Features
The website consists of two interfaces, one for staff members and the other for students, the first one allows you to modify everything related to courses, challenges, student groups, submission, and viewing statistics.

The second allows the submission of a response and the consultation of the student ranking

To this must be added the queuing management and the limitation of the number of requests that can be sent by the user to limit the server overload.   

	
The different functionalities:
1. For Administrators:
    - Create a course.
    - Add/Modify/Remove a challenge to its course.
    - Add/Modify/Remove a staff member to manage a course.
    - Create a student account with a link to change your password by email.
    - Add/Remove a student to the course.
    - Send an email to all students who are taking a course.
2. For staff members and administrators:
    - Add/Modify/Remove a student to a course that the staff member manages.
    - Have a list of students who are taking a course.
    - Consult the list of groups.
    - Consult the challenges.
    - Consult the statistics.
    - Have the list of students who have not yet answered a challenge.
3. For students:
    - Consult the challenges of a course the student is taking.
    - Add a student to a team for a specific challenge.
    - Submit an answer to a challenge.
    - Possibility to consult the score and status of each submission.
    - Consult the leaderboard of a challenge (All the scores of the other teams).
    - Ability to view the history of each submission.
4. For visitors:
    - Possibility to send a password reset request.


## For staff members and administrators
![Screenshot](https://github.com/SalimNedjam/EvalML/blob/master/staff.png)
## For students
![Screenshot](https://github.com/SalimNedjam/EvalML/blob/master/student.png)
