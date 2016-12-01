<?php

header("Content-type: text/javascript");

$db_connection = new mysqli($_SERVER['RDS_HOSTNAME'], $_SERVER['RDS_USERNAME'], $_SERVER['RDS_PASSWORD'], $_SERVER['RDS_DB_NAME'], $_SERVER['RDS_PORT']);
if ($db_connection->connect_error) {
    die("Connection to MySQL database failed.");
}

$state = (int)$_POST['state'];
$in_state_tuition = (double)$_POST['in_state_tuition'];
$out_of_state_tuition = (double)$_POST['out_of_state_tuition'];
$average_salary = (double)$_POST['average_salary'];
$sort_by = $_POST['sort_by'];
$limit = (int)$_POST['limit'];

if ($in_state_tuition == -1) {
    $in_state_tuition_lower = 0;
    $in_state_tuition_upper = 1000000;
} else {
    $in_state_tuition_lower = 0;
    $in_state_tuition_upper = ((double)$in_state_tuition) * 1000;
}

if ($out_of_state_tuition == -1) {
    $out_of_state_tuition_lower = 0;
    $out_of_state_tuition_upper = 1000000;
} else {
    $out_of_state_tuition_lower = 0;
    $out_of_state_tuition_upper = ((double)$out_of_state_tuition) * 1000;
}

if ($average_salary == -1) {
    $average_salary_lower = 0;
    $average_salary_upper = 1000000;
} else {
    $average_salary_lower = ((double)$average_salary) * 1000;
    $average_salary_upper = 1000000;
}

if ($limit == -1) {
    $limit = 10000;
}

if (strcmp($sort_by, "name") != 0 && strcmp($sort_by, "score") != 0 && strcmp($sort_by, "city") != 0 && strcmp($sort_by, "7") != 0 && strcmp($sort_by, "in_state_tuition") != 0 && strcmp($sort_by, "out_of_state_tuition") != 0 && strcmp($sort_by, "average_salary") != 0) {
    $sort_by = "name";
}

if ($db_connection) {
    if (strcmp($sort_by, "score") == 0 || strcmp($sort_by, "average_salary") == 0) {
        if ($state == -1) {
            $query = $db_connection->prepare("SELECT s.name, .2 * (1 - 1 / ((s.salary_twentyfive + s.salary_seventyfive) / 2 / ((s.in_state_tuition + s.out_of_state_tuition) / 2)) / 5) + .1 * (1 - 1 / (100000 / ((s.in_state_tuition + s.out_of_state_tuition + 2 * s.average_student_debt) / 4))) + .1 * st.score / 100 + .3 * s.graduation_rate + .3 * s.retention_rate AS 'score', s.city, s.in_state_tuition, s.out_of_state_tuition, (s.salary_twentyfive + s.salary_seventyfive) / 2 AS 'average_salary', st.name AS 'state' FROM schools s, located l, states st WHERE s.in_state_tuition >= ? AND s.in_state_tuition <= ? AND s.out_of_state_tuition >= ? AND s.out_of_state_tuition <= ? AND (s.salary_twentyfive + s.salary_seventyfive) / 2 >= ? AND (s.salary_twentyfive + s.salary_seventyfive) / 2 <= ? AND s.name = l.school AND l.state_code = st.code ORDER BY " . $sort_by . " DESC LIMIT ?;");
            $query->bind_param("ddddddi", $in_state_tuition_lower, $in_state_tuition_upper, $out_of_state_tuition_lower, $out_of_state_tuition_upper, $average_salary_lower, $average_salary_upper, $limit);
        } else {
            $query = $db_connection->prepare("SELECT s.name, .2 * (1 - 1 / ((s.salary_twentyfive + s.salary_seventyfive) / 2 / ((s.in_state_tuition + s.out_of_state_tuition) / 2)) / 5) + .1 * (1 - 1 / (100000 / ((s.in_state_tuition + s.out_of_state_tuition + 2 * s.average_student_debt) / 4))) + .1 * st.score / 100 + .3 * s.graduation_rate + .3 * s.retention_rate AS 'score', s.city, s.in_state_tuition, s.out_of_state_tuition, (s.salary_twentyfive + s.salary_seventyfive) / 2 AS 'average_salary', st.name AS 'state' FROM schools s, located l, states st WHERE s.in_state_tuition >= ? AND s.in_state_tuition <= ? AND s.out_of_state_tuition >= ? AND s.out_of_state_tuition <= ? AND (s.salary_twentyfive + s.salary_seventyfive) / 2 >= ? AND (s.salary_twentyfive + s.salary_seventyfive) / 2 <= ? AND s.name = l.school AND l.state_code = st.code AND l.state_code = ? ORDER BY " . $sort_by . " DESC LIMIT ?;");
            $query->bind_param("ddddddii", $in_state_tuition_lower, $in_state_tuition_upper, $out_of_state_tuition_lower, $out_of_state_tuition_upper, $average_salary_lower, $average_salary_upper, $state, $limit);
        }
    } else {
        if ($state == -1) {
            $query = $db_connection->prepare("SELECT s.name, .2 * (1 - 1 / ((s.salary_twentyfive + s.salary_seventyfive) / 2 / ((s.in_state_tuition + s.out_of_state_tuition) / 2)) / 5) + .1 * (1 - 1 / (100000 / ((s.in_state_tuition + s.out_of_state_tuition + 2 * s.average_student_debt) / 4))) + .1 * st.score / 100 + .3 * s.graduation_rate + .3 * s.retention_rate AS 'score', s.city, s.in_state_tuition, s.out_of_state_tuition, (s.salary_twentyfive + s.salary_seventyfive) / 2 AS 'average_salary', st.name AS 'state' FROM schools s, located l, states st WHERE s.in_state_tuition >= ? AND s.in_state_tuition <= ? AND s.out_of_state_tuition >= ? AND s.out_of_state_tuition <= ? AND (s.salary_twentyfive + s.salary_seventyfive) / 2 >= ? AND (s.salary_twentyfive + s.salary_seventyfive) / 2 <= ? AND s.name = l.school AND l.state_code = st.code ORDER BY " . $sort_by . " ASC LIMIT ?;");
            $query->bind_param("ddddddi", $in_state_tuition_lower, $in_state_tuition_upper, $out_of_state_tuition_lower, $out_of_state_tuition_upper, $average_salary_lower, $average_salary_upper, $limit);
        } else {
            $query = $db_connection->prepare("SELECT s.name, .2 * (1 - 1 / ((s.salary_twentyfive + s.salary_seventyfive) / 2 / ((s.in_state_tuition + s.out_of_state_tuition) / 2)) / 5) + .1 * (1 - 1 / (100000 / ((s.in_state_tuition + s.out_of_state_tuition + 2 * s.average_student_debt) / 4))) + .1 * st.score / 100 + .3 * s.graduation_rate + .3 * s.retention_rate AS 'score', s.city, s.in_state_tuition, s.out_of_state_tuition, (s.salary_twentyfive + s.salary_seventyfive) / 2 AS 'average_salary', st.name AS 'state' FROM schools s, located l, states st WHERE s.in_state_tuition >= ? AND s.in_state_tuition <= ? AND s.out_of_state_tuition >= ? AND s.out_of_state_tuition <= ? AND (s.salary_twentyfive + s.salary_seventyfive) / 2 >= ? AND (s.salary_twentyfive + s.salary_seventyfive) / 2 <= ? AND s.name = l.school AND l.state_code = st.code AND l.state_code = ? ORDER BY " . $sort_by . " ASC LIMIT ?;");
            $query->bind_param("ddddddii", $in_state_tuition_lower, $in_state_tuition_upper, $out_of_state_tuition_lower, $out_of_state_tuition_upper, $average_salary_lower, $average_salary_upper, $state, $limit);
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
