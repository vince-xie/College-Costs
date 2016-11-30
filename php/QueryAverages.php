<?php

header("Content-type: text/javascript");

$server = "";
$username = "";
$password = "";
$db = "";

$db_connection = new mysqli($server, $username, $password, $db);
if ($db_connection->connect_error) {
    die("Connection to MySQL database failed.");
}

$query = "SELECT AVG(retention_rate) AS retention_rate, AVG(graduation_rate) AS graduation_rate, ROUND(AVG(in_state_tuition), 2) AS in_state_tuition, ROUND(AVG(out_of_state_tuition), 2) AS out_of_state_tuition, ROUND(AVG(average_student_debt), 2) AS average_student_debt, ROUND(AVG((salary_twentyfive + salary_seventyfive) / 2), 2) AS average_income FROM schools;";

if ($db_connection) {
    $result = $db_connection->query($query);
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        echo json_encode($row);
    } 
}
$db_connection->close();
?>
