<?php

header("Content-type: text/javascript");

$db_connection = new mysqli($_SERVER['RDS_HOSTNAME'], $_SERVER['RDS_USERNAME'], $_SERVER['RDS_PASSWORD'], $_SERVER['RDS_DB_NAME'], $_SERVER['RDS_PORT']);
if ($db_connection->connect_error) {
    die("Connection to MySQL database failed.");
}

$name = $_POST['name'];
if ($db_connection) {
    $query = $db_connection->prepare("SELECT * FROM schools WHERE name = ?;");
    $query->bind_param("s", $name);
    
    $query->execute();
    $result = $query->get_result();
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $query->close();
        $state_query = $db_connection->prepare("SELECT * FROM located, states WHERE located.school = ? AND located.state_code = states.code;");
        $state_query->bind_param('s', $name);
        $state_query->execute();
        $state_result = $state_query->get_result();
        if ($state_result->num_rows > 0) {
            $state = $state_result->fetch_assoc();
            $row['state'] = $state['name'];
            $row['state_salary'] = $state['avg_salary'];
            $row['state_score'] = $state['score'];
            $state_query->close();
        }
        echo json_encode($row); 
    }
    $db_connection->close();
}
?>
