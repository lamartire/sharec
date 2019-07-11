const path = require('path')
const { pipe } = require('../utils')
const { readFile, writeFile } = require('../utils/fs')
const {
  extractDependencies,
  extractConfigs,
  extractMetaData,
  injectConfigs,
  injectDependencies,
  injectMetaData,
  ereaseConfigs,
  ereaseDependencies,
  ereaseMetaData,
} = require('../core/package')

const getCurrentPackageJsonMetaData = async targetPath => {
  const targetPackageJsonPath = path.resolve(targetPath, 'package.json')
  const rawTargetPackageJson = await readFile(targetPackageJsonPath, 'utf8')
  const targetPackageJson = JSON.parse(rawTargetPackageJson)

  return extractMetaData(targetPackageJson)
}

const processPackageJson = async (configsPath, targetPath) => {
  const targetPackageJsonPath = path.resolve(targetPath, 'package.json')
  const rawTargetPackageJson = await readFile(targetPackageJsonPath)
  const targetPackageJson = JSON.parse(rawTargetPackageJson)
  let newPackageJson = { ...targetPackageJson }

  try {
    const packageJsonPath = path.resolve(configsPath, 'package.json')
    const rawPackageJson = await readFile(packageJsonPath, 'utf8')
    const packageJson = JSON.parse(rawPackageJson)
    const newDependencies = extractDependencies(packageJson)
    const newConfigs = extractConfigs(packageJson)

    newPackageJson = pipe(
      injectConfigs(newConfigs),
      injectDependencies(newDependencies),
      injectMetaData({
        injected: true,
      }),
    )(targetPackageJson)
  } catch (err) {
    newPackageJson = pipe(
      injectMetaData({
        injected: true,
      }),
    )(targetPackageJson)
  }

  await writeFile(
    targetPackageJsonPath,
    JSON.stringify(newPackageJson, null, 2),
    'utf8',
  )
}

const clearPackageJson = async (configsPath, targetPath) => {
  const targetPackageJsonPath = path.resolve(targetPath, 'package.json')
  const rawTargetPackageJson = await readFile(targetPackageJsonPath)
  const targetPackageJson = JSON.parse(rawTargetPackageJson)

  try {
    const packageJsonPath = path.resolve(configsPath, 'package.json')
    const rawPackageJson = await readFile(packageJsonPath, 'utf8')
    const packageJson = JSON.parse(rawPackageJson)
    const newDependencies = extractDependencies(packageJson)
    const newConfigs = extractConfigs(packageJson)
    const restoredPackageJson = pipe(
      ereaseConfigs(newConfigs),
      ereaseMetaData,
    )(targetPackageJson)
    const [
      restoredPackageJsonWithoutDependencies,
      modifiedDeps,
    ] = ereaseDependencies(newDependencies)(restoredPackageJson)

    await writeFile(
      targetPackageJsonPath,
      JSON.stringify(restoredPackageJsonWithoutDependencies, null, 2),
      'utf8',
    )

    return modifiedDeps
  } catch (err) {
    const restoredPackageJson = pipe(ereaseMetaData)(targetPackageJson)

    await writeFile(
      targetPackageJsonPath,
      JSON.stringify(restoredPackageJson, null, 2),
      'utf8',
    )

    return null
  }
}

module.exports = {
  getCurrentPackageJsonMetaData,
  processPackageJson,
  clearPackageJson,
}