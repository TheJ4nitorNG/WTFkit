# Contributing




First off, thank you for your interest in contributing to WTFKit.


Whether you’re fixing bugs, improving diagnostics, adding plugins, or improving documentation, every contribution helps make debugging easier for developers.








### Project Philosophy


WTFKit exists to answer **three questions**:


•	What broke?
•	Why did it happen?
•	How do I fix it?


Contributions should make at least one of those answers **clearer**, **faster**, or **more accurate**.








### Ways to Contribute


You can help by:
---


•	Reporting bugs
•	Improving documentation
•	Adding diagnostic rules
•	Creating new analyzers
•	Writing plugins
•	Improving repair strategies
•	Adding tests
•	Optimizing performance
•	Suggesting new features








Development Workflow


1.	Fork the repository.


2.	Create a feature branch.


3.	Make focused changes.


4.	Add or update tests where appropriate.


5.	Open a pull request with a clear description.


Keep pull requests small and focused whenever possible.








Repository Layout
src/
├── analyzers/

├── cli/
├── collectors/

├── core/
├── explain/
├── history/
├── output/

├── plugins
├── repair/
└── shared/
Each directory has a single responsibility.








#### Writing Diagnostic Rules


Good diagnostic rules should:


•	Match a specific failure pattern.
•	Avoid broad assumptions.
•	Include a confidence score.
•	Provide one or more safe repair strategies.


Example:
{
"match": "EBUSY",
"cause": "File Lock",
"confidence": 0.95,
"fixes": \[
"taskkill /F /IM node.exe",
"npm install"
]
}








#### Writing Repairs


Repairs should be:


•	Safe
•	Reversible whenever possible
•	Platform-specific when necessary
•	Ordered from least disruptive to most disruptive


Preferred order:


1.	Restart a process.
2.	Retry the command.
3.	Clear temporary files.
4.	Reinstall dependencies.
5.	Change system configuration.
6.	Advanced system modifications.








#### Plugins


Plugins allow WTFKit to support additional ecosystems without changing the core engine.


Suggested layout:
plugins/

├── bun/

├── docker/

├── fallback/

├── git/

└── go/


Each plugin should expose functions for:


•	detection
•	explanation
•	repair


**Plugins should avoid side effects and return structured diagnostic data.**








#### Code Style


General guidelines:


•	Keep functions small and focused.
•	Prefer pure functions where practical.
•	Avoid unnecessary dependencies.
•	Write descriptive variable names.
•	Keep modules single-purpose.
•	Favor readability over cleverness.








#### Testing


Every new diagnostic rule should include test coverage where possible.


Recommended scenarios:


•	Successful detection
•	False-positive prevention
•	Confidence scoring
•	Suggested repairs
•	Platform-specific edge cases








#### Documentation


Documentation is part of the product.


If you add a new command, analyzer, collector, or plugin, please update the relevant documentation.








#### Reporting Bugs


When opening an issue, include:


•	Operating system
•	Shell (PowerShell, CMD, Bash, etc.)
•	Node version
•	npm version
•	The command you ran
•	The complete error output
•	What you expected to happen


If possible, include a minimal reproduction.








#### Code of Conduct


Be respectful, constructive, and welcoming.


Assume good intent, provide actionable feedback, and remember that everyone starts somewhere.








**Thank You
Every contribution—whether it’s code, documentation, testing, or a single diagnostic rule—helps developers spend less time debugging and more time building.**
---


**Thank you for helping make WTFKit better.**
---





