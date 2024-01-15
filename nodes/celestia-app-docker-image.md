---
sidebar_label: Docker images
description: Running Celestia App using Docker.
---

# 🐳 Docker setup

This documentation provides a step by step guide on how to start up a celestia app using a docker image. Docker provides a seamless setup for the celestia app in an isolated environment on your machine. With Docker, you do not have to worry about the manual configuration of the required dependencies, which can be a pain.

# Overview of celestia app txsim
The Celestia app txsim binary is a tool that can be used to simulate transactions on the Celestia network. The txsim Docker image is designed to run the txsim binary with a variety of configurable options. 

## Prerequisites
- [Docker Desktop for Mac or Windows](https://docs.docker.com/get-docker) and a basic
  understanding of Docker
- [Docker Engine for Linux](https://docs.docker.com/engine/install/) and a
  basic understanding of Docker
- A prefunded account set up with the keyring stored in a file to be accessed by an instance of the docker image.

## Quick Start
1. In your local machine, navigate to the home directory
   ```bash [linux or unix OS]
   cd $HOME
   ```
2. Create a file in which the keyring would be stored. The file will be mounted as a volume into the docker container.
   ```bash [linux or unix OS]
   Home/ touch .celestia-app
   ```
3. Using a suitable text editor of your choice, open the .celestial-app file and paste the keyring of the prefunded account.
   
5. We recommend that you set the necessary file permission for the .celestial-app file. A simple read access is all that is required for the docker container to access the content of the file.
   
7. You can run the txsim Docker image using the docker run command below.
   ```bash [linux or unix OS}
   docker run -it -v $HOME/.celestia-app:/home/celestia ghcr.io/celestiaorg/txsim -k 0 -r http://consensus-validator-robusta-rc6.celestia-robusta.com:26657,http://consensus-full-robusta-rc6.celestia-robusta.com:26657 -g consensus-validator-robusta-rc6.celestia-robusta.com:9090 -t 10s -b 10 -d 100 -e 10
   ```
8. In this command, the -v option is used to mount the $HOME/.celestia-app directory from the host to the /home/celestia directory in the Docker container. This allows the txsim binary to access the keyring for the prefunded account.
