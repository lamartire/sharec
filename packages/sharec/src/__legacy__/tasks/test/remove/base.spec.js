const { fixtures } = require('testUtils')
const { vol } = require('memfs')
const remove = require('../../remove')

describe('tasks > remove >', () => {
  const packageJsonBaseRemoveFxt = fixtures(
    'package/json/04-base-remove',
    'json',
  )
  const babelListedValuesFxt = fixtures('babel/json/04-listed-values', 'json')
  const eslintParserOptionsOperationsFxt = fixtures(
    'eslint/json/02-parser-options-operations',
    'json',
  )
  const eslintParserOptionsOperationsFxtYaml = fixtures(
    'eslint/yaml/02-parser-options-operations',
  )

  beforeEach(() => {
    vol.reset()
  })

  it('should remove configuration from the target project and delete all empty', async () => {
    expect.assertions(3)

    const dir = {
      '/target/package.json': JSON.stringify(packageJsonBaseRemoveFxt.result),
      '/target/.eslintrc': JSON.stringify(
        eslintParserOptionsOperationsFxt.result,
      ),
      '/target/.babelrc': JSON.stringify(babelListedValuesFxt.result),
      '/configuration-package/configs/package.json': JSON.stringify(
        packageJsonBaseRemoveFxt.upcoming,
      ),
      '/configuration-package/configs/.eslintrc': JSON.stringify(
        eslintParserOptionsOperationsFxt.upcoming,
      ),
      '/configuration-package/configs/.babelrc': JSON.stringify(
        babelListedValuesFxt.upcoming,
      ),
    }
    vol.fromJSON(dir)

    await remove({
      targetPath: '/target',
      configsPath: '/configuration-package',
    })

    expect(JSON.parse(vol.readFileSync('/target/package.json'))).toEqual(
      packageJsonBaseRemoveFxt.restored,
    )
    expect(JSON.parse(vol.readFileSync('/target/.eslintrc', 'utf8'))).toEqual(
      eslintParserOptionsOperationsFxt.restored,
    )
    expect(JSON.parse(vol.readFileSync('/target/.babelrc'))).toEqual(
      babelListedValuesFxt.restored,
    )
  })

  it('should remove configuration from package.json in the target project', async () => {
    expect.assertions(1)

    const dir = {
      '/target/package.json': JSON.stringify(packageJsonBaseRemoveFxt.result),
      '/configuration-package/configs/package.json': JSON.stringify(
        packageJsonBaseRemoveFxt.upcoming,
      ),
    }
    vol.fromJSON(dir)

    await remove({
      targetPath: '/target',
      configsPath: '/configuration-package',
    })

    expect(JSON.parse(vol.readFileSync('/target/package.json'))).toEqual(
      packageJsonBaseRemoveFxt.restored,
    )
  })

  it('should remove configuration from all files in the target project', async () => {
    expect.assertions(3)

    const dir = {
      '/target/package.json': JSON.stringify(packageJsonBaseRemoveFxt.result),
      '/target/.eslintrc.yml': eslintParserOptionsOperationsFxtYaml.result,
      '/target/.babelrc': JSON.stringify(babelListedValuesFxt.result),
      '/configuration-package/configs/package.json': JSON.stringify(
        packageJsonBaseRemoveFxt.upcoming,
      ),
      '/configuration-package/configs/.eslintrc.yml':
        eslintParserOptionsOperationsFxtYaml.upcoming,
      '/configuration-package/configs/.babelrc': JSON.stringify(
        babelListedValuesFxt.upcoming,
      ),
    }
    vol.fromJSON(dir)

    await remove({
      targetPath: '/target',
      configsPath: '/configuration-package',
    })

    expect(vol.readFileSync('/target/.eslintrc.yml', 'utf8')).toWraplessEqual(
      eslintParserOptionsOperationsFxtYaml.restored,
    )
    expect(JSON.parse(vol.readFileSync('/target/.babelrc'))).toEqual(
      babelListedValuesFxt.restored,
    )
    expect(JSON.parse(vol.readFileSync('/target/package.json'))).toEqual(
      packageJsonBaseRemoveFxt.restored,
    )
  })
})
