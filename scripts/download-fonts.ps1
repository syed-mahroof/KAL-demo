$ErrorActionPreference = 'Stop'
New-Item -ItemType Directory -Path 'D:\KAL-Demo\public\fonts' -Force | Out-Null
$response = Invoke-WebRequest -Uri 'https://fonts.googleapis.com/css2?family=Manrope:wght@400..800&family=Public+Sans:wght@400..700&display=swap' -UserAgent 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36' -TimeoutSec 30
$latinBlocks = [regex]::Matches($response.Content, '/\* latin \*/\s*(@font-face\s*\{[\s\S]*?\})')
if ($latinBlocks.Count -ne 2) { throw 'Expected two Latin font subsets.' }
$fontCss = ($latinBlocks | ForEach-Object { $_.Groups[1].Value }) -join "`n"
$urls = [regex]::Matches($fontCss, 'https://fonts.gstatic.com/[^)]+') | ForEach-Object { $_.Value } | Sort-Object -Unique
$counter = 0
foreach ($url in $urls) {
  $counter++
  $extension = [System.IO.Path]::GetExtension(([uri]$url).AbsolutePath)
  $filename = "font-$counter$extension"
  Invoke-WebRequest -Uri $url -OutFile "D:\KAL-Demo\public\fonts\$filename" -TimeoutSec 30
  $fontCss = $fontCss.Replace($url, "/fonts/$filename")
}
[System.IO.File]::WriteAllText('D:\KAL-Demo\public\fonts\fonts.css', $fontCss)
Get-ChildItem -LiteralPath 'D:\KAL-Demo\public\fonts' -Filter 'font-*.ttf' | ForEach-Object { Remove-Item -LiteralPath $_.FullName }
Invoke-WebRequest -Uri 'https://raw.githubusercontent.com/google/fonts/main/ofl/manrope/OFL.txt' -OutFile 'D:\KAL-Demo\public\fonts\Manrope-OFL.txt' -TimeoutSec 30
Invoke-WebRequest -Uri 'https://raw.githubusercontent.com/google/fonts/main/ofl/publicsans/OFL.txt' -OutFile 'D:\KAL-Demo\public\fonts\PublicSans-OFL.txt' -TimeoutSec 30
Write-Output "Downloaded $counter font files."
