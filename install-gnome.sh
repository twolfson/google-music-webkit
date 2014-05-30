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
applications_dir="$HOME/.local/share/applications"
mkdir -p "$applications_dir"
cat > "$applications_dir/google-music-webkit.desktop" <<EOF
[Desktop Entry]
Version=1.0
Type=Application
Terminal=false
Exec=nw $install_dir/
Icon[en_US]=$install_dir/lib/icon.png
Name[en_US]=Google Music Webkit
Icon=$install_dir/lib/icon.png
Name=Google Music Webkit
Comment=Open Google Music Webkit
EOF

# Notify user of completion
echo "Google Music Webkit successfully installed!"
