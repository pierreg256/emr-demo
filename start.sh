#!/bin/bash

set -e

aws emr --region eu-west-1 run-job-flow --name "Wikipedia Streaming" --instances file:/instances.json --bootstrap-actions file:./bootstrap.json --steps file:./steps.json --log-uri "s3://pgt-misc/iscool/log"