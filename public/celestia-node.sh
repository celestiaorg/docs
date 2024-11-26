#!/bin/bash

# ASCII art
echo "        _        _   _                       _     "
echo " __ ___| |___ __| |_(_)__ _ ___ _ _  ___  __| |___ "
echo "/ _/ -_) / -_|_-<  _| / _\` |___| ' \\/ _ \\/ _\` / -_)"
echo "\\__\\___|_\\___/__/\__|_\\__,_|   |_||_\\___/\\__,_\\___|"
echo "                                                    "

# Declare a log file and a temp directory
LOGFILE="$HOME/celestia-node-temp/logfile.log"
TEMP_DIR="$HOME/celestia-node-temp"

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
    if [[ $REPLY =~ ^[Yy]$ ]]; then
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
    VERSION=$(curl -s "https://api.github.com/repos/celestiaorg/celestia-node/releases/latest" | grep '"tag_name":' | sed -E 's/.*"([^"]+)".*/\1/')
    if [ -z "$VERSION" ]; then
        echo "Failed to fetch the latest version. Exiting." | tee -a "$LOGFILE"
        exit 1
    fi
    echo "Using latest version: $VERSION" | tee -a "$LOGFILE"
fi

# Validate version format
if [[ ! $VERSION =~ ^v[0-9]+\.[0-9]+\.[0-9]+(-.*)?$ ]]; then
    echo "Invalid version format: $VERSION" | tee -a "$LOGFILE"
    echo "Version should be in the format vX.X.X (e.g., v0.11.0)" | tee -a "$LOGFILE"
    exit 1
fi

# Detect the operating system and architecture
OS=$(uname -s)
ARCH=$(uname -m)

# Translate architecture to expected format
case $ARCH in
    x86_64) ARCH="x86_64" ;;
    aarch64|arm64) ARCH="arm64" ;;
    *) echo "Unsupported architecture: $ARCH. Exiting." | tee -a "$LOGFILE"; exit 1 ;;
esac

# Translate OS to expected format
case $OS in
    Linux|Darwin) ;;
    *) echo "Unsupported operating system: $OS. Exiting." | tee -a "$LOGFILE"; exit 1 ;;
esac

# Construct the download URL
PLATFORM="${OS}_${ARCH}"
URL="https://github.com/celestiaorg/celestia-node/releases/download/$VERSION/celestia-node_$PLATFORM.tar.gz"

# Log and download the tarball
echo "Downloading from: $URL" | tee -a "$LOGFILE"
if ! curl -L "$URL" -o "celestia-node_$PLATFORM.tar.gz" >> "$LOGFILE" 2>&1; then
    echo "Download failed. Exiting." | tee -a "$LOGFILE"
    exit 1
fi

# Detect if running on macOS and calculate checksum
if [ "$OS" = "Darwin" ]; then
    CALCULATED_CHECKSUM=$(shasum -a 256 "celestia-node_$PLATFORM.tar.gz" | awk '{print $1}')
else
    CALCULATED_CHECKSUM=$(sha256sum "celestia-node_$PLATFORM.tar.gz" | awk '{print $1}')
fi

# Download checksums.txt
CHECKSUMS_URL="https://github.com/celestiaorg/celestia-node/releases/download/$VERSION/checksums.txt"
echo "Downloading checksums.txt from: $CHECKSUMS_URL" | tee -a "$LOGFILE"
if ! curl -L "$CHECKSUMS_URL" -o "checksums.txt" >> "$LOGFILE" 2>&1; then
    echo "Failed to download checksums. Exiting." | tee -a "$LOGFILE"
    exit 1
fi

# Verify the checksum
EXPECTED_CHECKSUM=$(grep "celestia-node_$PLATFORM.tar.gz" checksums.txt | awk '{print $1}')
if [ "$CALCULATED_CHECKSUM" != "$EXPECTED_CHECKSUM" ]; then
    echo "Checksum verification failed. Expected: $EXPECTED_CHECKSUM, but got: $CALCULATED_CHECKSUM. Exiting." | tee -a "$LOGFILE"
    exit 1
else
    echo "Checksum verification successful." | tee -a "$LOGFILE"
fi

# Extract the tarball
if ! tar -xzf "celestia-node_$PLATFORM.tar.gz" >> "$LOGFILE" 2>&1; then
    echo "Extraction failed. Exiting." | tee -a "$LOGFILE"
    exit 1
fi
echo "Binary extracted to: $TEMP_DIR" | tee -a "$LOGFILE"

# Clean up temporary files
rm "celestia-node_$PLATFORM.tar.gz" "checksums.txt"
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
    echo "Where would you like to install the celestia binary?"
    echo "1) Go bin directory ($GOBIN) [Recommended]"
    echo "2) System bin directory (/usr/local/bin)"
    echo "3) Keep in current directory ($TEMP_DIR)"
else
    echo "Go is not installed. Where would you like to install the celestia binary?"
    echo "1) System bin directory (/usr/local/bin) [Recommended]"
    echo "2) Keep in current directory ($TEMP_DIR)"
fi

read -p "Enter your choice: " -n 1 -r
echo    # move to a new line

if [ "$HAS_GO" = true ]; then
    case $REPLY in
        1)
            mkdir -p "$GOBIN"
            mv "$TEMP_DIR/celestia" "$GOBIN/"
            chmod +x "$GOBIN/celestia"
            echo "Binary moved to $GOBIN" | tee -a "$LOGFILE"
            ;;
        2)
            sudo mv "$TEMP_DIR/celestia" /usr/local/bin/
            echo "Binary moved to /usr/local/bin" | tee -a "$LOGFILE"
            ;;
        3)
            chmod +x "$TEMP_DIR/celestia"
            echo "Binary kept in $TEMP_DIR" | tee -a "$LOGFILE"
            ;;
        *)
            echo "Invalid choice. Exiting." | tee -a "$LOGFILE"
            exit 1
            ;;
    esac
else
    case $REPLY in
        1)
            sudo mv "$TEMP_DIR/celestia" /usr/local/bin/
            echo "Binary moved to /usr/local/bin" | tee -a "$LOGFILE"
            ;;
        2)
            chmod +x "$TEMP_DIR/celestia"
            echo "Binary kept in $TEMP_DIR" | tee -a "$LOGFILE"
            ;;
        *)
            echo "Invalid choice. Exiting." | tee -a "$LOGFILE"
            exit 1
            ;;
    esac
fi

echo "Installation complete. You can now use the celestia binary." | tee -a "$LOGFILE"