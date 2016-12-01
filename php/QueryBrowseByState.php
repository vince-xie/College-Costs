<?php

header("Content-type: text/javascript");

$db_connection = new mysqli($_SERVER['RDS_HOSTNAME'], $_SERVER['RDS_USERNAME'], $_SERVER['RDS_PASSWORD'], $_SERVER['RDS_DB_NAME'], $_SERVER['RDS_PORT']);
if ($db_connection->connect_error) {
    die("Connection to MySQL database failed.");
}

$state = (int)$_POST['state'];
$sort_by = $_POST['sort_by'];
$limit = (int)$_POST['limit'];

if ($limit == -1) {
    $limit = 10000;
}

if (strcmp($sort_by, "1") != 0 && strcmp($sort_by, "2") != 0 && strcmp($sort_by, "3") != 0 && strcmp($sort_by, "4") != 0 && strcmp($sort_by, "5") != 0 && strcmp($sort_by, "6") != 0) {
    $sort_by = "1";
}

if ($db_connection) {
    if (strcmp($sort_by, "2") == 0 || strcmp($sort_by, "3") == 0 || strcmp($sort_by, "6") == 0) {
        if ($state == -1) {
            $query = $db_connection->prepare("SELECT st.name, st.score, AVG(.2 * (1 - 1 / ((s.salary_twentyfive + s.salary_seventyfive) / 2 / ((s.in_state_tuition + s.out_of_state_tuition) / 2)) / 5) + .1 * (1 - 1 / (100000 / ((s.in_state_tuition + s.out_of_state_tuition + 2 * s.average_student_debt) / 4))) + .1 * st.score / 100 + .3 * s.graduation_rate + .3 * s.retention_rate) AS 'average_school_score', ROUND(AVG(s.in_state_tuition), 2) AS 'average_in_state_tuition', ROUND(AVG(s.out_of_state_tuition), 2) AS 'average_out_of_state_tuition', st.avg_salary FROM schools s, located l, states st WHERE s.name = l.school AND l.state_code = st.code GROUP BY st.name DESC ORDER BY " . $sort_by . " DESC LIMIT ?;");
            $query->bind_param("i", $limit);
        } else {
            $query = $db_connection->prepare("SELECT st.name, st.score, AVG(.2 * (1 - 1 / ((s.salary_twentyfive + s.salary_seventyfive) / 2 / ((s.in_state_tuition + s.out_of_state_tuition) / 2)) / 5) + .1 * (1 - 1 / (100000 / ((s.in_state_tuition + s.out_of_state_tuition + 2 * s.average_student_debt) / 4))) + .1 * st.score / 100 + .3 * s.graduation_rate + .3 * s.retention_rate) AS 'average_school_score', ROUND(AVG(s.in_state_tuition), 2) AS 'average_in_state_tuition', ROUND(AVG(s.out_of_state_tuition), 2) AS 'average_out_of_state_tuition', st.avg_salary FROM schools s, located l, states st WHERE s.name = l.school AND l.state_code = st.code AND st.code = ? GROUP BY st.name DESC ORDER BY " . $sort_by . " DESC LIMIT ?;");
            $query->bind_param("ii", $state, $limit);
        }
    } else {
        if ($state == -1) {
            $query = $db_connection->prepare("SELECT st.name, st.score, AVG(.2 * (1 - 1 / ((s.salary_twentyfive + s.salary_seventyfive) / 2 / ((s.in_state_tuition + s.out_of_state_tuition) / 2)) / 5) + .1 * (1 - 1 / (100000 / ((s.in_state_tuition + s.out_of_state_tuition + 2 * s.average_student_debt) / 4))) + .1 * st.score / 100 + .3 * s.graduation_rate + .3 * s.retention_rate) AS 'average_school_score', ROUND(AVG(s.in_state_tuition), 2) AS 'average_in_state_tuition', ROUND(AVG(s.out_of_state_tuition), 2) AS 'average_out_of_state_tuition', st.avg_salary FROM schools s, located l, states st WHERE s.name = l.school AND l.state_code = st.code GROUP BY st.name DESC ORDER BY " . $sort_by . " ASC LIMIT ?;");
            $query->bind_param("i", $limit);
        } else {
            $query = $db_connection->prepare("SELECT st.name, st.score, AVG(.2 * (1 - 1 / ((s.salary_twentyfive + s.salary_seventyfive) / 2 / ((s.in_state_tuition + s.out_of_state_tuition) / 2)) / 5) + .1 * (1 - 1 / (100000 / ((s.in_state_tuition + s.out_of_state_tuition + 2 * s.average_student_debt) / 4))) + .1 * st.score / 100 + .3 * s.graduation_rate + .3 * s.retention_rate) AS 'average_school_score', ROUND(AVG(s.in_state_tuition), 2) AS 'average_in_state_tuition', ROUND(AVG(s.out_of_state_tuition), 2) AS 'average_out_of_state_tuition', st.avg_salary FROM schools s, located l, states st WHERE s.name = l.school AND l.state_code = st.code AND st.code = ? GROUP BY st.name ASC ORDER BY " . $sort_by . " DESC LIMIT ?;");
            $query->bind_param("ii", $state, $limit);
        }
    }
    $query->execute();
    $result = $query->get_result();
    if ($result->num_rows > 0) {
        $array = array();
    	while ($row = $result->fetch_assoc()) {
            array_push($array, $row);
    	}
        echo json_encode($array);
    }
    $query->close();
    $db_connection->close();
}
?>
