<?php

header("Content-type: text/javascript");

$db_connection = new mysqli($server, $username, $password, $db);
if ($db_connection->connect_error) {
    die("Connection to MySQL database failed.");
}

$query = "SELECT name FROM schools;";

if ($db_connection) {
    $result = $db_connection->query($query);
    if ($result->num_rows > 0) {
   		$array = array();
        while ($row = $result->fetch_assoc()) {
        	array_push($array, $row['name']);
        }
    }
}
echo json_encode($array);
$db_connection->close();
?>
