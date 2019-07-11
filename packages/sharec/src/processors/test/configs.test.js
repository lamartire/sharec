const path = require('path')
const { readFileSync } = require.requireActual('fs')
const { vol } = require('memfs')
const { processConfig, removeConfig } = require('../configs')

describe('processors > configs >', () => {
  const eslint01 = require('fixtures/eslint/json/eslintrc_01.json')
  const eslint02 = require('fixtures/eslint/json/eslintrc_02.json')
  const eslint04 = require('fixtures/eslint/json/eslintrc_04.json')
  const eslint05 = require('fixtures/eslint/json/eslintrc_05.json')
  const yamlEslint01 = readFileSync(
    path.resolve(
      __dirname,
      '../../../test/fixtures/eslint/yaml/eslintrc_01.yml',
    ),
    'utf8',
  )
  const yamlEslint02 = readFileSync(
    path.resolve(
      __dirname,
      '../../../test/fixtures/eslint/yaml/eslintrc_02.yml',
    ),
    'utf8',
  )
  const yamlEslint04 = readFileSync(
    path.resolve(
      __dirname,
      '../../../test/fixtures/eslint/yaml/eslintrc_04.yml',
    ),
    'utf8',
  )
  const yamlEslint05 = readFileSync(
    path.resolve(
      __dirname,
      '../../../test/fixtures/eslint/yaml/eslintrc_05.yml',
    ),
    'utf8',
  )

  beforeEach(() => {
    vol.reset()
  })

  describe('processConfig', () => {
    it('should merge JSON configs', async () => {
      expect.assertions(1)

      const dir = {
        '/target/.eslintrc': JSON.stringify(eslint01),
        '/configs/.eslintrc': JSON.stringify(eslint02),
      }
      vol.fromJSON(dir, '/')

      await processConfig({
        configsPath: '/configs',
        targetPath: '/target',
        filePath: '.eslintrc',
      })

      const res = await vol.readFileSync('/target/.eslintrc', 'utf8')

      expect(JSON.parse(res)).toMatchSnapshot()
    })

    it('should merge YAML configs', async () => {
      expect.assertions(1)

      const dir = {
        '/target/.eslintrc.yaml': yamlEslint01,
        '/configs/.eslintrc.yaml': yamlEslint02,
      }
      vol.fromJSON(dir, '/')

      await processConfig({
        configsPath: '/configs',
        targetPath: '/target',
        filePath: '.eslintrc.yaml',
      })

      const res = await vol.readFileSync('/target/.eslintrc.yaml', 'utf8')

      expect(res).toMatchSnapshot()
    })

    it('should copy all non-mergeable configs', async () => {
      expect.assertions(1)

      const dir = {
        '/configs/.editorconfig': 'bar',
      }
      vol.fromJSON(dir, '/')

      await processConfig({
        configsPath: '/configs',
        targetPath: '/target',
        filePath: '.editorconfig',
      })

      const res = await vol.readFileSync('/target/.editorconfig', 'utf8')

      expect(res).toEqual('bar')
    })

    it('should correctly process configs with mixed file structure', async () => {
      expect.assertions(1)

      const dir = {
        '/configs/foo/bar/.editorconfig': 'bar',
      }
      vol.fromJSON(dir, '/')

      await processConfig({
        configsPath: '/configs',
        targetPath: '/target',
        filePath: 'foo/bar/.editorconfig',
      })

      const res = await vol.readFileSync(
        '/target/foo/bar/.editorconfig',
        'utf8',
      )

      expect(res).toEqual('bar')
    })
  })

  describe('removeConfig', () => {
    it('should remove configs from exist JSON file', async () => {
      expect.assertions(1)

      const dir = {
        '/target/.eslintrc': JSON.stringify(eslint04),
        '/configuration-package/.eslintrc': JSON.stringify(eslint05),
      }

      vol.fromJSON(dir)

      await removeConfig({
        configsPath: '/configuration-package',
        targetPath: '/target',
        filePath: '.eslintrc',
      })

      expect(
        JSON.parse(vol.readFileSync('/target/.eslintrc', 'utf8')),
      ).toMatchSnapshot()
    })

    it('should remove configs from exist YAML file', async () => {
      expect.assertions(1)

      const dir = {
        '/target/.eslintrc.yaml': yamlEslint04,
        '/configuration-package/.eslintrc.yaml': yamlEslint05,
      }

      vol.fromJSON(dir)

      await removeConfig({
        configsPath: '/configuration-package',
        targetPath: '/target',
        filePath: '.eslintrc.yaml',
      })

      expect(
        vol.readFileSync('/target/.eslintrc.yaml', 'utf8'),
      ).toMatchSnapshot()
    })

    it('should delete exist JSON config file if target file was not changed', async () => {
      expect.assertions(1)

      const dir = {
        '/target/.eslintrc': JSON.stringify(eslint04),
        '/configuration-package/.eslintrc': JSON.stringify(eslint04),
      }

      vol.fromJSON(dir)

      await removeConfig({
        configsPath: '/configuration-package',
        targetPath: '/target',
        filePath: '.eslintrc',
      })

      expect(vol.readdirSync('/target')).not.toContain('.eslintrc')
    })
  })
})