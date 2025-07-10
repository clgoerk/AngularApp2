<?php
  require 'connect.php';

  $id = ($_GET['id'] !== null && (int)$_GET['id'] > 0) ? mysqli_real_escape_string($con, (int)$_GET['id']) : false;

  if (!$id) {
    return http_response_code(400);
  } 

  $sql = "DELETE FROM `reservations` WHERE `id` = '{$id}' LIMIT 1";

  if (mysqli_query($con, $sql)) {
    http_response_code(204); // Success, no content
  } else {
    http_response_code(422); // Query error
  }
?>