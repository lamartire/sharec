const path = require('path')
const { readFile } = require('../utils/std').fs

const readUpcomingPackage = spinner => async input => {
  try {
    spinner.frame('reading package.json from upcoming configuration')

    const upcomingPackageJsonPath = path.resolve(
      input.configPath,
      'package.json',
    )
    const rawUpcomingPackageJson = await readFile(
      upcomingPackageJsonPath,
      'utf8',
    )
    const upcomingPackage = JSON.parse(rawUpcomingPackageJson)

    spinner.frame('package.json from upcoming configuration was readed')

    return Object.assign(input, {
      upcomingPackage,
    })
  } catch (err) {
    spinner.fail("Upcoming configuration's package.json was not readed")

    throw err
  }
}

module.exports = readUpcomingPackage
