<?php
  ini_set('display_errors', 1);
  ini_set('display_startup_errors', 1);
  error_reporting(E_ALL);
  
  require 'connect.php';

  $reservations = [];
  $sql = "SELECT id, location, start_time, end_time, reserved, imageName FROM reservations";

  if ($result = mysqli_query($con, $sql)) {
    $count = 0;
    while ($row = mysqli_fetch_assoc($result)) {
      $reservations[$count]['id'] = $row['id'];
      $reservations[$count]['location'] = $row['location'];
      $reservations[$count]['start_time'] = $row['start_time'];
      $reservations[$count]['end_time'] = $row['end_time'];
      $reservations[$count]['reserved'] = (bool)$row['reserved'];
      $reservations[$count]['imageName'] = $row['imageName'];
      $count++;
    }

    echo json_encode(['data' => $reservations]);
  } else {
    http_response_code(404);
    echo json_encode(['error' => 'Failed to retrieve reservations']);
  }
?>