# Use the official Node.js image as a base
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:0-14

# Install additional packages or dependencies if needed
RUN apt-get update && apt-get install -y \
    curl \
    git \
    # Add other packages you need, like for testing, etc.
    && rm -rf /var/lib/apt/lists/*

# Set up workspace and default command
WORKDIR /workspace
