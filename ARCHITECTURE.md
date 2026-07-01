# Architecture



## Internal design of the WTFKit debugging engine.



## Philosophy



WTFKit is built as a diagnostic pipeline, not a collection of error-message regexes.



Every command flows through the same stages:



**Terminal Failure
│
▼
History Collector
│
▼
Context Collectors
│
▼
Rule Engine
│
▼
Confidence Scoring
│
▼
Timeline Builder
│
▼
Repair Planner
│
▼
CLI Output**
---



Each stage has a single responsibility and can evolve independently.



#### Core Pipeline



1. ###### History Collection



Responsible for reconstructing the failed command.


**Collects:**
---


•	command
•	exit code
•	stdout
•	stderr
•	working directory
•	timestamp


**Example:**
---


{
"command": "npm install",
"exitCode": 1,
"stderr": "...",
"cwd": "C:\\Projects\\app"
}





2. ###### **Context Collection**



The rule engine should ***never*** rely only on error text.


Collectors inspect the environment.


**Process Collector**
---


Detects:
---


•	running Node processes
•	Electron
•	Vite
•	hung npm
•	background Git


**Filesystem Collector**
---


Reads:
---


•	package.json
•	package-lock.json
•	node\_modules


Detects:
---


•	locks
•	missing files
•	permission failures


**Environment Collector**
---


Reads:
---


•	PATH
•	NODE\_PATH
•	npm configuration
•	PowerShell version



###### **Rule Engine**


The rule engine matches evidence against known diagnostic rules.


Example:
---


{
"match":"EBUSY",
"conditions":\[
"node\_running",
"windows"
],
"cause":"File Lock",
"confidence":0.95
}


**Multiple rules may match simultaneously.**
---







###### **Confidence Engine**


Every diagnosis receives a *confidence score*.


Example:
---


96%


File Lock



88%


Permission Issue



44%


Proxy Problem


**The highest-confidence diagnosis becomes the primary explanation.**







##### Timeline Builder


Instead of showing only the final error, WTFKit reconstructs the sequence of events.


Example:
---


npm started

↓

package-lock updated

↓

node.exe writing

↓

Windows denied access

↓

npm aborted


**This explains why the failure happened rather than only what failed.**





##### **Repair Planner**


Every diagnosis maps to one or more repair strategies.
Repairs are ranked by risk.


**SAFE**
---

Restart Node



###### **SAFE**

Delete node\_modules



###### **CAUTION**

Change Execution Policy



###### **ADVANCED**

Registry modifications


The CLI should ***always*** recommend the least disruptive solution **first**.







##### **Plugin System**


Future analyzers are loaded as plugins.


plugins/

&#x09;npm/
	git/
	python/
	docker/
	rust/
	go/
	bun/
	pnpm/


Each plugin exports:

---

&#x09;detect()
	explain()
	repair()







##### **Design Principles**


•	***Offline first
•	Fast execution
•	Deterministic diagnostics
•	Human-readable explanations
•	Safe-by-default repairs
•	Extensible plugin architecture
•	Cross-platform roadmap***

