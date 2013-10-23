#!/bin/bash

cwd=`pwd`

wget http://nodejs.org/dist/v0.10.8/node-v0.10.8-linux-x86.tar.gz
gzip -d node-v0.10.8-linux-x86.tar.gz && tar -xvf node-v0.10.8-linux-x86.tar

echo "export PATH=$cwd/node-v0.10.8-linux-x86/bin:$PATH" >> ~/.bashrc