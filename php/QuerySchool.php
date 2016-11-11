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

$name = $_POST['name'];
$query = "SELECT * FROM schools";

if ($db_connection) {
    $result = $db_connection->query($query);
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        echo json_encode($row);
    } 
}
?>
