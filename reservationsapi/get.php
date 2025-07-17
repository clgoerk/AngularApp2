<?php
require 'connect.php';

$id = isset($_GET['id']) ? (int) $_GET['id'] : 0;

if ($id <= 0) {
    http_response_code(400);
    exit;
}

$sql = "SELECT * FROM reservations WHERE id = {$id} LIMIT 1";

if ($result = mysqli_query($con, $sql)) {
    if (mysqli_num_rows($result) === 1) {
        echo json_encode(mysqli_fetch_assoc($result));
    } else {
        http_response_code(404);
    }
} else {
    http_response_code(500);
}
?>