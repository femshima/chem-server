# GAMESS Docker

This folder contains Dockerfile for GAMESS.

## Build

1. Obtain the GAMESS source code and place it under this directory as `gamess-current.tar.gz`.
1. Download OpenBLAS 0.3.23 and place it as `OpenBLAS-0.3.23.tar.gz`.
1. Run `docker build . --progress=plain -t gamess:mpi`. This takes about 30 minutes.

## Execute

1. Generate input file for GAMESS and save it as `job.inp`.
1. Run `docker run --rm -i gamess:mpi 12 < job.inp > job.out` and you will get output file `job.out`.
   (Please change the process count `12` to fit your environment)

## MoleQueue Configuration

```json
{
    "cores": 0,
    "launchScriptName": "MoleQueueLauncher.sh",
    "launchTemplate": "#!/bin/bash\n\n$$programExecution$$\n",
    "programs": {
        "GAMESS-MPI": {
            "arguments": "run --rm -i gamess:mpi $$numberOfCores$$",
            "customLaunchTemplate": "",
            "executable": "docker",
            "launchSyntax": 4,
            "outputFilename": "$$inputFileBaseName$$.out"
        }
    },
    "type": "Local"
}
```
