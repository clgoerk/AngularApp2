<?php
require 'connect.php';

header('Content-Type: application/json');

// Get ID
$id = isset($_POST['id']) ? (int) $_POST['id'] : 0;
if ($id <= 0) {
  http_response_code(400);
  echo json_encode(['error' => 'Invalid ID']);
  exit;
}

// Get values
$location = $_POST['location'] ?? '';
$start_time = $_POST['start_time'] ?? '';
$end_time = $_POST['end_time'] ?? '';
$reserved = $_POST['reserved'] ?? '0';
$originalImageName = $_POST['originalImageName'] ?? 'placeholder.jpg';

$target_dir = "uploads/";
$imageName = $originalImageName;

// Handle image upload
if (isset($_FILES["image"]) && $_FILES["image"]["error"] == UPLOAD_ERR_OK) {
  $tmp_name = $_FILES["image"]["tmp_name"];
  $filename = basename($_FILES["image"]["name"]);
  $target_file = $target_dir . $filename;

  // Remove old image if it's not the placeholder
  if ($originalImageName !== 'placeholder.jpg') {
    $oldPath = $target_dir . $originalImageName;
    if (file_exists($oldPath)) {
      unlink($oldPath); // delete old image
    }
  }

  // Upload new image
  if (move_uploaded_file($tmp_name, $target_file)) {
    $imageName = $filename;
  }
}

// Update reservation
$sql = "UPDATE reservations 
        SET location = ?, start_time = ?, end_time = ?, reserved = ?, imageName = ? 
        WHERE id = ?";

$stmt = $con->prepare($sql);
if ($stmt === false) {
  http_response_code(500);
  echo json_encode(['error' => 'Failed to prepare statement']);
  exit;
}

$stmt->bind_param("sssssi", $location, $start_time, $end_time, $reserved, $imageName, $id);

if ($stmt->execute()) {
  echo json_encode(['success' => true]);
} else {
  http_response_code(500);
  echo json_encode(['error' => 'Failed to update']);
}

$stmt->close();
$con->close();