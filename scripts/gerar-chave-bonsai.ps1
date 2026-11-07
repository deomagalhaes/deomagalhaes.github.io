param(
    [Parameter(Mandatory = $true)]
    [string]$Email,
    [string]$Salt = ""
)

$alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
$pepper = "DEO_NEURO_BOTANY_2026_V1"
$normEmail = $Email.Trim().ToLowerInvariant()

if ([string]::IsNullOrWhiteSpace($Salt) -or $Salt.Length -ne 4) {
    $rng = New-Object System.Random
    $chars = for ($i = 0; $i -lt 4; $i++) { $alphabet[$rng.Next(0, $alphabet.Length)] }
    $Salt = -join $chars
} else {
    $Salt = $Salt.ToUpperInvariant()
}

$payload = "BMORI_V1|$normEmail|$Salt|$pepper"
$sha = [System.Security.Cryptography.SHA256]::Create()
$hashBytes = $sha.ComputeHash([System.Text.Encoding]::UTF8.GetBytes($payload))

$sig = ""
for ($i = 0; $i -lt 8; $i++) {
    $idx = $hashBytes[$i] -band 31
    $sig += $alphabet[$idx]
}

$key = "BMORI-$Salt-$($sig.Substring(0,4))-$($sig.Substring(4,4))"

Write-Host "==========================================================" -ForegroundColor Green
Write-Host "  LICENCA VITALICIA BONSAI MORI PRO GERADA" -ForegroundColor Cyan
Write-Host "  E-mail Vinculado : $normEmail" -ForegroundColor Yellow
Write-Host "  Chave Vitalicia  : $key" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
