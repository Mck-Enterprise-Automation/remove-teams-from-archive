#! /bin/bash

ARCHIVE_PATH=$1
DESTINATION_PATH=$2

mkdir tmp_archive
tar -C ./tmp_archive -xzf "${ARCHIVE_PATH}" --exclude "teams_*.json"

~/github/github/remove-teams-from-archive/app.js 

cd ./tmp_archive || fail
tar -zcf new_archive.tar.gz ./*
cd ../ || return
if [[ -z ${DESTINATION_PATH} ]]; then
  mv ./tmp_archive/new_archive.tar.gz "${ARCHIVE_PATH}"
else 
  mv ./tmp_archive/new_archive.tar.gz "${DESTINATION_PATH}"
fi
rm -rf tmp_archive 