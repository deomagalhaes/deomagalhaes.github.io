# Gerador Determinístico de Capas Ilustradas para Jogos Infantis e Juvenis — Deo Magalhães
# Uso:
#   powershell -NoProfile -ExecutionPolicy Bypass -File scripts/gerar-capa-jogo-infantojuvenil.ps1 -Slug "jogo-semaforo-tartaruga-calma" -Theme "tartaruga-semaforo" -AgeGroup "infantil"

param(
    [Parameter(Mandatory=$true)][string]$Slug,
    [string]$Theme = "tartaruga-semaforo",
    [ValidateSet("infantil", "jovens")][string]$AgeGroup = "infantil"
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoDir = Split-Path -Parent $scriptDir
$outDir = Join-Path $repoDir "assets\imagens"
if (-not (Test-Path $outDir)) {
    New-Item -ItemType Directory -Path $outDir -Force | Out-Null
}

$cleanSlug = $Slug -replace '\.png$', ''
$outPath = Join-Path $outDir "$cleanSlug.png"

$width = 800
$height = 500
$bmp = New-Object System.Drawing.Bitmap($width, $height)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

# Paleta base por faixa etária
if ($AgeGroup -eq "infantil") {
    $cTop = [System.Drawing.Color]::FromArgb(255, 7, 78, 94)     # Azul-petróleo acolhedor
    $cBot = [System.Drawing.Color]::FromArgb(255, 14, 138, 130)  # Verde-água luminoso
} else {
    $cTop = [System.Drawing.Color]::FromArgb(255, 5, 24, 38)     # Azul noturno juvenil
    $cBot = [System.Drawing.Color]::FromArgb(255, 0, 95, 115)    # Petróleo profundo
}

$rectFull = New-Object System.Drawing.Rectangle(0, 0, $width, $height)
$bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    $rectFull, $cTop, $cBot, [System.Drawing.Drawing2D.LinearGradientMode]::Vertical
)
$g.FillRectangle($bgBrush, $rectFull)

# Brilho radial suave no centro superior (onde a arte fica visível acima do título do card)
$glowPath = New-Object System.Drawing.Drawing2D.GraphicsPath
$glowPath.AddEllipse(150, -30, 500, 380)
$glowBrush = New-Object System.Drawing.Drawing2D.PathGradientBrush($glowPath)
$glowBrush.CenterColor = [System.Drawing.Color]::FromArgb(75, 148, 210, 189)
$glowBrush.SurroundColors = @([System.Drawing.Color]::FromArgb(0, 0, 95, 115))
$g.FillPath($glowBrush, $glowPath)

# Estrelas e partículas lúdicas de fundo
$rng = New-Object System.Random(($cleanSlug.GetHashCode()))
for ($i = 0; $i -lt 36; $i++) {
    $px = $rng.Next(30, 770)
    $py = $rng.Next(20, 340)
    $sz = $rng.Next(3, 9)
    $alpha = $rng.Next(45, 160)
    $pBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb($alpha, 233, 216, 166))
    $g.FillEllipse($pBrush, $px, $py, $sz, $sz)
    $pBrush.Dispose()
}

# Colinas suaves orgânicas na base (para jogos infantis) ou malha cibernética (para jovens)
if ($AgeGroup -eq "infantil") {
    $hill1Brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(110, 42, 157, 143))
    $hill2Brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(160, 0, 58, 72))
    $g.FillEllipse($hill1Brush, -120, 270, 620, 320)
    $g.FillEllipse($hill1Brush, 320, 260, 600, 340)
    $g.FillEllipse($hill2Brush, 80, 310, 680, 300)
    $hill1Brush.Dispose()
    $hill2Brush.Dispose()
} else {
    $gridPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(35, 148, 210, 189), 1.5)
    for ($x = 60; $x -lt 760; $x += 65) {
        $g.DrawLine($gridPen, $x, 30, $x, 420)
    }
    for ($y = 40; $y -lt 400; $y += 55) {
        $g.DrawLine($gridPen, 40, $y, 760, $y)
    }
    $gridPen.Dispose()
}

# Ilustração Central Condizente com o Tema (Posicionada em Y = 45..310 para nunca colidir com o texto inferior do card)
switch -Wildcard ($Theme) {
    "*tartaruga*" {
        # 1. Moldura de Semáforo Lúdico à esquerda (x=190..280, y=55..275)
        $semHousingBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(245, 18, 42, 54))
        $semBorderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 238, 155, 0), 4)
        $g.FillRectangle($semHousingBrush, 185, 55, 96, 225)
        $g.DrawRectangle($semBorderPen, 185, 55, 96, 225)

        # Haste do semáforo
        $poleBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(220, 18, 42, 54))
        $g.FillRectangle($poleBrush, 225, 280, 16, 60)

        # Luz Vermelha (PARE), Amarela (PENSE), Verde (AJA) com halos brilhantes
        $redGlow = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(70, 239, 68, 68))
        $redLight = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 239, 68, 68))
        $yelGlow = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(70, 245, 158, 11))
        $yelLight = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 251, 191, 36))
        $grnGlow = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(90, 16, 185, 129))
        $grnLight = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 52, 211, 153))

        $g.FillEllipse($redGlow, 201, 63, 64, 64)
        $g.FillEllipse($redLight, 210, 72, 46, 46)

        $g.FillEllipse($yelGlow, 201, 135, 64, 64)
        $g.FillEllipse($yelLight, 210, 144, 46, 46)

        $g.FillEllipse($grnGlow, 201, 207, 64, 64)
        $g.FillEllipse($grnLight, 210, 216, 46, 46)

        # 2. Tartaruga Amigável Teca à direita (x=340..620, y=80..290)
        # Ondas de respiração calma ao redor da tartaruga
        $breathPen1 = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(95, 148, 210, 189), 3)
        $breathPen1.DashStyle = [System.Drawing.Drawing2D.DashStyle]::Dash
        $g.DrawEllipse($breathPen1, 325, 60, 300, 240)
        $g.DrawEllipse($breathPen1, 300, 40, 350, 280)

        # Patinhas da tartaruga
        $skinBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 132, 204, 160))
        $skinDarkPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 10, 110, 95), 3)
        $g.FillEllipse($skinBrush, 365, 230, 52, 42)
        $g.DrawEllipse($skinDarkPen, 365, 230, 52, 42)
        $g.FillEllipse($skinBrush, 495, 230, 52, 42)
        $g.DrawEllipse($skinDarkPen, 495, 230, 52, 42)

        # Cabeça sorridente da tartaruga
        $g.FillEllipse($skinBrush, 525, 140, 82, 74)
        $g.DrawEllipse($skinDarkPen, 525, 140, 82, 74)

        # Olho expressivo e brilhante
        $whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
        $pupilBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 0, 18, 25))
        $cheekBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(140, 244, 114, 182))
        $g.FillEllipse($whiteBrush, 565, 154, 24, 24)
        $g.FillEllipse($pupilBrush, 573, 159, 13, 13)
        $g.FillEllipse($whiteBrush, 576, 161, 5, 5)
        $g.FillEllipse($cheekBrush, 558, 182, 18, 11)

        # Sorriso sereno
        $smilePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 0, 58, 72), 3.5)
        $g.DrawArc($smilePen, 562, 172, 28, 22, 15, 145)

        # Casco Abobadado Decorado (Hexágonos Dourados e Esmeralda)
        $shellBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 10, 147, 150))
        $shellAccentBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 238, 155, 0))
        $shellRimBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 233, 216, 166))
        $shellPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 254, 243, 199), 4)

        $g.FillPie($shellBrush, 345, 95, 215, 220, 180, 180)
        $g.DrawPie($shellPen, 345, 95, 215, 220, 180, 180)

        # Detalhes geométricos do casco
        $g.FillEllipse($shellAccentBrush, 422, 120, 62, 52)
        $g.DrawEllipse($shellPen, 422, 120, 62, 52)
        $g.FillEllipse($shellAccentBrush, 368, 150, 46, 42)
        $g.FillEllipse($shellAccentBrush, 492, 150, 46, 42)
        $g.FillRectangle($shellRimBrush, 342, 198, 222, 16)
        $g.DrawRectangle($skinDarkPen, 342, 198, 222, 16)
    }
    "*bussola*" {
        # Bússola Luminosa de Decisão Juvenil (Córtex Pré-Frontal vs Impulso)
        $outerGlowPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(60, 238, 155, 0), 12)
        $ringPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(230, 238, 155, 0), 4)
        $innerRingPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(180, 148, 210, 189), 2)
        $dialPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(140, 255, 255, 255), 1.5)
        
        $cx = 400.0
        $cy = 170.0
        $r = 120.0

        # Halos circulares
        $xOuter = [float]($cx - $r - 6)
        $yOuter = [float]($cy - $r - 6)
        $dOuter = [float](($r + 6) * 2)
        $g.DrawEllipse($outerGlowPen, $xOuter, $yOuter, $dOuter, $dOuter)

        $xRing = [float]($cx - $r)
        $yRing = [float]($cy - $r)
        $dRing = [float]($r * 2)
        $g.DrawEllipse($ringPen, $xRing, $yRing, $dRing, $dRing)

        $xInner = [float]($cx - $r + 20)
        $yInner = [float]($cy - $r + 20)
        $dInner = [float](($r - 20) * 2)
        $g.DrawEllipse($innerRingPen, $xInner, $yInner, $dInner, $dInner)

        # Graduação angular da bússola (traços de 30 em 30 graus)
        for ($deg = 0; $deg -lt 360; $deg += 30) {
            $rad = [Math]::PI * $deg / 180.0
            $x1 = [float]($cx + ($r - 18) * [Math]::Cos($rad))
            $y1 = [float]($cy + ($r - 18) * [Math]::Sin($rad))
            $x2 = [float]($cx + ($r - 2) * [Math]::Cos($rad))
            $y2 = [float]($cy + ($r - 2) * [Math]::Sin($rad))
            $g.DrawLine($dialPen, $x1, $y1, $x2, $y2)
        }

        # Agulhas da Bússola: Norte (Dourado / Futuro & Córtex) e Sul (Ciano / Imediato)
        [System.Drawing.PointF[]]$northPts = @(
            (New-Object System.Drawing.PointF([float]$cx, [float]($cy - 95))),
            (New-Object System.Drawing.PointF([float]($cx + 18), [float]$cy)),
            (New-Object System.Drawing.PointF([float]$cx, [float]($cy - 12))),
            (New-Object System.Drawing.PointF([float]($cx - 18), [float]$cy))
        )
        [System.Drawing.PointF[]]$northLightPts = @(
            (New-Object System.Drawing.PointF([float]$cx, [float]($cy - 95))),
            (New-Object System.Drawing.PointF([float]($cx + 18), [float]$cy)),
            (New-Object System.Drawing.PointF([float]$cx, [float]($cy - 12)))
        )
        [System.Drawing.PointF[]]$southPts = @(
            (New-Object System.Drawing.PointF([float]$cx, [float]($cy + 95))),
            (New-Object System.Drawing.PointF([float]($cx + 18), [float]$cy)),
            (New-Object System.Drawing.PointF([float]$cx, [float]($cy + 12))),
            (New-Object System.Drawing.PointF([float]($cx - 18), [float]$cy))
        )
        [System.Drawing.PointF[]]$southLightPts = @(
            (New-Object System.Drawing.PointF([float]$cx, [float]($cy + 95))),
            (New-Object System.Drawing.PointF([float]($cx + 18), [float]$cy)),
            (New-Object System.Drawing.PointF([float]$cx, [float]($cy + 12)))
        )

        $nDarkBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 202, 103, 2))
        $nLightBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 209, 102))
        $sDarkBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 10, 147, 150))
        $sLightBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 148, 210, 189))

        $g.FillPolygon($nDarkBrush, $northPts)
        $g.FillPolygon($nLightBrush, $northLightPts)
        $g.FillPolygon($sDarkBrush, $southPts)
        $g.FillPolygon($sLightBrush, $southLightPts)

        # Pivô Central
        $centerGlow = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(120, 255, 255, 255))
        $centerBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 248, 250, 252))
        $centerBorder = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 0, 18, 25), 3)
        $g.FillEllipse($centerGlow, [float]($cx - 20), [float]($cy - 20), 40.0, 40.0)
        $g.FillEllipse($centerBrush, [float]($cx - 14), [float]($cy - 14), 28.0, 28.0)
        $g.DrawEllipse($centerBorder, [float]($cx - 14), [float]($cy - 14), 28.0, 28.0)

        # Letras Cardeais N / S / L / O
        $font = New-Object System.Drawing.Font("Segoe UI", 12, [System.Drawing.FontStyle]::Bold)
        $textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(240, 255, 255, 255))
        $goldTextBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 209, 102))
        $sf = New-Object System.Drawing.StringFormat
        $sf.Alignment = [System.Drawing.StringAlignment]::Center
        $sf.LineAlignment = [System.Drawing.StringAlignment]::Center

        $g.DrawString("FUTURO", $font, $goldTextBrush, [float]$cx, [float]($cy - $r + 14), $sf)
        $g.DrawString("AGORA", $font, $textBrush, [float]$cx, [float]($cy + $r - 14), $sf)
        $g.DrawString("O", $font, $textBrush, [float]($cx - $r + 14), [float]$cy, $sf)
        $g.DrawString("L", $font, $textBrush, [float]($cx + $r - 14), [float]$cy, $sf)

        # Limpeza
        $outerGlowPen.Dispose()
        $ringPen.Dispose()
        $innerRingPen.Dispose()
        $dialPen.Dispose()
        $nDarkBrush.Dispose()
        $nLightBrush.Dispose()
        $sDarkBrush.Dispose()
        $sLightBrush.Dispose()
        $centerGlow.Dispose()
        $centerBrush.Dispose()
        $centerBorder.Dispose()
        $font.Dispose()
        $textBrush.Dispose()
        $goldTextBrush.Dispose()
        $sf.Dispose()
    }
    default {
        # Constelação Neurocognitiva Lúdica Padrão
        $orbBrush1 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(230, 238, 155, 0))
        $orbBrush2 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(230, 148, 210, 189))
        $orbPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(200, 255, 255, 255), 3)
        $g.DrawLine($orbPen, 260, 170, 400, 110)
        $g.DrawLine($orbPen, 400, 110, 540, 170)
        $g.DrawLine($orbPen, 260, 170, 400, 230)
        $g.DrawLine($orbPen, 400, 230, 540, 170)
        $g.FillEllipse($orbBrush1, 365, 75, 70, 70)
        $g.FillEllipse($orbBrush2, 225, 135, 70, 70)
        $g.FillEllipse($orbBrush2, 505, 135, 70, 70)
        $g.FillEllipse($orbBrush1, 365, 195, 70, 70)
    }
}

$g.Dispose()
$bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()

Write-Host "✅ Capa gerada com sucesso em: $outPath" -ForegroundColor Green
