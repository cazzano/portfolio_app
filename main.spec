# -*- mode: python ; coding: utf-8 -*-
from kivy_deps import sdl2, glew
import os

# Path to your main Python file
main_script = 'main.py'

# Additional data files and directories to include
# Add your .kv files, images, sounds, etc. here
datas = [
    # Example: ('assets', 'assets'),  # (source, destination)
    # Example: ('*.kv', '.'),         # Include all .kv files
]

# Hidden imports that PyInstaller might miss
hiddenimports = [
    'kivy.core.window.window_sdl2',
    'kivy.core.image.img_pygame',
    'kivy.core.image.img_pil',
    'kivy.core.text.text_pango',
    'kivy.core.audio.audio_pygame',
    'kivy.core.camera.camera_opencv',
    'kivy.clock',
    'kivy.cache',
    'kivy.atlas',
    'win32timezone',  # For Windows
]

# Analysis configuration
a = Analysis(
    [main_script],
    pathex=[],
    binaries=[],
    datas=datas,
    hiddenimports=hiddenimports,
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    noarchive=False,
    optimize=0,
)

# Remove duplicate files
pyz = PYZ(a.pure, a.zipped_data, cipher=None)

# Executable configuration
exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name='main',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    console=False,  # Set to True if you want console window
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
    icon=None,  # Path to your .ico file: 'assets/icon.ico'
)

# Create distribution directory
coll = COLLECT(
    exe,
    a.binaries,
    a.zipfiles,
    a.datas,
    *[Tree(p) for p in (sdl2.dep_bins + glew.dep_bins)],
    strip=False,
    upx=True,
    upx_exclude=[],
    name='main',
)

# Uncomment below for one-file executable (slower startup but single file)
# exe = EXE(
#     pyz,
#     a.scripts,
#     a.binaries,
#     a.zipfiles,
#     a.datas,
#     *[Tree(p) for p in (sdl2.dep_bins + glew.dep_bins)],
#     [],
#     name='main',
#     debug=False,
#     bootloader_ignore_signals=False,
#     strip=False,
#     upx=True,
#     upx_exclude=[],
#     runtime_tmpdir=None,
#     console=False,
#     disable_windowed_traceback=False,
#     argv_emulation=False,
#     target_arch=None,
#     codesign_identity=None,
#     entitlements_file=None,
#     icon=None,
# )