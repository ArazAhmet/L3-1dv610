# Reflection

## Naming (Chapter 2)
| Name | Explanation | Reflection |
|------|-------------|------------|
| `analyzeRepository` | Main public function | Uses a verb ("analyze") that clearly shows what happens. Better than just `repository()` which would be unclear. |
| `cloneRepository` | Public function | Uses domain language from Git ("clone"). Developers know this term. Better than `downloadRepo` which is less specific. |
| `CLONE_DIR` | Constant for directory path | Uppercase shows it is a constant. Could be `CLONED_REPOSITORY_DIRECTORY` but that is too long and breaks simplicity. |
| `calculateLanguageSizes` | Public function | Very clear verb + object pattern. Shows exactly what it does. Could be shorter like `calcSizes` but that would be less readable. |
| `isWindows` | Boolean variable | Uses `is` prefix for booleans. Makes it obvious the value is true/false. Good practice for boolean naming. |

## Chapter 2 Reflection
I use clear intention-revealing names like `analyzeRepository` and `cloneRepository`. This makes the code easy to understand. A weakness is inconsistency: sometimes I use `path` and sometimes `dirPath`. Should pick one pattern and stick to it. After refactoring, I added helper
functions with names like `logAnalysisStart`, `prepareRepository`, and `isGitError` which are very clear about their purpose.

## Functions (Chapter 3)
| Method | Lines | Reflection |
|--------|-------|------------|
| `displayResults` | 15 | Mixes formatting and printing. Could split into `formatResults` and `printResults` for better separation. |
| `loadSupportedLanguages` | 12 | Does multiple things: checks file, reads OR creates file, returns data. Side effect not clear from name. Should be `loadOrCreateSupportedLanguages`. |
| `analyzeRepository` | 11 | Much better after refactoring! Now delegates to helper functions like `prepareRepository`, `performAnalysis`, and `cleanupIfNeeded`. Each helper does one thing. |
| `calculateLanguageSizes` | 11 | Good example: does one thing (calculate sizes). Single level of abstraction. Easy to understand. |
| `removeDirectory` | 11 | Clear purpose but mixes checking existence with actual removal. Platform-specific commands handled well. |

## Example: Refactoring to "Do One Thing"

**Before:** `analyzeRepository` did everything

```javascript
export async function analyzeRepository(url, options) {
  try {
    console.log("Starting Language Analyzer...")
    console.log(`Repository: ${url}`)

    await cloneRepository(url)
    const repoPath = findRepositoryPath()

    displayHeader(url)
    await analyzeLanguageDistribution(repoPath)

    if (!options.keepFiles) await removeDirectory(CLONE_DIR)
    console.log("\nAnalysis completed successfully!")
  } catch (error) {
    console.error(`Analysis failed: ${error.message}`)
    if (error.message.includes('git')) {
      console.error("Check: Git installed? Repository accessible? Internet connection?")
    }
  }
}
```

**After:** Split into clear, single-purpose functions

```javascript
export async function analyzeRepository(url = DEFAULT_REPO, options = {}) {
  try {
    logAnalysisStart(url)
    const repoPath = await prepareRepository(url)
    await performAnalysis(url, repoPath)
    await cleanupIfNeeded(options)
    logAnalysisComplete()
  } catch (error) {
    handleAnalysisError(error)
  }
}

function logAnalysisStart(url) {
  console.log("Starting Language Analyzer...")
  console.log(`Repository: ${url}`)
}

async function prepareRepository(url) {
  await cloneRepository(url)
  return findRepositoryPath()
}

async function performAnalysis(url, repoPath) {
  displayHeader(url)
  await analyzeLanguageDistribution(repoPath)
}
```

**Why:** Each function now does one thing at one level of abstraction. The main function reads like a table of contents. Much easier to test and understand.

## Chapter 3 Reflection
I refactored my code to follow "Do One Thing" better. Initially, `analyzeRepository` mixed logging, cloning, analyzing, and cleanup. After splitting it into helper functions, the code became much more readable. Each function like `logAnalysisStart`, `prepareRepository`, and
`handleAnalysisError` has a clear single purpose.

I also extracted helpers like `isGitError`, `buildCloneCommand`, `filterRepositoryDirectories`, and `buildRepositoryPath`. This made functions shorter and kept each at one abstraction level. The book's advice about small functions makes sense now - it forces clear thinking about
what each piece does.

## Personal Reflection
Refactoring taught me that first drafts are rarely clean. My initial code worked but mixed abstraction levels and did too much per function. After applying Clean Code principles, the code communicates much better. Functions like `isGitError` and `logAnalysisStart` are so clear
they need no comments.

Good parts: self-documenting function names, consistent async/await, proper error handling, single responsibility. Bad parts: some functions still have hidden side effects (`cloneRepository` removes old directory first), could split `displayResults` further.

Next time I will think about single responsibility from the start, not just in refactoring. Clean Code is about making code easy for the next person (including future me) to understand.