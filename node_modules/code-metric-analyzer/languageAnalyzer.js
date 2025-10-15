import fs from "fs"
import path from "path"
import scanDirectory from "node-recursive-directory"

const LANGUAGES_FILE = "languages.txt"
const MB = 1024 ** 2
const DEFAULT_LANGUAGES = ['js', 'jsx', 'ts', 'tsx', 'html', 'css', 'json', 'md', 'py', 'java']

export async function analyzeLanguageDistribution(directoryPath) {
  try {
    console.log("\nAnalyzing programming languages...")

    const supportedLanguages = loadSupportedLanguages()
    const allFiles = await scanDirectory(directoryPath)
    const languageSizes = calculateLanguageSizes(allFiles, supportedLanguages)

    displayResults(languageSizes)

  } catch (error) {
    console.error(`Language analysis failed: ${error.message}`)
  }
}

export function loadSupportedLanguages() {
  const configPath = path.join(process.cwd(), LANGUAGES_FILE)

  if (fs.existsSync(configPath)) {
    return fs.readFileSync(configPath, "utf-8")
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(line => line)
  }

  console.warn(`${LANGUAGES_FILE} not found. Using defaults.`)
  fs.writeFileSync(configPath, DEFAULT_LANGUAGES.join('\n'), 'utf-8')
  return DEFAULT_LANGUAGES
}

export function calculateLanguageSizes(files, supportedLanguages) {
  const sizes = {}

  for (const filePath of files) {
    const extension = getFileExtension(filePath)

    if (supportedLanguages.includes(extension)) {
      const sizeInMB = getFileSizeInMB(filePath)
      sizes[extension] = (sizes[extension] || 0) + sizeInMB
    }
  }

  return sizes
}

export function getDefaultLanguages() {
  return [...DEFAULT_LANGUAGES]
}

function getFileExtension(filePath) {
  return filePath.split('.').pop().toLowerCase()
}

function getFileSizeInMB(filePath) {
  return fs.statSync(filePath).size / MB
}

function displayResults(languageSizes) {
  if (Object.keys(languageSizes).length === 0) {
    console.log("No supported files found")
    return
  }

  const totalSize = Object.values(languageSizes).reduce((sum, size) => sum + size, 0)

  console.log("\n=== Language Distribution ===")
  console.log(`Total analyzed: ${totalSize.toFixed(2)} MB\n`)

  Object.entries(languageSizes)
    .map(([lang, size]) => [lang, ((size / totalSize) * 100).toFixed(2)])
    .sort((a, b) => parseFloat(b[1]) - parseFloat(a[1]))
    .forEach(([lang, percent]) => {
      console.log(`${lang.padEnd(10)} ${percent}%`)
    })
}