<?php
session_start();

header('Content-Type: application/json');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require 'connect.php';

if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
  $uploadDir = 'uploads/';
  $originalFileName = basename($_FILES['image']['name']);
  $fileTmpPath = $_FILES['image']['tmp_name'];

  // Validate MIME type
  $allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  $mimeType = mime_content_type($fileTmpPath);

  // Validate extension
  $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
  $fileExtension = strtolower(pathinfo($originalFileName, PATHINFO_EXTENSION));

  if (!in_array($mimeType, $allowedMimeTypes) || !in_array($fileExtension, $allowedExtensions)) {
    http_response_code(400);
    echo json_encode(['message' => 'Only image files (jpg, png, gif, webp) are allowed.']);
    exit;
  }

  // Use original file name (no renaming)
  $targetFilePath = $uploadDir . $originalFileName;

  if (move_uploaded_file($fileTmpPath, $targetFilePath)) {
    echo json_encode(['message' => 'Image uploaded successfully']);
  } else {
    http_response_code(500);
    echo json_encode(['message' => 'Failed to upload image']);
  }

  exit;
}
?>