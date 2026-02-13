<?php

error_reporting(0);
ini_set("display_errors", "0");
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");

$response = [
  "iss" => null,
  "nasaTitle" => null,
  "errors" => [
    "iss" => null,
    "crawler" => null,
    "guzzle" => null,
  ],
];

try {
  // --- Guzzle: API call for ISS position ---
  $autoload = __DIR__ . "/../vendor/autoload.php";
  if (!file_exists($autoload)) {
    throw new Exception("vendor/autoload.php not found. Run: composer install");
  }
  require $autoload;

  $client = new GuzzleHttp\Client(["timeout" => 5.0]);
  $issResponse = $client->get("https://api.wheretheiss.at/v1/satellites/25544");
  $issBody = $issResponse->getBody()->getContents();

  // --- JSON parser ---
  $issData = json_decode($issBody, true, 512, JSON_THROW_ON_ERROR);
  $response["iss"] = $issData;
} catch (Throwable $e) {
  $response["errors"]["iss"] = $e->getMessage();
}

try {
  // --- cURL: Crawler (web) ---
  $ch = curl_init("https://www.nasa.gov/");
  curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_TIMEOUT        => 5,
    CURLOPT_USERAGENT      => "UPA-Dashboard/1.0",
  ]);
  $html = curl_exec($ch);
  if ($html === false) {
    throw new Exception(curl_error($ch));
  }
  curl_close($ch);

  // Parse HTML for page title
  if (preg_match("/<title[^>]*>(.*?)<\/title>/is", $html, $matches)) {
    $response["nasaTitle"] = trim($matches[1]);
  } else {
    $response["nasaTitle"] = "NASA (title not found)";
  }
} catch (Throwable $e) {
  $response["errors"]["crawler"] = $e->getMessage();
}

echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
