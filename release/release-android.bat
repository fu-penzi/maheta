set %KEY_ALIAS%=%1
set %STOREPASS%=%2

set APK_DIRNAME="app\build\outputs\apk\release"
set BUILD_TOOLS="C:\Users\Fupenzi\AppData\Local\Android\Sdk\build-tools\32.0.0"
set KEYSTORE="keystore.jks"

call cd ..\android
call del /Q "..\release\android\*"
call del /Q "%APK_DIRNAME%\*"
call ./gradlew assembleRelease
call jarsigner -keystore "..\%KEYSTORE%" -storepass %STOREPASS% %APK_DIRNAME%/app-release-unsigned.apk %KEY_ALIAS%
call %BUILD_TOOLS%\zipalign.exe  4 %APK_DIRNAME%/app-release-unsigned.apk %APK_DIRNAME%/app-release.apk
call copy "%APK_DIRNAME%\app-release.apk" "..\release\android\app-release_v%3.apk"
