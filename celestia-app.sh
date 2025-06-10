#!/bin/bash

# ASCII art
echo "          __        __  _                       "
echo " _______ / /__ ___ / /_(_)__ ________ ____  ___ "
echo "/ __/ -_) / -_|_-</ __/ / _ \`/___/ _ \`/ _ \/ _ \\"
echo "\\__/\\__/_/\\__/___/\\__/_/\\_,_/    \\_,_/ .__/ .__/"
echo "                                    /_/  /_/    "
echo ""

# Declare a log file to capture detailed logs and a temp directory
LOGFILE="$HOME/celestia-app-temp/logfile.log"
TEMP_DIR="$HOME/celestia-app-temp"

# Parse command line arguments
while getopts "v:" opt; do
  case $opt in
    v) USER_VERSION="$OPTARG"
    ;;
    \?) echo "Invalid option -$OPTARG" >&2
        echo "Usage: $0 [-v version]"
        echo "Example: $0 -v v0.11.0"
        exit 1
    ;;
  esac
done

# Check if the directory exists
if [ -d "$TEMP_DIR" ]; then
    read -p "Directory $TEMP_DIR exists. Do you want to clear it out? (y/n) " -n 1 -r
    echo    # move to a new line
    if [[ $REPLY =~ ^[Yy]$ ]]
    then
        rm -rf "$TEMP_DIR"
        echo "Directory $TEMP_DIR has been removed."
    fi
fi

# Create a temporary directory to work from
mkdir -p "$TEMP_DIR"
touch "$LOGFILE"

# Log and print the log file location
echo "Log file is located at: $LOGFILE" | tee -a "$LOGFILE"

# Change to $TEMP_DIR and print a message
cd "$TEMP_DIR" || exit 1
echo "Working from temporary directory: $TEMP_DIR" | tee -a "$LOGFILE"

# Set VERSION based on user input or fetch latest
if [ -n "$USER_VERSION" ]; then
  VERSION="$USER_VERSION"
  echo "Using specified version: $VERSION" | tee -a "$LOGFILE"
else
  # Fetch the latest release tag from GitHub
  VERSION=$(curl -s "https://api.github.com/repos/celestiaorg/celestia-app/releases/latest" | grep '"tag_name":' | sed -E 's/.*"([^"]+)".*/\1/')

  # Check if VERSION is empty
  if [ -z "$VERSION" ]; then
      echo "Failed to fetch the latest version. Exiting." | tee -a "$LOGFILE"
      exit 1
  fi
  echo "Using latest version: $VERSION" | tee -a "$LOGFILE"
fi

# Validate version format
if [[ ! $VERSION =~ ^v[0-9]+\.[0-9]+\.[0-9]+ ]]; then
    echo "Invalid version format: $VERSION" | tee -a "$LOGFILE"
    echo "Version should start with vX.X.X (e.g., v3.8.1 or v3.8.1-mocha)" | tee -a "$LOGFILE"
    exit 1
fi

# Detect the operating system and architecture
OS=$(uname -s)
ARCH=$(uname -m)

# Translate architecture to expected format
case $ARCH in
    x86_64)
        ARCH="x86_64"
        ;;
    aarch64|arm64)
        ARCH="arm64"
        ;;
    *)
        echo "Unsupported architecture: $ARCH. Exiting." | tee -a "$LOGFILE"
        exit 1
        ;;
esac

# Translate OS to expected format
case $OS in
    Linux|Darwin)
        ;;
    *)
        echo "Unsupported operating system: $OS. Exiting." | tee -a "$LOGFILE"
        exit 1
        ;;
esac

# Construct the download URL
PLATFORM="${OS}_${ARCH}"
URL="https://github.com/celestiaorg/celestia-app/releases/download/$VERSION/celestia-app_$PLATFORM.tar.gz"

# Check if URL is valid
if [[ ! $URL =~ ^https://github.com/celestiaorg/celestia-app/releases/download/[^/]+/celestia-app_[^/]+.tar.gz$ ]]; then
    echo "Invalid URL: $URL. Exiting." | tee -a "$LOGFILE"
    exit 1
fi

# Log and print a message
echo "Downloading from: $URL" | tee -a "$LOGFILE"

# Download the tarball
if ! curl -L "$URL" -o "celestia-app_$PLATFORM.tar.gz" >> "$LOGFILE" 2>&1; then
    echo "Download failed. Exiting." | tee -a "$LOGFILE"
    exit 1
fi

# Detect if running on macOS and use appropriate command for checksum
if [ "$OS" = "Darwin" ]; then
    CALCULATED_CHECKSUM=$(shasum -a 256 "celestia-app_$PLATFORM.tar.gz" | awk '{print $1}')
else
    CALCULATED_CHECKSUM=$(sha256sum "celestia-app_$PLATFORM.tar.gz" | awk '{print $1}')
fi

# Download checksums.txt
if ! curl -L "https://github.com/celestiaorg/celestia-app/releases/download/$VERSION/checksums.txt" -o "checksums.txt" >> "$LOGFILE" 2>&1; then
    echo "Failed to download checksums. Exiting." | tee -a "$LOGFILE"
    exit 1
fi

# Find the expected checksum in checksums.txt
EXPECTED_CHECKSUM=$(grep "celestia-app_$PLATFORM.tar.gz" checksums.txt | awk '{print $1}')

# Verify the checksum
if [ "$CALCULATED_CHECKSUM" != "$EXPECTED_CHECKSUM" ]; then
    echo "Checksum verification failed. Expected: $EXPECTED_CHECKSUM, but got: $CALCULATED_CHECKSUM. Exiting." | tee -a "$LOGFILE"
    exit 1
else
    echo "Checksum verification successful." | tee -a "$LOGFILE"
fi

# Extract the tarball to the temporary directory
if ! tar -xzf "celestia-app_$PLATFORM.tar.gz" >> "$LOGFILE" 2>&1; then
    echo "Extraction failed. Exiting." | tee -a "$LOGFILE"
    exit 1
fi

# Log and print a message
echo "Binary extracted to: $TEMP_DIR" | tee -a "$LOGFILE"

# Remove the tarball to clean up
rm "celestia-app_$PLATFORM.tar.gz"
rm "checksums.txt"

# Log and print a message
echo "Temporary files cleaned up." | tee -a "$LOGFILE"

# Check if Go is installed
if command -v go >/dev/null 2>&1; then
    GOPATH=${GOPATH:-$(go env GOPATH)}
    GOBIN="$GOPATH/bin"
    HAS_GO=true
else
    HAS_GO=false
fi

# Ask the user where to install the binary
echo ""
if [ "$HAS_GO" = true ]; then
    echo "Where would you like to install the celestia-appd binary?"
    echo "1) Go bin directory ($GOBIN) [Recommended]"
    echo "2) System bin directory (/usr/local/bin)"
    echo "3) Keep in current directory ($TEMP_DIR)"
else
    echo "Go is not installed. Where would you like to install the celestia-appd binary?"
    echo "1) System bin directory (/usr/local/bin) [Recommended]"
    echo "2) Keep in current directory ($TEMP_DIR)"
fi

read -p "Enter your choice: " -n 1 -r
echo    # move to a new line

if [ "$HAS_GO" = true ]; then
    case $REPLY in
        1)
            # Install to GOBIN
            mkdir -p "$GOBIN"
            mv "$TEMP_DIR/celestia-appd" "$GOBIN/"
            chmod +x "$GOBIN/celestia-appd"
            echo "Binary moved to $GOBIN" | tee -a "$LOGFILE"
            # Create a symbolic link in the temporary directory
            ln -s "$GOBIN/celestia-appd" "$TEMP_DIR/celestia-appd"
            echo "Symbolic link created in $TEMP_DIR" | tee -a "$LOGFILE"
            echo ""
            # Check if GOBIN is in PATH
            if [[ ":$PATH:" != *":$GOBIN:"* ]]; then
                echo "NOTE: $GOBIN is not in your PATH. You may want to add it by adding this line to your ~/.bashrc or ~/.zshrc:"
                echo "export PATH=\$PATH:$GOBIN"
                echo ""
            fi
            echo "You can now run celestia-appd from anywhere (if $GOBIN is in your PATH)." | tee -a "$LOGFILE"
            ;;
        2)
            # Install to /usr/local/bin
            sudo mv "$TEMP_DIR/celestia-appd" /usr/local/bin/
            echo "Binary moved to /usr/local/bin" | tee -a "$LOGFILE"
            # Create a symbolic link in the temporary directory
            ln -s /usr/local/bin/celestia-appd "$TEMP_DIR/celestia-appd"
            echo "Symbolic link created in $TEMP_DIR" | tee -a "$LOGFILE"
            echo ""
            echo "You can now run celestia-appd from anywhere." | tee -a "$LOGFILE"
            ;;
        3)
            # Keep in current directory
            chmod +x "$TEMP_DIR/celestia-appd"
            echo "Binary kept in $TEMP_DIR" | tee -a "$LOGFILE"
            echo "You can run celestia-appd from this directory using ./celestia-appd" | tee -a "$LOGFILE"
            ;;
        *)
            echo ""
            echo "Invalid choice. The binary remains in $TEMP_DIR" | tee -a "$LOGFILE"
            chmod +x "$TEMP_DIR/celestia-appd"
            echo "You can run celestia-appd from this directory using ./celestia-appd" | tee -a "$LOGFILE"
            ;;
    esac
else
    case $REPLY in
        1)
            # Install to /usr/local/bin
            sudo mv "$TEMP_DIR/celestia-appd" /usr/local/bin/
            echo "Binary moved to /usr/local/bin" | tee -a "$LOGFILE"
            # Create a symbolic link in the temporary directory
            ln -s /usr/local/bin/celestia-appd "$TEMP_DIR/celestia-appd"
            echo "Symbolic link created in $TEMP_DIR" | tee -a "$LOGFILE"
            echo ""
            echo "You can now run celestia-appd from anywhere." | tee -a "$LOGFILE"
            ;;
        2)
            # Keep in current directory
            chmod +x "$TEMP_DIR/celestia-appd"
            echo "Binary kept in $TEMP_DIR" | tee -a "$LOGFILE"
            echo "You can run celestia-appd from this directory using ./celestia-appd" | tee -a "$LOGFILE"
            ;;
        *)
            echo ""
            echo "Invalid choice. The binary remains in $TEMP_DIR" | tee -a "$LOGFILE"
            chmod +x "$TEMP_DIR/celestia-appd"
            echo "You can run celestia-appd from this directory using ./celestia-appd" | tee -a "$LOGFILE"
            ;;
    esac
fi

echo ""
echo "To check its version and see the menu, execute the following command:" | tee -a "$LOGFILE"
if [ "$HAS_GO" = true ]; then
    case $REPLY in
        1)  # Go bin installation
            echo "celestia-appd version && celestia-appd --help" | tee -a "$LOGFILE"
            ;;
        2)  # System bin installation
            echo "celestia-appd version && celestia-appd --help" | tee -a "$LOGFILE"
            ;;
        3)  # Current directory
            echo "$TEMP_DIR/celestia-appd version && $TEMP_DIR/celestia-appd --help" | tee -a "$LOGFILE"
            ;;
        *)  # Invalid choice (kept in temp dir)
            echo "$TEMP_DIR/celestia-appd version && $TEMP_DIR/celestia-appd --help" | tee -a "$LOGFILE"
            ;;
    esac
else
    case $REPLY in
        1)  # System bin installation
            echo "celestia-appd version && celestia-appd --help" | tee -a "$LOGFILE"
            ;;
        2)  # Current directory
            echo "$TEMP_DIR/celestia-appd version && $TEMP_DIR/celestia-appd --help" | tee -a "$LOGFILE"
            ;;
        *)  # Invalid choice (kept in temp dir)
            echo "$TEMP_DIR/celestia-appd version && $TEMP_DIR/celestia-appd --help" | tee -a "$LOGFILE"
            ;;
    esac
fi
