const { InternalError, CAUSES } = require('../../errors')
const isAlreadyInstalled = require('../isAlreadyInstalled')

describe('steps > isAlreadyInstalled', () => {
  it('should just return given input if upcoming config is not installed', () => {
    const input = {
      targetPath: '/configs',
      targetPackage: {
        sharec: {
          config: 'awesome-config',
          version: '0.0.0',
        },
      },
      upcomingPackage: {
        name: 'awesome-config',
        version: '1.0.0',
      },
    }
    const output = isAlreadyInstalled(input)

    expect(output).toEqual(output)
  })

  it('should throw an error upcoming config is already installed', () => {
    const input = {
      targetPath: '/configs',
      targetPackage: {
        sharec: {
          config: 'awesome-config',
          version: '0.0.0',
        },
      },
      upcomingPackage: {
        name: 'awesome-config',
        version: '0.0.0',
      },
    }

    try {
      isAlreadyInstalled(input)
    } catch (err) {
      expect(err).toBeInstanceOf(InternalError)
      expect(err.cause).toBe(CAUSES.ALREADY_INSTALLED.symbol)
    }
  })
})
