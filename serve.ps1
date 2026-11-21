# Очень простой локальный сервер для наших демо-сайтов.
# Запуск: powershell -ExecutionPolicy Bypass -File .\serve.ps1
$root = $PSScriptRoot

$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add("http://localhost:8000/")
$listener.Start()
Write-Host "Local server running at http://localhost:8000/"

while ($listener.IsListening) {
    $context = $listener.GetContext()
    $relative = [Uri]::UnescapeDataString($context.Request.Url.AbsolutePath).TrimStart('/')
    if (-not $relative) { $relative = 'index.html' }
    $file = Join-Path $root $relative

    if (Test-Path -LiteralPath $file -PathType Leaf) {
        $bytes = [System.IO.File]::ReadAllBytes($file)
        $context.Response.ContentType = 'text/html; charset=utf-8'
        $context.Response.ContentLength64 = $bytes.Length
        $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
        $context.Response.StatusCode = 404
    }
    $context.Response.Close()
}
