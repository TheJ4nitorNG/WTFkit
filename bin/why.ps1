#!/usr/bin/env pwsh
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
node "$scriptDir\..\src\cli\why.js" @args