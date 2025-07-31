<?php
date_default_timezone_set('America/Toronto');
require 'connect.php';
header('Content-Type: application/json');
ini_set('display_errors', 1);
error_reporting(E_ALL);

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

$userName = mysqli_real_escape_string($con, $request->userName ?? '');
$password = $request->password ?? '';

if (empty($userName) || empty($password)) {
  http_response_code(400);
  echo json_encode(['error' => 'userName and password are required.']);
  exit;
}

$sql = "SELECT * FROM registrations WHERE userName = '$userName' LIMIT 1";
$result = mysqli_query($con, $sql);

if ($result && mysqli_num_rows($result) === 1) {
  $user = mysqli_fetch_assoc($result);

  $failedAttempts = (int)$user['failed_attempts'];
  $lastFailed = $user['last_failed_login'] ? strtotime($user['last_failed_login']) : 0;
  $lockoutDuration = 300; // 5 minutes in seconds

  $isLocked = $failedAttempts >= 3 && (time() - $lastFailed) < $lockoutDuration;

  if ($isLocked) {
    $remaining = ceil(($lockoutDuration - (time() - $lastFailed)) / 60);
    http_response_code(403);
    echo json_encode([
      'error' => "Account locked. Try again in $remaining minute(s)."
    ]);
    exit;
  }

  // ✅ Correct password
  if (password_verify($password, $user['password'])) {
    $update = "UPDATE registrations SET failed_attempts = 0, last_failed_login = NULL WHERE registrationID = {$user['registrationID']}";
    mysqli_query($con, $update);

    echo json_encode(['success' => true, 'message' => 'Login successful']);
  } else {
    // ❌ Failed login
    $failedAttempts++;
    $update = "UPDATE registrations SET failed_attempts = $failedAttempts, last_failed_login = NOW() WHERE registrationID = {$user['registrationID']}";
    mysqli_query($con, $update);

    if ($failedAttempts >= 3) {
      http_response_code(403);
      echo json_encode([
        'error' => "Account locked. Try again in 5 minute(s)."
      ]);
    } else {
      $remainingAttempts = 3 - $failedAttempts;
      http_response_code(401);
      echo json_encode([
        'error' => 'Invalid userName or password.',
        'remainingAttempts' => $remainingAttempts
      ]);
    }
  }
} else {
  http_response_code(404);
  echo json_encode(['error' => 'User not found.']);
}
?>