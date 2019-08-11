const { vol } = require('memfs')
const { fixtures } = require('testUtils')
const { installPackageJson } = require('../../install')

describe('core > package > install > scripts >', () => {
  const packageJsonScriptsFxt = fixtures('package/01-scripts', 'json')

  beforeEach(() => {
    vol.reset()
  })

  it('should correctly merge package.json scripts section', async () => {
    const dir = {
      '/target/package.json': JSON.stringify(packageJsonScriptsFxt.current),
      '/configuration-package/package.json': JSON.stringify(
        packageJsonScriptsFxt.new,
      ),
    }

    vol.fromJSON(dir)

    await installPackageJson({
      configsPath: '/configuration-package',
      configsVersion: '1.0.0',
      targetPath: '/target',
    })

    expect(
      JSON.parse(vol.readFileSync('/target/package.json', 'utf8')),
    ).toEqual(packageJsonScriptsFxt.result)
  })
})
