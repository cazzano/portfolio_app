[app]

# Basic app info
title = My Kivy App
package.name = mykivyapp
package.domain = com.example

# Source
source.dir = .
source.include_exts = py,png,jpg,kv,atlas

# Version
version = 1.0
version.regex = __version__ = ['"](.+)['"]
version.filename = %(source.dir)s/main.py

# Requirements
requirements = python3,kivy

# Main file
source.main = main.py

[buildozer]

# Build directory
buildozer_dir = .buildozer

# Log level (0 = ERROR, 1 = INFO, 2 = DEBUG)
log_level = 1

# Warn on root
warn_on_root = 1