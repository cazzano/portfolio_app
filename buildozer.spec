[app]
# Basic app info
title = My Kivy App
package.name = mykivyapp
package.domain = com.example

# Source
source.dir = .
source.include_exts = py,png,jpg,kv,atlas

# Version (use either version OR version.regex, not both)
version = 1.0

# Requirements
requirements = python3,kivy

# Main file
source.main = main.py

# Android specific
[android]
# Orientation - set to auto to allow both portrait and landscape
orientation = all

[buildozer]
# Build directory
buildozer_dir = .buildozer

# Log level (0 = ERROR, 1 = INFO, 2 = DEBUG)
log_level = 1

# Warn on root
warn_on_root = 1

# Auto accept Android SDK licenses
android.accept_sdk_license = True