# Code Metric Analyzer
A small **JavaScript module** for analyzing programming language distribution in Git repositories. This library lets developers clone 
repositories and calculate language statistics based on file sizes.

## Features
* Clone any public Git repository automatically
* Analyze language distribution by file size (MB)
* Support for 27+ programming languages
* Configurable language detection via `languages.txt`
* Works on Windows, macOS, and Linux
* Clean up temporary files automatically

## Installation
Clone the repository and install dependencies:

```bash
git clone https://github.com/ArazAhmet/L2-1dv610.git
cd L2-1dv610
npm install
```

Your project must have Git installed and accessible in PATH.

## Usage Example
```javascript
import { analyzeRepository } from './codeMetric.js'

// Analyze default repository
await analyzeRepository()

// Analyze specific repository
await analyzeRepository('https://github.com/ArazAhmet/L2-1dv610.git')
```

Output:

```
=== Language Distribution ===
Total analyzed: 0.02 MB

md         46.82%
js         28.57%
json       24.61%
```

## API Overview

### codeMetric.js
| Method | Description |
|--------|-------------|
| `analyzeRepository(url, options)` | Clone and analyze a Git repository |
| `cloneRepository(url)` | Clone a repository without analysis |
| `removeDirectory(path)` | Remove a directory recursively |
| `getCloneDirectory()` | Get the path to clone directory |

### languageAnalyzer.js
| Method | Description |
|--------|-------------|
| `analyzeLanguageDistribution(path)` | Analyze language distribution in directory |
| `loadSupportedLanguages()` | Load supported languages from config |
| `calculateLanguageSizes(files, languages)` | Calculate file sizes per language |
| `getDefaultLanguages()` | Get default language list |

## Configuration
Create or edit `languages.txt` to customize supported languages:
```text
js
ts
py
java
html
css
```

## Supported Languages
js, jsx, ts, tsx, html, css, scss, sass, json, md, py, java, c, cpp, cs, php, rb, go, rs, swift, kt, xml, yaml, yml, sql, sh, bash

## Development & Testing
Run the analyzer:

```bash
npm start

node codeMetric.js
```

See `testrapport.md` for detailed test report.

## Dependencies
* `node-recursive-directory` (^1.2.3) - For recursive directory scanning

## Limitations
* Analyzes file size, not lines of code
* Large repositories (>1GB) may take time
* Requires Git installed on system

## Documentation
* `reflektion.md`: Reflections on Clean Code (chapters 2 & 3)
* `testrapport.md`: Test strategy and results

## License
MIT License

## Author
Araz Ahmet - [GitHub](https://github.com/ArazAhmet)