const { vol } = require('memfs')
const { installPackageJson, injectMetaData } = require('../install')

describe('core > package > install >', () => {
  const packageJson01 = require('fixtures/package/package_01.json')
  const packageJson02 = require('fixtures/package/package_02.json')
  const packageJsonFixture = require('fixtures/package/package_07.json')

  beforeEach(() => {
    vol.reset()
  })

  describe('installPackageJson', () => {
    it('should merge exist package.json with upcoming from configs', async () => {
      expect.assertions(1)

      const dir = {
        '/target/package.json': JSON.stringify(packageJson01, null, 2),
        '/configs/package.json': JSON.stringify(packageJson02, null, 2),
      }
      vol.fromJSON(dir, '/')

      await installPackageJson({
        configsPath: '/configs',
        targetPath: '/target',
        configsVersion: '1.0.0',
      })

      expect(
        JSON.parse(vol.readFileSync('/target/package.json', 'utf8')),
      ).toMatchSnapshot()
    })
  })

  describe('injectMetaData', () => {
    it('should inject sharec meta-data', () => {
      const metaData = {
        injected: true,
      }
      const res = injectMetaData(metaData)(packageJsonFixture)

      expect(res).toEqual({
        ...packageJsonFixture,
        sharec: metaData,
      })
    })
  })
})
