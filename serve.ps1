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
    if (Test-Path -LiteralPath $file -PathType Container) { $file = Join-Path $file 'index.html' }

    if (Test-Path -LiteralPath $file -PathType Leaf) {
        $bytes = [System.IO.File]::ReadAllBytes($file)
        $types = @{
            '.html' = 'text/html; charset=utf-8'
            '.css'  = 'text/css; charset=utf-8'
            '.js'   = 'application/javascript; charset=utf-8'
            '.json' = 'application/json; charset=utf-8'
            '.svg'  = 'image/svg+xml'
            '.jpg'  = 'image/jpeg'
            '.jpeg' = 'image/jpeg'
            '.png'  = 'image/png'
            '.webp' = 'image/webp'
            '.avif' = 'image/avif'
            '.ico'  = 'image/x-icon'
            '.woff' = 'font/woff'
            '.woff2'= 'font/woff2'
            '.txt'  = 'text/plain; charset=utf-8'
        }
        $ext = [System.IO.Path]::GetExtension($file).ToLowerInvariant()
        $context.Response.ContentType = if ($types.ContainsKey($ext)) { $types[$ext] } else { 'application/octet-stream' }
        $context.Response.ContentLength64 = $bytes.Length
        $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
        $context.Response.StatusCode = 404
    }
    $context.Response.Close()
}
