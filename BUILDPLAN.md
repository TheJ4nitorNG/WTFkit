# WTFKit — Scaffolded Build Plan





## A roadmap for building the WTFKit Command Line Debug Suite from MVP to a production-ready debugging platform.

#### 

#### 

#### 

#### Vision



WTFKit is a command-line debugging assistant that answers three questions after any terminal failure:



•	wtf → **What broke?**
•	why → **Why did it happen?**
•	fix → **How do I fix it?**



The goal is to ***eliminate*** the “copy error → Google → Stack Overflow → random fixes” workflow and replace it with fast, local, actionable diagnostics.







##### Project Structure



wtfkit/




│
├── bin/
│   ├── doctor.cmd
│   ├── doctor.ps1
│   ├── fix.cmd

│   ├── fix.ps1

│   ├── why.cmd

│   ├── why.ps1

│   ├── wtf.cmd

│   ├── wtf.ps1

│   ├── wtfkit.cmd

│   ├── wtfkit.ps1

│   ├── wtfkit-install.cmd

│   └── wtfkit-install.ps1
│

├── database/

│   ├── bun.json

│   ├── docker.json

│   ├── fallback.json

│   ├── git.json

│   ├── go.json

│   ├── npm.json

│   ├── pnpm.json

│   ├── python.json

│   ├── rust.json

│   ├── windows.json

│   └── yarn.json

│

│
├── src/

│   ├── analyzers/

│   │   └──engine.js

│   │
│   ├── cli/
│   │   ├── auto.js
│   │   ├── doctor.js
│   │   ├── fix.js
│   │   ├── index.js

│   │   ├── install.js

│   │   ├── shared.js

│   │   ├── why.js

│   │   └── wtf.js

│   │
│   ├── collectors/
│   │   ├── env.js
│   │   ├── filesystem.js
│   │   ├── history.js
│   │   ├── path.js
│   │   └── processes.js

│   │
│   ├── core/
│   │	└──windows/
│   │
│   ├── explain/
│   │   └── confidence.js
│   │
│   ├── history/
│   │   ├── cmdl.js
│   │   ├── parser.js
│   │   └── powershell.js

│   │
│   ├── output/
│   │   ├── colors.js
│   │   ├── formatter.js
│   │   └── tables.js
│   │

│   ├── plugins/

│   │   ├── bun/

│   │   │   └── index.js

│   │	├── docker/

│   │   │   └── index.js

│   │	├── fallback/

│   │   │   └── index.js

│   │	├── git/

│   │   │   └── index.js

│   │	├── go/

│   │   │   └── index.js

│   │	├── npm/

│   │   │   └── index.js

│   │	├── pnpm/

│   │   │   └── index.js

│   │	├── python/

│   │   │   └── index.js

│   │	├── rust/

│   │   │   └── index.js

│   │	├── windows/

│   │   │   └── index.js

│   │	├── yarn/

│   │   │   └── index.js

│   │   └──registry.js

│   │

│   ├── repair/

│   │   └── planner.js

│   │
│   └── shared/
│       ├── constants.js
│       ├── logger.js

│       ├── ruleParser.js
│       └── utils.js
│
├── tests/

│   ├── explain/

│   └── heuristics/

│
├── .gitignore

├── ARCHITECTURE.md

├── BUILDPLAN.md

├── CONTRIBUTING.md

├── README.md

├── ROADMAP.md

└── package.json







### Phase 1 — MVP



##### Goal:



Solve the most common Windows + Node.js terminal failures.



Target commands:



**$wtf
$why
$fix**





###### History Reader:



Capture the user’s most recent terminal command.



## Responsibilities:



•	Read PowerShell history
•	Read CMD history
•	Capture stdout
•	Capture stderr
•	Capture exit code
•	Record working directory



## Example output:



{
"command": "npm install",
"exitCode": 1,
"stderr": "EBUSY...",
"cwd": "C:\\Projects\\app"
}







###### Heuristic Engine:



Recognize common failures.



**Initial rules:**



**•	EPERM
•	EBUSY
•	ENOENT
•	MODULE\_NOT\_FOUND
•	npm ERR!
•	Execution Policy
•	PATH not recognized
•	Access Denied
•	Node version mismatch**



**Example:**



\[
{
"cause": "File Lock",
"confidence": 0.94
}
]







###### Explain Engine:



Translate technical errors into plain English.



**Example:**



Command:



**$npm install**



What happened:



**Windows refused to overwrite a file.**

**Most likely because another Node process still has it open**.



**Confidence**

**94%**









###### Repair Engine:



Map causes to safe fixes.



**Example:**



{
"fileLock": \[
"taskkill /F /IM node.exe",
"Remove-Item -Recurse -Force node\_modules",
"npm install"
]
}









### **Phase 2 — Context Collection**





Instead of relying solely on error text, gather context from the system.





## Process Collector:



Inspect running processes.



**Examples:**



Get-Process node
Detect:
•	orphan Node processes
•	hung npm installs
•	Electron apps
•	Vite dev servers







###### Environment Collector:



**Inspect:**



•	PATH
•	NODE\_PATH
•	NPM\_CONFIG
•	environment variables



**Detect:**



•	duplicate Node installations
•	broken PATH
•	missing npm
•	corrupted cache







###### Filesystem Collector:



**Inspect:**



•	package.json
•	package-lock.json
•	node\_modules
•	permissions



**Detect:**



•	lock files
•	missing package.json
•	write failures
•	corrupted installs









###### Confidence Scoring



Instead of:



Probably...
Return ranked diagnoses:



**96%
File lock**



**88%
Permission issue**



**42%
Corporate proxy**









### **Phase 3 — Timeline Reconstruction**





The signature feature of WTFKit.



Running:
$why



Produces:
Timeline

12:03:18
npm started

12:03:19
package-lock updated

12:03:20
node.exe writing

12:03:21
Windows denied access

12:03:21
npm aborted

Root Cause

Locked filesystem



Instead of simply reporting the error, ***reconstruct the sequence of events that caused it***.









### **Phase 4 — Plugin Architecture**





Support additional ecosystems through plugins.



plugins/

npm/
git/
python/
docker/
rust/
go/
bun/
pnpm/
yarn/
Plugin interface:
export default {
detect(error, context) {},
explain() {},
fixes() {}
}



This allows contributors to extend WTFKit without modifying the core.









### Phase 5 — Intelligent Repair Ranking



Not every fix should be treated equally.
Rank suggestions by safety.



## **SAFE**

**Restart Node**



###### **SAFE**

**Delete node\_modules**



###### **CAUTION**

**Change execution policy**



###### **ADVANCED**

**Modify Registry**



The safest repair should **always** appear ***first***.









Phase 6 — Offline Knowledge Base



Move diagnostic rules into structured data.



database/

errors.json
windows.json
npm.json
git.json
powershell.json



## Example rule:



*{
"match": "EBUSY",
"cause": "File Lock",
"confidence": 0.95,
"fixes": \[
"taskkill /F /IM node.exe",
"npm install"
]
}*



## Benefits:



•	easier updates
•	community contributions
•	less hardcoded logic
•	versioned rule sets









### **Phase 7 — Doctor Mode**



System diagnostics.



$doctor



## Checks:



•	Node
•	npm
•	Git
•	PATH
•	PowerShell
•	execution policy
•	Windows Defender
•	permissions
•	proxy configuration
•	internet connectivity



## Example:



System Health

✔ Node

✔ npm

⚠ PATH duplicated

✔ Git

⚠ Execution Policy

✔ Internet

Overall Score

92/100









### **Phase 8 — Explain Anything**



## Expand beyond terminal history.



## Examples:



$wtf build.log
$wtf --paste
$wtf "TypeError: Cannot read properties of undefined"



Support:



•	pasted errors
•	log files
•	CI/CD logs
•	stack traces
•	compiler output









### **Phase 9 — Optional AI Assistance**



## The core engine remains deterministic and fully offline.



## Optional mode:



$wtf --ai



## Potential capabilities:



•	summarize long logs
•	explain unfamiliar stack traces
•	identify uncommon failure patterns
•	recommend next debugging steps when rule confidence is low



AI should **enhance** the experience, not **replace** the deterministic rule engine.









### Milestone Roadmap



## Version	Focus	***Deliverable***



v0.1	CLI foundation	wtf, why, fix with PowerShell history
v0.2	Rule engine	npm, Node, PowerShell heuristics
v0.3	Context collection	Processes, PATH, filesystem inspection
v0.4	Timeline engine	Event reconstruction and root cause analysis
v0.5	Plugin system	Git, Python, Docker, Bun, pnpm support
v0.6	Doctor mode	Environment health diagnostics
v1.0	Production release	Stable Windows debugging suite with plugin ecosystem









Long-Term Vision
WTFKit should become the first tool developers run after a terminal failure.
Instead of searching the web, users should be able to type:
wtf
why
fix
…and receive a clear explanation, ranked root causes, and safe repair commands in seconds.
The long-term differentiator is not simply interpreting error messages—it is combining shell history, process state, filesystem inspection, environment diagnostics, and a growing knowledge base into a single, coherent diagnosis that developers can trust.

