<?php
require 'connect.php';

header('Content-Type: application/json');

// Validate ID
$id = isset($_POST['id']) ? (int) $_POST['id'] : 0;
if ($id <= 0) {
  http_response_code(400);
  echo json_encode(['error' => 'Invalid reservation ID.']);
  exit;
}

// Gather inputs
$location = trim($_POST['location'] ?? '');
$start_time = trim($_POST['start_time'] ?? '');
$end_time = trim($_POST['end_time'] ?? '');
$reserved = $_POST['reserved'] ?? '0';
$originalImageName = trim($_POST['originalImageName'] ?? 'placeholder.jpg');

// Validate required fields
if ($location === '' || $start_time === '' || $end_time === '') {
  http_response_code(400);
  echo json_encode(['error' => 'All fields are required.']);
  exit;
}

// Check for duplicate reservation (excluding current ID)
$checkSql = "SELECT id FROM reservations 
             WHERE location = ? AND start_time = ? AND end_time = ? AND id != ? LIMIT 1";
$checkStmt = $con->prepare($checkSql);
$checkStmt->bind_param("sssi", $location, $start_time, $end_time, $id);
$checkStmt->execute();
$checkResult = $checkStmt->get_result();

if ($checkResult && $checkResult->num_rows > 0) {
  http_response_code(409); // Conflict
  echo json_encode(['error' => 'A reservation already exists for this location and time.']);
  $checkStmt->close();
  $con->close();
  exit;
}
$checkStmt->close();

// Handle image upload
$target_dir = "uploads/";
$imageName = $originalImageName;

if (isset($_FILES["image"]) && $_FILES["image"]["error"] === UPLOAD_ERR_OK) {
  $tmp_name = $_FILES["image"]["tmp_name"];
  $filename = basename($_FILES["image"]["name"]);
  $target_file = $target_dir . $filename;

  // Delete old image if not placeholder
  if ($originalImageName !== 'placeholder.jpg') {
    $oldPath = $target_dir . $originalImageName;
    if (file_exists($oldPath)) {
      unlink($oldPath);
    }
  }

  if (move_uploaded_file($tmp_name, $target_file)) {
    $imageName = $filename;
  }
}

// Update reservation
$updateSql = "UPDATE reservations 
              SET location = ?, start_time = ?, end_time = ?, reserved = ?, imageName = ? 
              WHERE id = ?";

$stmt = $con->prepare($updateSql);
if (!$stmt) {
  http_response_code(500);
  echo json_encode(['error' => 'Failed to prepare update statement.']);
  exit;
}

$stmt->bind_param("sssssi", $location, $start_time, $end_time, $reserved, $imageName, $id);

if ($stmt->execute()) {
  echo json_encode(['success' => true]);
} else {
  http_response_code(500);
  echo json_encode(['error' => 'Failed to update reservation.']);
}

$stmt->close();
$con->close();