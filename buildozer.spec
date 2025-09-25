[app]
# Basic app info
title = Sarah Johnson Portfolio
package.name = portfolioapp
package.domain = com.sarahjohnson

# Source
source.dir = .
source.include_exts = py,png,jpg,kv,atlas

# Version
version = 1.0

# Requirements - added clock for responsive features
requirements = python3,kivy

# Main file
source.main = main.py

# App icon (optional - add if you have one)
# icon.filename = %(source.dir)s/icon.png

# Presplash (optional - add if you have one)
# presplash.filename = %(source.dir)s/presplash.png

# Permissions for mobile features
android.permissions = INTERNET, WRITE_EXTERNAL_STORAGE, ACCESS_NETWORK_STATE

# Android specific
[android]
# Orientation - perfect for auto-rotation
orientation = all

# API levels for better compatibility
api = 31
minapi = 21
ndk = 25b

# Architecture support
archs = arm64-v8a, armeabi-v7a

# Enable hardware acceleration for smooth animations
android.gradle_dependencies = 

# App theme (optional)
android.theme = "@android:style/Theme.NoTitleBar"

# Fullscreen mode (0 = windowed, 1 = fullscreen)
fullscreen = 0

[buildozer]
# Build directory
buildozer_dir = .buildozer

# Log level (2 = DEBUG for troubleshooting, 1 = INFO for normal use)
log_level = 1

# Warn on root
warn_on_root = 1

# Auto accept Android SDK licenses
android.accept_sdk_license = True

# Build optimization
android.release_artifact = apk