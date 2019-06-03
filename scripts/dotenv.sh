#!/bin/bash
#
# Author Maxwell DeVos
# Script for generating a default .env file for the
# project. (Because they are not transfered with git)
version=1.0
set -eu

if [[ $* == --help || $* == -h ]];
then
    echo "Usage: [-f | --force] [-h | --help]"
else
    env_file=.env
    gen=0
    
    if [ -e $env_file ]; then
        gen=1;
    fi
    
    if [[ $* == --force || $* == -f || $gen != 1 ]];
    then
        cat > $env_file <<EOF
#Enviroment Variables for HomeCenter
#generated with script v$version

#Do not commit this file!

#NODE Enviroment
NODE_ENVIROMENT="development"

#Server Port
PORT=8080
DOMAIN="localhost"
TRANSPORT="http"

#Database
DATABASE_URL="<Database connection string>"

#Email
USERNAME="<username>"
PASSWORD="<password>"
FROM="<email from>"

#Hash
HASH_SALT=5

#Session
SECRET="<secret key here>"

# Okta configuration
OKTA_ORG_URL="<your okta domain>"
OKTA_CLIENT_ID="<your okta client id>"
OKTA_CLIENT_SECRET="<your okta client secret>"

EOF
        echo ".env file was generated. Version: $version";
    else
        echo "File $env_file already exists!";
    fi
fi