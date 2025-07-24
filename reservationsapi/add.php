<?php
require 'connect.php';

// Get the posted data
$postdata = file_get_contents("php://input");

if (isset($postdata) && !empty($postdata)) {

  // Extract the data
  $request = json_decode($postdata);

  // Validate
  if (
    trim($request->data->location) === '' ||
    trim($request->data->start_time) === '' ||
    trim($request->data->end_time) === ''
  ) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields.']);
    exit;
  }

  // Sanitize
  $location = mysqli_real_escape_string($con, trim($request->data->location));
  $start_time = mysqli_real_escape_string($con, trim($request->data->start_time));
  $end_time = mysqli_real_escape_string($con, trim($request->data->end_time));
  $reserved = isset($request->data->reserved) ? (int)$request->data->reserved : 0;
  $imageName = mysqli_real_escape_string($con, trim($request->data->imageName));

  $origimg = str_replace('\\', '/', $imageName);
  $new = basename($origimg);
  if (empty($new)) {
    $new = 'placeholder.jpg';
  }

  // 🔍 Duplicate check for same location and times
  $checkSql = "SELECT 1 FROM reservations 
               WHERE location = '{$location}' 
               AND start_time = '{$start_time}' 
               AND end_time = '{$end_time}' 
               LIMIT 1";

  $checkResult = mysqli_query($con, $checkSql);

  if (mysqli_num_rows($checkResult) > 0) {
    http_response_code(409);
    echo json_encode(['error' => 'A reservation already exists for this location and time.']);
    exit;
  }

  // Store the data
  $sql = "INSERT INTO `reservations` (`id`, `location`, `start_time`, `end_time`, `reserved`, `imageName`) 
          VALUES (NULL, '{$location}', '{$start_time}', '{$end_time}', '{$reserved}', '{$new}')";

  if (mysqli_query($con, $sql)) {
    http_response_code(201);

    $reservation = [
      'id' => mysqli_insert_id($con),
      'location' => $location,
      'start_time' => $start_time,
      'end_time' => $end_time,
      'reserved' => $reserved,
      'imageName' => $new
    ];

    echo json_encode(['data' => $reservation]);
  } else {
    http_response_code(500);
    echo json_encode(['error' => 'Database insert failed.']);
  }
}
?>