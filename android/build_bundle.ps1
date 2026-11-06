$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-21.0.12.101-hotspot"
$env:ANDROID_HOME = "C:\Users\dummy\AppData\Local\Android\Sdk"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"

Write-Host "Java version:"
& "$env:JAVA_HOME\bin\java.exe" -version

Write-Host "Building release bundle with versionCode 6..."
Set-Location "c:\Users\dummy\Documents\Projects\website-yayasan\android"
.\gradlew.bat bundleRelease --no-daemon
