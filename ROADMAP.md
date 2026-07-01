# **Roadmap**


The long-term development roadmap for WTFKit.
---


WTFKit is being built in iterative milestones. Each release expands diagnostic coverage while keeping the core philosophy simple:
---


What broke? Why did it happen? How do I fix it?

---







#### **Current Status:**


~~v0.1 — Foundation~~
---


~~Goals~~


~~•	CLI framework
•	PowerShell history reader
•	wtf
•	why
•	fix~~


~~Supported~~


~~•	Windows
•	PowerShell
•	Windows Terminal
•	CMD (basic)
•	Node.js
•	npm~~








###### ~~v0.2 — Windows Diagnostics~~


~~Focus on common Windows development failures.~~


~~Planned~~


~~•	EPERM
•	EBUSY
•	ENOENT
•	Access Denied
•	PATH issues
•	Execution Policy
•	npm ERR parsing
•	Node version mismatch
•	Missing dependencies
•	File lock detection~~








###### ~~v0.3 — Environment Intelligence~~


~~Move beyond parsing terminal output.~~


~~New Collectors~~


~~•	Running processes
•	Environment variables
•	PATH inspection
•	Installed Node versions
•	npm configuration
•	Filesystem inspection~~


~~Goal~~


~~Diagnose problems using system context instead of error text alone.~~








###### ~~v0.4 — Timeline Engine~~


~~Introduce event reconstruction.~~


~~Example:~~


~~npm started~~

~~↓~~

~~package-lock updated~~

~~↓~~

~~node.exe locked file~~

~~↓~~

~~Windows denied write~~

~~↓~~

~~npm aborted~~


~~This release focuses on explaining how failures occurred.~~








###### ~~v0.5 — Plugin System~~


~~Make WTFKit extensible.~~


~~Initial plugin targets:~~


~~•	Git
•	pnpm
•	Yarn
•	Bun
•	Docker
•	Python
•	Rust
•	Go~~


~~Each plugin will provide:~~


~~•	detection rules
•	explanations
•	repair strategies~~








###### ~~v0.6 — Doctor Mode~~


~~Add proactive diagnostics.~~


~~$doctor~~


~~Checks include:~~


~~•	Node
•	npm
•	Git
•	PATH
•	PowerShell
•	Defender
•	Execution Policy
•	Internet connectivity
•	Proxy configuration
•	Permissions~~


~~Output:
System Health~~

~~✔ Node~~

~~✔ npm~~

~~⚠ PATH duplicated~~

~~✔ Git~~



~~Overall~~

~~92/100~~








###### ~~v0.7 — Offline Knowledge Base~~


~~Move diagnostic rules into structured data.~~


~~Example:~~


~~database/~~

~~errors.json~~

~~windows.json~~

~~npm.json~~

~~git.json~~


~~Benefits:~~


~~•	easier updates
•	community rule contributions
•	language localization
•	versioned rule packs~~








###### ~~v0.8 — Log Analysis~~


~~Support debugging outside shell history.~~


~~Examples:~~


~~wtf build.log~~

~~wtf install.log~~

~~wtf --paste~~


~~Supported inputs:~~


~~•	log files
•	stack traces
•	compiler output
•	CI/CD logs~~








###### ~~v0.9 — Cross-Platform~~


~~Expand beyond Windows.~~


~~Planned support:~~


~~•	WSL
•	Git Bash
•	Linux
•	macOS
•	zsh
•	bash
•	fish~~








###### ~~v1.0 — Stable Release~~


~~Goals:~~


~~•	Stable Windows support
•	Plugin ecosystem
•	Offline rule database
•	Timeline reconstruction
•	Confidence scoring
•	Doctor mode
•	Extensive documentation
•	Automated testing
•	Community contributions~~








###### Future Ideas


Potential long-term features:


•	AI-assisted diagnostics (optional)
•	VS Code extension
•	Cursor integration
•	GitHub Actions annotations
•	Interactive repair mode
•	Telemetry-free analytics
•	Crash report bundles
•	Machine-readable JSON output
•	HTML diagnostic reports
•	Web dashboard








###### Guiding Principles


Every feature should improve at least one of these questions:


•	What broke?
•	Why did it happen?
•	How do I fix it?


If it doesn’t help answer one of those questions, it probably doesn’t belong in WTFKit.

