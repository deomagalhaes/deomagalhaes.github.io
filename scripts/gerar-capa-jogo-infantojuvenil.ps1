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
