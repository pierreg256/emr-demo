#!/usr/bin/env node
var spawn = require('child_process').spawn;

var instances = { 
   "Ec2KeyName": "id_rsa",
    "InstanceGroups": [
        {
            "Name": "Master Instance Group",
            "InstanceRole": "MASTER",
            "InstanceType": "cc2.8xlarge",
            "InstanceCount": 1,
            "Market": "ON_DEMAND"
        },
        {
            "Name": "Core Instance Group",
            "InstanceRole": "CORE",
            "InstanceType": "m1.medium",
            "InstanceCount": 300,
            "Market": "ON_DEMAND"
        }
    ],
    "KeepJobFlowAliveWhenNoSteps": false,
    "TerminationProtected": false
};
var tag=new Date();
tag=""+tag.getFullYear()+'-'+tag.getMonth()+'-'+tag.getDate()+'.'+tag.getHours()+'.'+tag.getMinutes()+'.'+tag.getSeconds();
var steps=[
	{
        "Name": "Setup Hadoop Debugging",
        "ActionOnFailure": "TERMINATE_JOB_FLOW",
        "HadoopJarStep": {
            "Args": [
                "s3://eu-west-1.elasticmapreduce/libs/state-pusher/0.1/fetch"
            ],
            "Jar": "s3://eu-west-1.elasticmapreduce/libs/script-runner/script-runner.jar"
        }
    },
    {
        "Name": "Wikipedia Streaming Step",
        "ActionOnFailure": "CANCEL_AND_WAIT",
        "HadoopJarStep": {
            "Jar": "/home/hadoop/contrib/streaming/hadoop-streaming.jar",
            "Args": [
                "-input",
                "s3://bigdatablogdemo/wikipedia/wikistats/pagecounts",
                "-output",
                "s3://pgt-bigdata-demo/out-"+tag,
                "-mapper",
                "s3://pgt-bigdata-demo/code/mapper.js",
                "-reducer",
                "s3://pgt-bigdata-demo/code/reducer.js"
            ]
        }
    }
];

var bootstrapActions=[
	{
		"ScriptBootstrapAction": {
	      		"Path": "s3://elasticmapreduce/samples/node/install-node-bin-x86.sh",
	      		"Args": []
	    	},
	  		"Name": "Install Node"
	}
];
var params=[
	'emr',
	'--region', 'eu-west-1',
	'run-job-flow',
	'--ami-version', '2.4.2',
	'--name',  '"Wikipedia Streaming"',
	'--instances',  JSON.stringify(instances), 
	'--bootstrap-actions', JSON.stringify(bootstrapActions),
	'--steps', JSON.stringify(steps),
	'--log-uri', 's3://pgt-bigdata-demo/logs' 
]

var command = spawn('aws', params)

command.stdout.on('data', function (data) {    // register one or more handlers
  console.log('stdout: ' + data);
});

command.stderr.on('data', function (data) {
  console.log('stderr: ' + data);
});

command.on('exit', function (code) {
  console.log('child process exited with code ' + code);
});

