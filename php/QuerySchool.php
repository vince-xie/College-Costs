<?php

header("Content-type: text/javascript");

$db_connection = new mysqli($server, $username, $password, $db);
if ($db_connection->connect_error) {
    die("Connection to MySQL database failed.");
}

$name = $_POST['name'];
$query = "SELECT * FROM schools WHERE name = '" . $name . "'";
$state_query = "SELECT * FROM located, states WHERE located.school = '" . $name . "' AND located.state_code = states.code;";

if ($db_connection) {
    $result = $db_connection->query($query);
    $state_result = $db_connection->query($state_query);
    if ($result->num_rows > 0 && $state_result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $state = $state_result->fetch_assoc();
        $row['state'] = $state['name'];
        $row['state_salary'] = $state['avg_salary'];
        echo json_encode($row);
    } 
}
?>
