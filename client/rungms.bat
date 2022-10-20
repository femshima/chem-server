@echo off

set execpath=%~dp0

node %execpath%/dist/main.cjs %1

type gms.out
