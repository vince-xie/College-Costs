<?php

header("Content-type: text/javascript");

$db_connection = new mysqli($server, $username, $password, $db);
if ($db_connection->connect_error) {
    die("Connection to MySQL database failed.");
}

$state = $_POST['state'];
$in_state_tuition = $_POST['in_state_tuition'];
$out_of_state_tuition = $_POST['out_of_state_tuition'];
$average_salary = $_POST['average_salary'];
$sort_by = $_POST['sort_by'];
$limit = $_POST['limit'];

$in_state_tuition_lower = 0;
$in_state_tuition_upper = 50000;
$out_of_state_tuition_lower = 0;
$out_of_state_tuition_upper = 50000;
$average_salary_lower = 0;
$average_salary_upper = 900000;
$state = 34;
$sort_by = 'average_salary';
$limit = 100;

if ($db_connection) {
    $query = $db_connection->prepare("SELECT s.name, 100 AS 'score', s.city, s.in_state_tuition, s.out_of_state_tuition, (s.salary_twentyfive + s.salary_seventyfive) / 2 AS 'average_salary', st.name AS 'state' FROM schools s, located l, states st WHERE s.in_state_tuition > ? AND s.in_state_tuition < ? AND s.out_of_state_tuition > ? AND s.out_of_state_tuition < ? AND (s.salary_twentyfive + s.salary_seventyfive) / 2 > ? AND (s.salary_twentyfive + s.salary_seventyfive) / 2 < ? AND s.name = l.school AND l.state_code = st.code AND l.state_code = ? ORDER BY " . $sort_by . " DESC LIMIT ?;");
    $query->bind_param("ddddddii", $in_state_tuition_lower, $in_state_tuition_upper, $out_of_state_tuition_lower, $out_of_state_tuition_upper, $average_salary_lower, $average_salary_upper, $state, $limit);
    
    $query->execute();
    $result = $query->get_result();
    if ($result->num_rows > 0) {
    	while ($row = $result->fetch_assoc()) {
        	echo json_encode($row);
    	}
    }
    $query->close();
    $db_connection->close();
}
?>
