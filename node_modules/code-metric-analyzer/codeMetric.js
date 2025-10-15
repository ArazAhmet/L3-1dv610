import { exec } from "child_process"
import { promisify } from "util"
import fs from "fs"
import path from "path"
import { fileURLToPath } from 'url'
import { analyzeLanguageDistribution } from "./languageAnalyzer.js"

const executeCommand = promisify(exec)
const CLONE_DIR = "./cloned-repository"
const DEFAULT_REPO = "https://github.com/ArazAhmet/Uppgift_2_Webbteknik.git"
const isWindows = process.platform === 'win32'

export async function analyzeRepository(repositoryUrl = DEFAULT_REPO, options = {}) {
  try {
    logAnalysisStart(repositoryUrl)

    const repoPath = await prepareRepository(repositoryUrl)

    await performAnalysis(repositoryUrl, repoPath)

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

async function cleanupIfNeeded(options) {
  if (!options.keepFiles) {
    await removeDirectory(CLONE_DIR)
  }
}

function logAnalysisComplete() {
  console.log("\nAnalysis completed successfully!")
}

function handleAnalysisError(error) {
  console.error(`Analysis failed: ${error.message}`)

  if (isGitError(error)) {
    logGitErrorHelp()
  }
}

function isGitError(error) {
  return error.message.includes('git')
}

function logGitErrorHelp() {
  console.error("Check: Git installed? Repository accessible? Internet connection?")
}

export async function cloneRepository(url) {
  console.log("Downloading repository...")

  await removeDirectory(CLONE_DIR)
  await createDirectory(CLONE_DIR)

  const cloneCmd = buildCloneCommand(url)
  await executeCommand(cloneCmd)

  console.log("Repository downloaded successfully")
}

function buildCloneCommand(url) {
  return isWindows
    ? `cd /d "${CLONE_DIR}" && git clone ${url}`
    : `cd ${CLONE_DIR} && git clone ${url}`
}

function findRepositoryPath() {
  const contents = fs.readdirSync(CLONE_DIR)
  const directories = filterRepositoryDirectories(contents)

  if (directories.length === 0) {
    return CLONE_DIR
  }

  return buildRepositoryPath(directories[0])
}

function filterRepositoryDirectories(contents) {
  return contents.filter(item =>
    isDirectory(item) && !isHidden(item)
  )
}

function isDirectory(item) {
  return fs.statSync(path.join(CLONE_DIR, item)).isDirectory()
}

function isHidden(item) {
  return item.startsWith('.')
}

function buildRepositoryPath(dirName) {
  const repoPath = path.join(CLONE_DIR, dirName)
  console.log(`Found repository at: ${repoPath}`)
  return repoPath
}

async function createDirectory(dirPath) {
  try {
    const cmd = buildMkdirCommand(dirPath)
    await executeCommand(cmd)
  } catch {
    createDirectoryFallback(dirPath)
  }
}

function buildMkdirCommand(dirPath) {
  return isWindows ? `mkdir "${dirPath}"` : `mkdir -p ${dirPath}`
}

function createDirectoryFallback(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true })
}

export async function removeDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    return
  }

  try {
    const cmd = buildRemoveCommand(dirPath)
    await executeCommand(cmd)
  } catch {
    removeDirectoryFallback(dirPath)
  }
}

function buildRemoveCommand(dirPath) {
  return isWindows ? `rmdir /s /q "${dirPath}"` : `rm -rf ${dirPath}`
}

function removeDirectoryFallback(dirPath) {
  fs.rmSync(dirPath, { recursive: true, force: true })
}

export function getCloneDirectory() {
  return CLONE_DIR
}

function displayHeader(url) {
  const separator = "=".repeat(50)
  console.log(`\n${separator}`)
  console.log(`LANGUAGE ANALYSIS: ${url}`)
  console.log(separator)
}

const __filename = fileURLToPath(import.meta.url)
if (process.argv[1] === __filename) {
  await analyzeRepository()
}