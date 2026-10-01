$ErrorActionPreference = 'Stop'
$workspace = 'D:\KAL-Demo'
$source = [System.IO.File]::ReadAllText("$workspace\audit\original.html")
$source = [regex]::Replace($source, '<!--[\s\S]*?-->', '')
New-Item -ItemType Directory -Path "$workspace\audit\original-assets" -Force | Out-Null
$urls = [regex]::Matches($source, '<img[^>]+src=["'']([^"'']+)["'']') | ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique | Where-Object { $_ -match '/storage/uploads/|logo|abut-m|about-2|fav-ico' }
$manifest = $urls | ForEach-Object {
  [pscustomobject]@{ url = $_; original = [System.IO.Path]::GetFileName(([uri]$_).AbsolutePath) }
}
$manifest | ConvertTo-Json | Set-Content -LiteralPath "$workspace\audit\asset-sources.json" -Encoding utf8
$manifest | ForEach-Object -Parallel {
  Invoke-WebRequest -Uri $_.url -OutFile (Join-Path 'D:\KAL-Demo\audit\original-assets' $_.original) -TimeoutSec 60
} -ThrottleLimit 5
$pageUrls = @('overview','manufacturing-facilities','certifications','news','contact-us','board-of-directors')
$productUrls = [regex]::Matches($source, 'href=["''](https://kal.kerala.gov.in/products/[^"'']+)["'']') | ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique
$allPages = @($pageUrls | ForEach-Object { "https://kal.kerala.gov.in/$_" }) + @($productUrls)
$allPages | ForEach-Object -Parallel {
  $slug = ([uri]$_).AbsolutePath.Trim('/').Replace('/', '__')
  Invoke-WebRequest -Uri $_ -OutFile "D:\KAL-Demo\audit\$slug.html" -TimeoutSec 60
} -ThrottleLimit 5
foreach ($route in @('robots.txt', 'sitemap.xml')) {
  try {
    $response = Invoke-WebRequest -Uri "https://kal.kerala.gov.in/$route" -TimeoutSec 30
    [System.IO.File]::WriteAllText("$workspace\audit\$route", $response.Content)
    Write-Output "$route status: $($response.StatusCode)"
  } catch { Write-Output "$route status: $($_.Exception.Response.StatusCode)" }
}
Write-Output "Downloaded $($manifest.Count) source images and $($allPages.Count) pages."
