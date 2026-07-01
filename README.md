### Stop reading terminal errors.

##### Understand them.



# WTFKit



##### Stop guessing why your terminal broke.



When a command fails, most developers do the same thing:



1\.	Copy the error

2\.	Google it

3\.	Open six Stack Overflow tabs

4\.	Try random fixes

5\.	Accidentally make it worse



##### **WTFKit skips that entire process.**



It reads your recent terminal failure and answers three simple questions:



###### •	wtf → What broke?



###### •	why → Why did it happen?



###### •	fix → How do I fix it safely?



No searching.

No AI prompt engineering.

No guessing.





## Example



You run:



$npm install



It ***explodes.***



Instead of scrolling through 400 lines of logs:



###### **$wtf**



❌ npm install failed



###### *Likely causes*



###### *HIGH*

*• node\_modules locked by another process*



###### *HIGH*

*• Corporate proxy / network timeout*



###### *MEDIUM*

*• Node version mismatch*



###### *MEDIUM*

*• Antivirus blocked file writes*



Then:



###### **$why**



*Failure timeline*



*1. package-lock.json updated*

*2. node.exe still running*

*3. npm attempted write*

*4. Windows returned EBUSY*



*Root cause*



*Locked files caused by an active Node process.*





Then:



###### **$fix**



*Recommended fixes*

*SAFE*

*$taskkill /F /IM node.exe*

*SAFE*

*$Remove-Item -Recurse -Force node\_modules*

*SAFE*

*$npm install*





###### **Done.**







##### **Why this exists**



Windows developers waste an absurd amount of time fighting terminal errors that aren’t actually difficult—they’re just poorly explained.



Things like:



•	EPERM

•	EBUSY

•	ENOENT

•	PowerShell execution policy errors

•	PATH issues

•	npm install failures

•	locked files

•	Node processes left running

•	permission errors



###### The terminal usually tells you ***what*** failed, but rarely ***why***<i>.</i>

###### 



###### WTFKit bridges that gap.





##### Installation



For the full program:



Snpm install -g wtf



For ***JUST*** the wtfkit command:



$npm install -g wtfkit



###### **I recommend installing both.**



Restart your terminal, and WTFkit should be **GOOD TO GO!**



Works in:

&#x09;•	PowerShell

&#x09;•	Windows Terminal

&#x09;•	CMD (basic support)







### Usage



Run these immediately after a failed command.



##### **#wtf**



Shows the most likely causes.



##### **$why**



Explains what happened step by step.



##### **$fix**



Suggests the safest repair commands for Windows.





### Example workflow



$git pull



$npm install



$npm run dev



###### ***Oops.***



It returns the error ***EPERM***



##### **Instead of opening your browser:**



###### **$wtf**



###### **$why**



###### **$fix**



And you're back to coding!





### Current focus



WTFKit currently specializes in **Windows development environments**.



###### **Supported today:**



•	npm

•	Node.js

•	PowerShell

•	Windows Terminal

•	CMD

•	process detection

•	file lock detection

•	common Windows filesystem failures

###### **(JUST ADDED 2026-06-30 7:33pmCST)**

•	Go

•	pnpm

•	yarn

•	Bun

•	Git diagnostics

•	Docker

•	Python

•	Rust

•	Flutter





###### **Coming next:**



•	WSL

•	Git Bash





#### Philosophy



Good developer tools answer questions *quickly*.



The three questions every terminal failure creates are:



###### What broke?



###### Why did it break?



###### How do I fix it?



**That’s the entire interface.**





Repository

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





### Contributing (SEE CONTRIBUTING.md)

Bug reports, ideas, heuristics, and Windows edge cases are all welcome.

If you’ve ever stared at an error message thinking:

“What the hell does that mean?”

…you’re exactly the kind of developer this project is for.





License

MIT

# 

