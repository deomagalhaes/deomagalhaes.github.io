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
    "*coqueiro*" {
        # Campo de Futebol Encantado: Traves de Plantas Vivas, Juiz Coqueiro, Portugal (#7) & Argentina (#10)
        # 1. Linhas do gramado sutil
        $fieldPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(90, 255, 255, 255), 2.5)
        $g.DrawEllipse($fieldPen, 290, 225, 220, 65)

        # 2. Traves do Gol formadas por Plantas, Cipós e Flores (x=175..445, y=68..255)
        $vinePenDark = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 21, 128, 61), 14)
        $vinePenLight = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 74, 222, 128), 6)
        $netPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(75, 187, 247, 208), 1.5)

        # Rede de cipós finos ao fundo do gol
        for ($nx = 195; $nx -le 425; $nx += 23) {
            $g.DrawLine($netPen, $nx, 75, $nx, 250)
        }
        for ($ny = 95; $ny -le 245; $ny += 25) {
            $g.DrawLine($netPen, 185, $ny, 435, $ny)
        }

        # Traves de troncos vivos e cipós entrelaçados
        $g.DrawLine($vinePenDark, 185, 255, 185, 72)
        $g.DrawLine($vinePenDark, 435, 255, 435, 72)
        $g.DrawLine($vinePenDark, 180, 72, 440, 72)

        $g.DrawLine($vinePenLight, 185, 252, 185, 74)
        $g.DrawLine($vinePenLight, 435, 252, 435, 74)
        $g.DrawLine($vinePenLight, 183, 72, 437, 72)

        # Folhinhas e Flores nas traves de plantas
        $leafBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 34, 197, 94))
        $flowerPink = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 244, 114, 182))
        $flowerGold = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 250, 204, 21))

        $flowerCoords = @(
            @(176, 64), @(250, 62), @(310, 62), @(370, 62), @(426, 64),
            @(174, 120), @(174, 180), @(426, 120), @(426, 180)
        )
        foreach ($fc in $flowerCoords) {
            $fx = [int]$fc[0]
            $fy = [int]$fc[1]
            $g.FillEllipse($leafBrush, $fx - 8, $fy - 4, 24, 14)
            $g.FillEllipse($flowerPink, $fx, $fy, 14, 14)
            $g.FillEllipse($flowerGold, $fx + 4, $fy + 4, 6, 6)
        }

        # 3. Insígnias Portugal #7 (CR7) e Argentina #10 (Messi) + Bola Central
        $fontBadge = New-Object System.Drawing.Font("Segoe UI", 13, [System.Drawing.FontStyle]::Bold)
        $sfCenter = New-Object System.Drawing.StringFormat
        $sfCenter.Alignment = [System.Drawing.StringAlignment]::Center
        $sfCenter.LineAlignment = [System.Drawing.StringAlignment]::Center

        # Camisa/Orbe Portugal #7 (Vermelho Rubi & Verde)
        $ptBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 220, 38, 38))
        $ptRimPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 250, 204, 21), 3)
        $g.FillEllipse($ptBrush, 215, 155, 58, 58)
        $g.DrawEllipse($ptRimPen, 215, 155, 58, 58)
        $whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
        $g.DrawString("CR7", $fontBadge, $whiteBrush, [float]244, [float]184, $sfCenter)

        # Camisa/Orbe Argentina #10 (Azul Celeste & Branco)
        $arBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 56, 189, 248))
        $arRimPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 255, 255, 255), 3)
        $g.FillEllipse($arBrush, 348, 155, 58, 58)
        $g.DrawEllipse($arRimPen, 348, 155, 58, 58)
        $darkBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 15, 23, 42))
        $g.DrawString("M10", $fontBadge, $darkBrush, [float]377, [float]184, $sfCenter)

        # Bola de Futebol Brilhante no Centro do Gol
        $goldGlow = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(85, 250, 204, 21))
        $g.FillEllipse($goldGlow, 280, 185, 62, 62)
        $g.FillEllipse($whiteBrush, 290, 195, 42, 42)
        $ballPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 15, 23, 42), 2.5)
        $g.DrawEllipse($ballPen, 290, 195, 42, 42)
        $g.FillEllipse($darkBrush, 304, 209, 14, 14)

        # 4. O Juiz Coqueiro à Direita (x=545..665, y=65..265)
        $trunkBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 180, 83, 9))
        $trunkPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 120, 53, 15), 3)
        $g.FillRectangle($trunkBrush, 575, 125, 34, 135)
        $g.DrawRectangle($trunkPen, 575, 125, 34, 135)

        # Faixas de Camisa de Juiz no Tronco do Coqueiro
        $refStripe = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(220, 15, 23, 42))
        $g.FillRectangle($refStripe, 577, 165, 10, 45)
        $g.FillRectangle($refStripe, 597, 165, 10, 45)

        # Copa de Folhas do Coqueiro
        $palmBrush1 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 16, 185, 129))
        $palmBrush2 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 52, 211, 153))
        $g.FillPie($palmBrush1, 500, 58, 130, 90, 175, 155)
        $g.FillPie($palmBrush1, 555, 58, 130, 90, 210, 155)
        $g.FillPie($palmBrush2, 525, 42, 135, 95, 190, 160)

        # Cocos e Rosto Amigável do Juiz Coqueiro + Apito Dourado
        $cocoBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 120, 53, 15))
        $g.FillEllipse($cocoBrush, 566, 108, 24, 24)
        $g.FillEllipse($cocoBrush, 592, 108, 24, 24)

        # Olhos sorridentes e Apito Dourado
        $g.FillEllipse($whiteBrush, 579, 134, 10, 10)
        $g.FillEllipse($whiteBrush, 595, 134, 10, 10)
        $g.FillEllipse($darkBrush, 582, 137, 5, 5)
        $g.FillEllipse($darkBrush, 598, 137, 5, 5)
        $g.FillEllipse($flowerGold, 586, 148, 14, 10)

        # Cartão Verde do Fair Play levantado pelo Juiz Coqueiro
        $cardFairBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 250, 204, 21))
        $g.FillRectangle($cardFairBrush, 528, 145, 22, 32)
        $g.DrawRectangle($ballPen, 528, 145, 22, 32)

        # Limpeza
        $fieldPen.Dispose()
        $vinePenDark.Dispose()
        $vinePenLight.Dispose()
        $netPen.Dispose()
        $leafBrush.Dispose()
        $flowerPink.Dispose()
        $flowerGold.Dispose()
        $fontBadge.Dispose()
        $sfCenter.Dispose()
        $ptBrush.Dispose()
        $ptRimPen.Dispose()
        $arBrush.Dispose()
        $arRimPen.Dispose()
        $whiteBrush.Dispose()
        $darkBrush.Dispose()
        $goldGlow.Dispose()
        $ballPen.Dispose()
        $trunkBrush.Dispose()
        $trunkPen.Dispose()
        $refStripe.Dispose()
        $palmBrush1.Dispose()
        $palmBrush2.Dispose()
        $cocoBrush.Dispose()
        $cardFairBrush.Dispose()
    }
    "*mochila*" {
        # Mochila Executiva Infantil: Organização, Memória Operacional, Checklist Visual e Itens Escolares
        # 1. Prancheta de Checklist Visual à Esquerda (x=160..310, y=70..280)
        $clipBoardBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 217, 119, 6))
        $paperBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 248, 250, 252))
        $clipBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 148, 163, 184))
        $checkGreen = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 16, 185, 129))
        $linePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(180, 203, 213, 225), 3)
        $boardPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 180, 83, 9), 3)

        # Base da prancheta
        $g.FillRectangle($clipBoardBrush, 165, 75, 140, 195)
        $g.DrawRectangle($boardPen, 165, 75, 140, 195)

        # Folha de papel
        $g.FillRectangle($paperBrush, 175, 88, 120, 172)

        # Clipe superior da prancheta
        $g.FillRectangle($clipBrush, 210, 68, 50, 18)

        # 3 Itens do Checklist com Caixas e Tiques Verdes
        $checkPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 16, 185, 129), 3.5)
        $boxPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 100, 116, 139), 2)
        
        $itemY = @(112, 152, 192)
        foreach ($iy in $itemY) {
            # Quadrinho de checkbox
            $g.DrawRectangle($boxPen, 188, $iy, 18, 18)
            # Tique verde (check mark)
            $g.DrawLine($checkPen, 190, $iy + 9, 195, $iy + 15)
            $g.DrawLine($checkPen, 195, $iy + 15, 204, $iy + 4)
            # Linha representando o item da rotina
            $g.DrawLine($linePen, 216, $iy + 9, 280, $iy + 9)
        }

        # Estrela de Missão Cumprida no rodapé da prancheta
        $starBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 245, 158, 11))
        $g.FillEllipse($starBrush, 224, 230, 22, 22)

        # 2. Mochila Executiva Central (x=330..530, y=65..280)
        # Alça Superior da Mochila
        $strapPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 0, 43, 54), 8)
        $g.DrawArc($strapPen, 395, 52, 70, 50, 180, 180)

        # Corpo Principal da Mochila (Azul Petróleo Arredondado)
        $packBodyBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 0, 95, 115))
        $packBodyPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 148, 210, 189), 4)
        $g.FillPie($packBodyBrush, 335, 75, 190, 160, 180, 180)
        $g.FillRectangle($packBodyBrush, 335, 150, 190, 125)
        $g.DrawArc($packBodyPen, 335, 75, 190, 160, 180, 180)
        $g.DrawLine($packBodyPen, 335, 155, 335, 275)
        $g.DrawLine($packBodyPen, 525, 155, 525, 275)
        $g.DrawLine($packBodyPen, 335, 275, 525, 275)

        # Bolsinho Frontal da Mochila (Laranja Âmbar Vibrante)
        $frontPocketBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 238, 155, 0))
        $frontPocketPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 254, 243, 199), 3)
        $g.FillRectangle($frontPocketBrush, 360, 185, 140, 80)
        $g.DrawRectangle($frontPocketPen, 360, 185, 140, 80)

        # Linha de Zíper Dourada e Puxador
        $zipPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 255, 255, 255), 2.5)
        $zipPen.DashStyle = [System.Drawing.Drawing2D.DashStyle]::Dash
        $g.DrawLine($zipPen, 370, 200, 490, 200)
        $zipPuller = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 248, 250, 252))
        $g.FillEllipse($zipPuller, 435, 196, 12, 12)

        # Emblema da Mochila: Cérebro / Lâmpada de Ideias
        $badgeBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 10, 147, 150))
        $g.FillEllipse($badgeBrush, 415, 115, 30, 30)
        $badgePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 255, 209, 102), 2)
        $g.DrawEllipse($badgePen, 415, 115, 30, 30)

        # 3. Itens Flutuantes Escolares à Direita (x=550..680, y=75..275)
        # Caderno Escolar com Espiral
        $bookBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 224, 76, 56))
        $bookPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 254, 202, 202), 2)
        $g.FillRectangle($bookBrush, 560, 85, 95, 120)
        $g.DrawRectangle($bookPen, 560, 85, 95, 120)

        # Espiral do caderno
        $spiralPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 255, 255, 255), 3)
        for ($sy = 95; $sy -le 195; $sy += 14) {
            $g.DrawArc($spiralPen, 552, $sy, 16, 10, 90, 270)
        }

        # Estrela no Caderno
        $g.FillEllipse($starBrush, 595, 130, 26, 26)

        # Lápis Colorido e Régua
        $pencilBody = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 250, 204, 21))
        $pencilTip = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 254, 215, 170))
        $pencilLead = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 15, 23, 42))
        $pencilEraser = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 244, 114, 182))
        
        # Lápis inclinado (representado horizontal/diagonal)
        $g.FillRectangle($pencilEraser, 560, 225, 16, 20)
        $g.FillRectangle($pencilBody, 576, 225, 70, 20)
        [System.Drawing.Point[]]$tipPts = @(
            (New-Object System.Drawing.Point(646, 225)),
            (New-Object System.Drawing.Point(666, 235)),
            (New-Object System.Drawing.Point(646, 245))
        )
        $g.FillPolygon($pencilTip, $tipPts)
        [System.Drawing.Point[]]$leadPts = @(
            (New-Object System.Drawing.Point(658, 231)),
            (New-Object System.Drawing.Point(666, 235)),
            (New-Object System.Drawing.Point(658, 239))
        )
        $g.FillPolygon($pencilLead, $leadPts)

        # Brilhos e Faíscas de Concentração
        $sparkleBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(220, 255, 255, 255))
        $g.FillEllipse($sparkleBrush, 535, 95, 10, 10)
        $g.FillEllipse($sparkleBrush, 675, 160, 8, 8)
        $g.FillEllipse($sparkleBrush, 325, 200, 10, 10)

        # Limpeza
        $clipBoardBrush.Dispose()
        $paperBrush.Dispose()
        $clipBrush.Dispose()
        $checkGreen.Dispose()
        $linePen.Dispose()
        $boardPen.Dispose()
        $checkPen.Dispose()
        $boxPen.Dispose()
        $starBrush.Dispose()
        $strapPen.Dispose()
        $packBodyBrush.Dispose()
        $packBodyPen.Dispose()
        $frontPocketBrush.Dispose()
        $frontPocketPen.Dispose()
        $zipPen.Dispose()
        $zipPuller.Dispose()
        $badgeBrush.Dispose()
        $badgePen.Dispose()
        $bookBrush.Dispose()
        $bookPen.Dispose()
        $spiralPen.Dispose()
        $pencilBody.Dispose()
        $pencilTip.Dispose()
        $pencilLead.Dispose()
        $pencilEraser.Dispose()
        $sparkleBrush.Dispose()
    }
    "*radar*" {
        # Radar Anti-Ruminação e Desfusão Cognitiva Teen (ACT & TCC)
        $cx = 400.0
        $cy = 175.0
        $rMax = 130.0

        # Halos do Sonar / Radar
        $outerGlowPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(60, 10, 147, 150), 16)
        $radarBorderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 148, 210, 189), 3.5)
        $ringPen1 = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(120, 10, 147, 150), 2)
        $ringPen2 = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(90, 148, 210, 189), 1.5)
        $ringPen2.DashStyle = [System.Drawing.Drawing2D.DashStyle]::Dash
        $axisPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(140, 148, 210, 189), 1.5)
        $diagPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(70, 148, 210, 189), 1)
        $diagPen.DashStyle = [System.Drawing.Drawing2D.DashStyle]::Dot

        # Fundo do mostrador do Radar
        $radarBgBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(240, 2, 20, 30))
        $g.FillEllipse($radarBgBrush, [float]($cx - $rMax), [float]($cy - $rMax), [float]($rMax * 2), [float]($rMax * 2))
        $g.DrawEllipse($outerGlowPen, [float]($cx - $rMax - 4), [float]($cy - $rMax - 4), [float](($rMax + 4) * 2), [float](($rMax + 4) * 2))
        $g.DrawEllipse($radarBorderPen, [float]($cx - $rMax), [float]($cy - $rMax), [float]($rMax * 2), [float]($rMax * 2))

        # Círculos concêntricos de alcance do sonar
        $radii = @(35.0, 70.0, 105.0)
        foreach ($r in $radii) {
            $penToUse = if ($r -eq 70.0) { $ringPen2 } else { $ringPen1 }
            $g.DrawEllipse($penToUse, [float]($cx - $r), [float]($cy - $r), [float]($r * 2), [float]($r * 2))
        }

        # Eixos em cruz e diagonais
        $g.DrawLine($axisPen, [float]($cx - $rMax), [float]$cy, [float]($cx + $rMax), [float]$cy)
        $g.DrawLine($axisPen, [float]$cx, [float]($cy - $rMax), [float]$cx, [float]($cy + $rMax))
        $dOff = [float]($rMax * 0.7071)
        $g.DrawLine($diagPen, [float]($cx - $dOff), [float]($cy - $dOff), [float]($cx + $dOff), [float]($cy + $dOff))
        $g.DrawLine($diagPen, [float]($cx - $dOff), [float]($cy + $dOff), [float]($cx + $dOff), [float]($cy - $dOff))

        # Feixe Varredor do Radar (Scanner Sweep Pie - Gradiente Suave)
        $sweepPath = New-Object System.Drawing.Drawing2D.GraphicsPath
        $sweepPath.AddPie([float]($cx - $rMax), [float]($cy - $rMax), [float]($rMax * 2), [float]($rMax * 2), 220.0, 55.0)
        $sweepFill = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(65, 148, 210, 189))
        $g.FillPath($sweepFill, $sweepPath)
        $sweepLeadPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 233, 216, 166), 2.5)
        $leadRad = [Math]::PI * 275.0 / 180.0
        $g.DrawLine($sweepLeadPen, [float]$cx, [float]$cy, [float]($cx + $rMax * [Math]::Cos($leadRad)), [float]($cy + $rMax * [Math]::Sin($leadRad)))

        # Alvo 1: Blip Vermelho/Âmbar (Ruminação / Pensamento Intrusivo Detectado)
        $bx1 = [float]330.0
        $by1 = [float]118.0
        $blipRedGlow = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(80, 239, 68, 68))
        $blipRed = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 248, 113, 113))
        $redPulsePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(200, 239, 68, 68), 2)
        $redPulsePen.DashStyle = [System.Drawing.Drawing2D.DashStyle]::Dash
        $g.FillEllipse($blipRedGlow, ($bx1 - 22), ($by1 - 22), 44, 44)
        $g.DrawEllipse($redPulsePen, ($bx1 - 18), ($by1 - 18), 36, 36)
        $g.FillEllipse($blipRed, ($bx1 - 8), ($by1 - 8), 16, 16)

        # Mira visual no blip de ruminação
        $lockPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(240, 254, 202, 202), 1.5)
        $g.DrawRectangle($lockPen, [int]($bx1 - 13), [int]($by1 - 13), 26, 26)

        # Alvo 2: Blip Dourado (Desfusão Cognitiva em Ação / Desarmando Rádio Tagarela)
        $bx2 = [float]475.0
        $by2 = [float]135.0
        $blipGoldGlow = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(90, 238, 155, 0))
        $blipGold = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 209, 102))
        $goldPulsePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(220, 238, 155, 0), 2)
        $g.FillEllipse($blipGoldGlow, ($bx2 - 20), ($by2 - 20), 40, 40)
        $g.DrawEllipse($goldPulsePen, ($bx2 - 16), ($by2 - 16), 32, 32)
        $g.FillEllipse($blipGold, ($bx2 - 7), ($by2 - 7), 14, 14)

        # Alvo 3: Blip Esmeralda/Ciano (Âncora no Presente / Aterrisagem Sensorial)
        $bx3 = [float]395.0
        $by3 = [float]245.0
        $blipGrnGlow = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(90, 16, 185, 129))
        $blipGrn = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 52, 211, 153))
        $grnPulsePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(220, 52, 211, 153), 2)
        $g.FillEllipse($blipGrnGlow, ($bx3 - 18), ($by3 - 18), 36, 36)
        $g.DrawEllipse($grnPulsePen, ($bx3 - 14), ($by3 - 14), 28, 28)
        $g.FillEllipse($blipGrn, ($bx3 - 6), ($by3 - 6), 12, 12)

        # Centro do Radar (Núcleo Pré-Frontal / Observador Consciente)
        $coreGlow = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(120, 148, 210, 189))
        $coreBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 248, 250, 252))
        $corePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 0, 95, 115), 3)
        $g.FillEllipse($coreGlow, [float]($cx - 16), [float]($cy - 16), 32.0, 32.0)
        $g.FillEllipse($coreBrush, [float]($cx - 10), [float]($cy - 10), 20.0, 20.0)
        $g.DrawEllipse($corePen, [float]($cx - 10), [float]($cy - 10), 20.0, 20.0)

        # Osciloscópio Mental nas Laterais (Esquerda: Onda Beta Caótica / Direita: Onda Alfa Calma)
        $wavePenRed = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(180, 248, 113, 113), 2.5)
        $wavePenGrn = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(220, 52, 211, 153), 2.5)
        
        # Onda caótica da ruminação (esquerda: x=90..230, y=175)
        [System.Drawing.PointF[]]$rumPts = @(
            (New-Object System.Drawing.PointF(90, 175)),
            (New-Object System.Drawing.PointF(110, 150)),
            (New-Object System.Drawing.PointF(125, 200)),
            (New-Object System.Drawing.PointF(145, 140)),
            (New-Object System.Drawing.PointF(160, 205)),
            (New-Object System.Drawing.PointF(180, 155)),
            (New-Object System.Drawing.PointF(200, 190)),
            (New-Object System.Drawing.PointF(225, 175))
        )
        $g.DrawCurve($wavePenRed, $rumPts, 0.4)

        # Onda suave de desfusão (direita: x=575..715, y=175)
        [System.Drawing.PointF[]]$calmPts = @(
            (New-Object System.Drawing.PointF(575, 175)),
            (New-Object System.Drawing.PointF(605, 158)),
            (New-Object System.Drawing.PointF(645, 192)),
            (New-Object System.Drawing.PointF(685, 158)),
            (New-Object System.Drawing.PointF(715, 175))
        )
        $g.DrawCurve($wavePenGrn, $calmPts, 0.5)

        # Textos e Badges HUD Laterais
        $fontHud = New-Object System.Drawing.Font("Segoe UI", 9.5, [System.Drawing.FontStyle]::Bold)
        $fontTitle = New-Object System.Drawing.Font("Segoe UI", 12, [System.Drawing.FontStyle]::Bold)
        $textMuted = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(200, 148, 210, 189))
        $textGold = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 209, 102))
        $textRed = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 252, 165, 165))
        $textGrn = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 110, 231, 183))
        $sfC = New-Object System.Drawing.StringFormat
        $sfC.Alignment = [System.Drawing.StringAlignment]::Center

        $g.DrawString("RUMINAÇÃO (LOOP)", $fontHud, $textRed, 155.0, 115.0, $sfC)
        $g.DrawString("DESFUSÃO (ÂNCORA)", $fontHud, $textGrn, 645.0, 115.0, $sfC)
        $g.DrawString("RADAR COGNITIVO TEEN", $fontTitle, $textGold, [float]$cx, 35.0, $sfC)
        $g.DrawString("TCC & TERAPIA DE ACEITAÇÃO E COMPROMISSO", $fontHud, $textMuted, [float]$cx, [float]($cy + $rMax + 14), $sfC)

        # Descarte de recursos gráficos
        $outerGlowPen.Dispose()
        $radarBorderPen.Dispose()
        $ringPen1.Dispose()
        $ringPen2.Dispose()
        $axisPen.Dispose()
        $diagPen.Dispose()
        $radarBgBrush.Dispose()
        $sweepPath.Dispose()
        $sweepFill.Dispose()
        $sweepLeadPen.Dispose()
        $blipRedGlow.Dispose()
        $blipRed.Dispose()
        $redPulsePen.Dispose()
        $lockPen.Dispose()
        $blipGoldGlow.Dispose()
        $blipGold.Dispose()
        $goldPulsePen.Dispose()
        $blipGrnGlow.Dispose()
        $blipGrn.Dispose()
        $grnPulsePen.Dispose()
        $coreGlow.Dispose()
        $coreBrush.Dispose()
        $corePen.Dispose()
        $wavePenRed.Dispose()
        $wavePenGrn.Dispose()
        $fontHud.Dispose()
        $fontTitle.Dispose()
        $textMuted.Dispose()
        $textGold.Dispose()
        $textRed.Dispose()
        $textGrn.Dispose()
        $sfC.Dispose()
    }
    "*vulcao*" {
        # O Vulcão Calmo: Interocepção Infantil, Termômetro de Raiva e Kit de Resfriamento Vagal
        # 1. Termômetro de Emoções à Esquerda (x=170..280, y=65..280)
        $thermoFrameBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(240, 15, 23, 42))
        $thermoBorderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 238, 155, 0), 3.5)
        $g.FillRectangle($thermoFrameBrush, 175, 65, 80, 215)
        $g.DrawRectangle($thermoBorderPen, 175, 65, 80, 215)

        # Tubo de vidro do termômetro
        $glassTubeBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(220, 30, 41, 59))
        $g.FillRectangle($glassTubeBrush, 203, 75, 24, 150)
        $g.FillEllipse($glassTubeBrush, 193, 210, 44, 44)

        # Gradiente de Temperatura no Tubo: Base Azul/Verde (Calma), Meio Laranja (Alerta), Topo Vermelho (Erupção)
        $levelCalm = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 14, 165, 233))
        $levelWarm = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 245, 158, 11))
        $levelHot  = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 239, 68, 68))
        
        $g.FillEllipse($levelCalm, 197, 214, 36, 36)
        $g.FillRectangle($levelCalm, 207, 160, 16, 60)
        $g.FillRectangle($levelWarm, 207, 120, 16, 40)
        $g.FillRectangle($levelHot, 207, 85, 16, 35)

        # Marcadores de Nível (1 a 5)
        $tickPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(240, 255, 255, 255), 2)
        $fontTick = New-Object System.Drawing.Font("Segoe UI", 8.5, [System.Drawing.FontStyle]::Bold)
        $tickBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(240, 255, 255, 255))
        $sfR = New-Object System.Drawing.StringFormat
        $sfR.Alignment = [System.Drawing.StringAlignment]::Far
        $sfR.LineAlignment = [System.Drawing.StringAlignment]::Center

        $ticks = @(
            @{ Y = 90;  Num = "5" },
            @{ Y = 120; Num = "4" },
            @{ Y = 150; Num = "3" },
            @{ Y = 180; Num = "2" },
            @{ Y = 210; Num = "1" }
        )
        foreach ($t in $ticks) {
            $g.DrawLine($tickPen, 227, [int]$t.Y, 237, [int]$t.Y)
            $g.DrawString($t.Num, $fontTick, $tickBrush, 201.0, [float]$t.Y, $sfR)
        }

        # 2. O Vulcãozinho Amigável Central (x=305..520, y=75..295)
        # Halos de resfriamento e calma ao redor do cume
        $auraPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(90, 148, 210, 189), 2.5)
        $auraPen.DashStyle = [System.Drawing.Drawing2D.DashStyle]::Dash
        $g.DrawEllipse($auraPen, 320, 50, 180, 80)
        $g.DrawEllipse($auraPen, 295, 35, 230, 110)

        # Encosta do Vulcão (Polígono em Trapézio Arredondado)
        [System.Drawing.PointF[]]$volcanoPts = @(
            (New-Object System.Drawing.PointF(355, 120)),
            (New-Object System.Drawing.PointF(465, 120)),
            (New-Object System.Drawing.PointF(535, 285)),
            (New-Object System.Drawing.PointF(285, 285))
        )
        $volcanoBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
            (New-Object System.Drawing.PointF(410, 120)),
            (New-Object System.Drawing.PointF(410, 285)),
            [System.Drawing.Color]::FromArgb(255, 180, 83, 9),
            [System.Drawing.Color]::FromArgb(255, 15, 118, 110)
        )
        $volcanoPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 254, 243, 199), 3.5)
        $g.FillPolygon($volcanoBrush, $volcanoPts)
        $g.DrawPolygon($volcanoPen, $volcanoPts)

        # Cratera Suave e Calma no topo (com água cristalina e estrelinhas)
        $craterBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 13, 148, 136))
        $craterInner = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 56, 189, 248))
        $craterPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 255, 255, 255), 2.5)
        $g.FillEllipse($craterBrush, 355, 105, 110, 32)
        $g.DrawEllipse($craterPen, 355, 105, 110, 32)
        $g.FillEllipse($craterInner, 370, 111, 80, 20)

        # Fumacinha de Calma e Cristais subindo da cratera
        $steamBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(180, 224, 242, 254))
        $g.FillEllipse($steamBrush, 395, 78, 30, 26)
        $g.FillEllipse($steamBrush, 412, 60, 26, 22)
        $g.FillEllipse($steamBrush, 385, 52, 22, 18)

        # Rosto Amigável do Vulcãozinho (Olhos Brilhantes e Sorriso Sereno)
        $eyeWhite = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
        $eyeDark  = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 15, 23, 42))
        $blushPink = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(160, 251, 113, 133))

        # Olho esquerdo
        $g.FillEllipse($eyeWhite, 370, 172, 24, 24)
        $g.FillEllipse($eyeDark, 377, 176, 14, 14)
        $g.FillEllipse($eyeWhite, 380, 178, 6, 6)
        # Olho direito
        $g.FillEllipse($eyeWhite, 426, 172, 24, 24)
        $g.FillEllipse($eyeDark, 433, 176, 14, 14)
        $g.FillEllipse($eyeWhite, 436, 178, 6, 6)

        # Bochechinhas coradas de quem está respirando fundo
        $g.FillEllipse($blushPink, 356, 195, 18, 12)
        $g.FillEllipse($blushPink, 446, 195, 18, 12)

        # Sorriso sereno
        $mouthPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 15, 23, 42), 3.5)
        $g.DrawArc($mouthPen, 392, 192, 36, 26, 20, 140)

        # Plantinhas floridas crescendo na base do vulcão resfriado
        $leafBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 34, 197, 94))
        $flowerBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 244, 114, 182))
        $g.FillEllipse($leafBrush, 320, 268, 22, 12)
        $g.FillEllipse($flowerBrush, 326, 262, 14, 14)
        $g.FillEllipse($leafBrush, 480, 268, 22, 12)
        $g.FillEllipse($flowerBrush, 484, 262, 14, 14)

        # 3. Kit de Resfriamento Vagal à Direita (x=545..710, y=65..280)
        # Cartão Flutuante do Kit de Calma
        $kitCardBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(240, 240, 253, 250))
        $kitBorderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 148, 210, 189), 3)
        $g.FillRectangle($kitCardBrush, 555, 68, 150, 210)
        $g.DrawRectangle($kitBorderPen, 555, 68, 150, 210)

        # Título do Kit
        $fontKit = New-Object System.Drawing.Font("Segoe UI", 9.5, [System.Drawing.FontStyle]::Bold)
        $fontItem = New-Object System.Drawing.Font("Segoe UI", 8.5, [System.Drawing.FontStyle]::Bold)
        $textDark = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 15, 23, 42))
        $textTeal = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 13, 148, 136))
        $sfC = New-Object System.Drawing.StringFormat
        $sfC.Alignment = [System.Drawing.StringAlignment]::Center

        $g.DrawString("KIT RESFRIAMENTO", $fontKit, $textTeal, 630.0, 78.0, $sfC)

        # Item 1: Cristais de Gelo / Respiração Geladinha (x=570, y=108)
        $iceBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 56, 189, 248))
        $icePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 14, 165, 233), 2.5)
        $g.DrawLine($icePen, 580, 112, 596, 128)
        $g.DrawLine($icePen, 596, 112, 580, 128)
        $g.DrawLine($icePen, 588, 108, 588, 132)
        $g.FillEllipse($iceBrush, 584, 116, 8, 8)
        $sfL = New-Object System.Drawing.StringFormat
        $sfL.Alignment = [System.Drawing.StringAlignment]::Near
        $sfL.LineAlignment = [System.Drawing.StringAlignment]::Center
        $g.DrawString("Vento do Gelo 4s", $fontItem, $textDark, 608.0, 120.0, $sfL)

        # Item 2: Copo d'Água Fresca (x=572, y=152)
        $glassPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 2, 132, 199), 2)
        $waterBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(200, 56, 189, 248))
        $g.FillRectangle($waterBrush, 582, 158, 16, 16)
        $g.DrawRectangle($glassPen, 580, 152, 20, 24)
        $g.DrawString("Água Fresca", $fontItem, $textDark, 608.0, 164.0, $sfL)

        # Item 3: Estrela do Mar Relaxada (Soltar os punhos) (x=572, y=198)
        $starBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 251, 146, 60))
        $starPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 234, 88, 12), 2)
        $g.FillEllipse($starBrush, 580, 196, 20, 20)
        $g.DrawEllipse($starPen, 580, 196, 20, 20)
        $g.DrawString("Mãos Estrela", $fontItem, $textDark, 608.0, 206.0, $sfL)

        # Selo de Mestre da Calma no rodapé do kit
        $badgeCalmBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 16, 185, 129))
        $g.FillRectangle($badgeCalmBrush, 570, 240, 120, 24)
        $fontBadgeSmall = New-Object System.Drawing.Font("Segoe UI", 7.8, [System.Drawing.FontStyle]::Bold)
        $whiteText = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
        $g.DrawString("AUTORREGULAÇÃO", $fontBadgeSmall, $whiteText, 630.0, 252.0, $sfC)

        # Limpeza de recursos gráficos
        $thermoFrameBrush.Dispose()
        $thermoBorderPen.Dispose()
        $glassTubeBrush.Dispose()
        $levelCalm.Dispose()
        $levelWarm.Dispose()
        $levelHot.Dispose()
        $tickPen.Dispose()
        $fontTick.Dispose()
        $tickBrush.Dispose()
        $sfR.Dispose()
        $auraPen.Dispose()
        $volcanoBrush.Dispose()
        $volcanoPen.Dispose()
        $craterBrush.Dispose()
        $craterInner.Dispose()
        $craterPen.Dispose()
        $steamBrush.Dispose()
        $eyeWhite.Dispose()
        $eyeDark.Dispose()
        $blushPink.Dispose()
        $mouthPen.Dispose()
        $leafBrush.Dispose()
        $flowerBrush.Dispose()
        $kitCardBrush.Dispose()
        $kitBorderPen.Dispose()
        $fontKit.Dispose()
        $fontItem.Dispose()
        $textDark.Dispose()
        $textTeal.Dispose()
        $sfC.Dispose()
        $iceBrush.Dispose()
        $icePen.Dispose()
        $sfL.Dispose()
        $glassPen.Dispose()
        $waterBrush.Dispose()
        $starBrush.Dispose()
        $starPen.Dispose()
        $badgeCalmBrush.Dispose()
        $fontBadgeSmall.Dispose()
        $whiteText.Dispose()
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
