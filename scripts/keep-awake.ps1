$wscript = New-Object -ComObject Wscript.Shell
while ($true) {
    $wscript.SendKeys('{F15}')
    Start-Sleep -Seconds 60
}
