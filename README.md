Stop reading terminal errors.
Understand them.

WTFKit
Stop guessing why your terminal broke.
When a command fails, most developers do the same thing:
	1.	Copy the error
	2.	Google it
	3.	Open six Stack Overflow tabs
	4.	Try random fixes
	5.	Accidentally make it worse

WTFKit skips that entire process.
It reads your recent terminal failure and answers three simple questions:
	•	wtf → What broke?
	•	why → Why did it happen?
	•	fix → How do I fix it safely?
No searching.
No AI prompt engineering.
No guessing.
 ⸻
 Example
You run:
npm install
It explodes.
Instead of scrolling through 400 lines of logs:
wtf
❌ npm install failed

Likely causes

HIGH
• node_modules locked by another process

HIGH
• Corporate proxy / network timeout

MEDIUM
• Node version mismatch

MEDIUM
• Antivirus blocked file writes
Then:
why

Failure timeline

1. package-lock.json updated
2. node.exe still running
3. npm attempted write
4. Windows returned EBUSY

Root cause

Locked files caused by an active Node process.
Then:
fix

Recommended fixes

SAFE
taskkill /F /IM node.exe

SAFE
Remove-Item -Recurse -Force node_modules

SAFE
npm install
Done.
 ⸻
 Why this exists
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
The terminal usually tells you what failed, but rarely why.
WTFKit bridges that gap. 
⸻
 Installation
npm install -g wtfkit
Works in:
	•	PowerShell
	•	Windows Terminal
	•	CMD (basic support)
 
⸻
 
Usage
Run these immediately after a failed command.
wtf
Shows the most likely causes.
why
Explains what happened step by step.
fix
Suggests the safest repair commands for Windows.
 
⸻
 
Example workflow
git pull

npm install

npm run dev
Oops.
EPERM
Instead of opening your browser:
wtf
why
fix
Back to coding.
 
⸻
 
Current focus
WTFKit currently specializes in Windows development environments.
Supported today:
	•	npm
	•	Node.js
	•	PowerShell
	•	Windows Terminal
	•	CMD
	•	process detection
	•	file lock detection
	•	common Windows filesystem failures
Coming next:
	•	WSL
	•	Git Bash
	•	pnpm
	•	yarn
	•	Bun
	•	Git diagnostics
	•	Docker
	•	Python
	•	Rust
	•	Go
	•	custom plugins
 
⸻
 
Philosophy
Good developer tools answer questions quickly.
The three questions every terminal failure creates are:
What broke?
Why did it break?
How do I fix it?
That’s the entire interface.
 
⸻
 
Repository
wtfkit/
│
├── bin/
│   ├── wtf.cmd
│   ├── why.cmd
│   └── fix.cmd
│
├── src/
│   ├── cli/
│   ├── core/
│   │   └── windows/
│   │       ├── history.ps1.js
│   │       ├── process.win.js
│   │       └── locks.win.js
│   │
│   └── heuristics/
│       ├── npm.windows.js
│       └── powershell.js
│
├── examples/
├── README.md
├── package.json
└── LICENSE
 
⸻
 
Contributing
Bug reports, ideas, heuristics, and Windows edge cases are all welcome.
If you’ve ever stared at an error message thinking:
“What the hell does that mean?”
…you’re exactly the kind of developer this project is for.
 
⸻
 
License
MIT
 
⸻
 
Stop reading terminal errors.
Understand them.
