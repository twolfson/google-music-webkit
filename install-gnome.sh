#!/usr/bin/env bash
# Set up target directory
install_dir="/usr/local/lib/google-music-webkit"

# If we are not installed via symlink, do so
if ! test -d "$install_dir"; then
  sudo ln -s "$PWD" "$install_dir"
# Otherwise, inform the user of the status
else
  echo "Google Music Webkit already symlinked to /usr/local/lib. Continuing with next steps..." 1>&2
fi

# Overwrite existing Google Music Webkit application
mkdir -p ~/.local/share/applications
cat > ~/.local/share/applications/google-music-webkit.desktop <<EOF
[Desktop Entry]
Version=1.0
Type=Application
Terminal=false
Exec=nw /usr/local/lib/google-music-webkit/index.js
Icon[en_US]=/usr/local/lib/google-music-webkit/lib/icon.png
Name[en_US]=Google Music Webkit
Icon=/usr/local/lib/google-music-webkit/lib/icon.png
Name=Google Music Webkit
Comment=Open Google Music Webkit
EOF

# Notify user of completion
echo "Google Music Webkit successfully installed!"
