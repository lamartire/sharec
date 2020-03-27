const { fixtures } = require('testUtils')
const Strategy = require('../Strategy')

describe('Strategy', () => {
  const commonBaseFxt = fixtures('common/json/01-base', 'json')
  const commonBaseFxtYaml = fixtures('common/yaml/01-base')
  const commonListsFxt = fixtures('common/json/02-lists', 'json')
  const commonListsFxtYaml = fixtures('common/yaml/02-lists')
  const commonPreventOverwriteFxt = fixtures(
    'common/json/03-prevent-overwrite',
    'json',
  )
  const commonPreventOverwriteFxtYaml = fixtures(
    'common/yaml/03-prevent-overwrite',
  )
  const gitignoreBaseFxt = fixtures('gitignore/lines/01-base')

  let strategy

  beforeEach(() => {
    strategy = new Strategy()
  })

  it('should checks files compatibility', () => {
    const validFiles = [
      'foo.json',
      'bar.json',
      'foo.yaml',
      'bar.yaml',
      'foo.txt',
      'bar.txt',
    ]
    const invalidFiles = [
      'beep.json',
      'boop.json',
      'beep.yaml',
      'boop.yaml',
      'beep.txt',
      'boop.txt',
    ]

    strategy = new Strategy({
      matchers: {
        json: validFiles.slice(0, 2),
        yaml: validFiles.slice(2, 4),
        lines: validFiles.slice(4, 6),
      },
    })

    validFiles.forEach(file => {
      expect(strategy.isExpectedStrategy(file)).toBe(true)
    })
    invalidFiles.forEach(file => {
      expect(strategy.isExpectedStrategy(file)).toBe(false)
    })
  })

  describe('determination', () => {
    it('should determine merge method', () => {
      const mergeJSONMock = Symbol('mergeJSON')
      const mergeYAMLMock = Symbol('mergeYAML')
      const mergeLinesMock = Symbol('mergeLines')

      strategy.mergeJSON = mergeJSONMock
      strategy.mergeYAML = mergeYAMLMock
      strategy.mergeLines = mergeLinesMock

      expect(strategy.determineMergeMethod('example.json')).toBe(mergeJSONMock)
      expect(strategy.determineMergeMethod('example.yaml')).toBe(mergeYAMLMock)
      expect(strategy.determineMergeMethod('example.yml')).toBe(mergeYAMLMock)
      expect(strategy.determineMergeMethod('foo/bar/example.json')).toBe(
        mergeJSONMock,
      )
      expect(strategy.determineMergeMethod('foo/bar/example.yaml')).toBe(
        mergeYAMLMock,
      )
      expect(strategy.determineMergeMethod('foo/bar/example.yml')).toBe(
        mergeYAMLMock,
      )
      expect(strategy.determineMergeMethod('foo/bar/example.txt')).toBe(
        mergeLinesMock,
      )
    })

    it('should determine unapply method', () => {
      const unapplyJSONMock = Symbol('unapplyJSON')
      const unapplyYAMLMock = Symbol('unapplyYAML')
      const unapplyLinesMock = Symbol('unapplyLines')

      strategy.unapplyJSON = unapplyJSONMock
      strategy.unapplyYAML = unapplyYAMLMock
      strategy.unapplyLines = unapplyLinesMock

      expect(strategy.determineUnapplyMethod('example.json')).toBe(
        unapplyJSONMock,
      )
      expect(strategy.determineUnapplyMethod('example.yaml')).toBe(
        unapplyYAMLMock,
      )
      expect(strategy.determineUnapplyMethod('example.yml')).toBe(
        unapplyYAMLMock,
      )
      expect(strategy.determineUnapplyMethod('foo/bar/example.json')).toBe(
        unapplyJSONMock,
      )
      expect(strategy.determineUnapplyMethod('foo/bar/example.yaml')).toBe(
        unapplyYAMLMock,
      )
      expect(strategy.determineUnapplyMethod('foo/bar/example.yml')).toBe(
        unapplyYAMLMock,
      )
      expect(strategy.determineUnapplyMethod('foo/bar/example.txt')).toBe(
        unapplyLinesMock,
      )
    })
  })

  describe('aliasing', () => {
    it('should return filename alias by given filename', () => {
      strategy = new Strategy({
        matchers: {
          lines: ['npmignore'],
        },
        alias: '.npmignore',
      })

      expect(strategy.getAliasedFileName('npmignore')).toEqual('.npmignore')
      expect(strategy.getAliasedFileName('.gitignore')).toEqual('.gitignore')
    })

    it('should return given filename if alias if not defined', () => {
      strategy = new Strategy({
        matchers: {
          lines: ['npmignore'],
        },
      })

      expect(strategy.getAliasedFileName('npmignore')).toEqual('npmignore')
      expect(strategy.getAliasedFileName('.gitignore')).toEqual('.gitignore')
    })
  })

  describe('JSON', () => {
    it('should merge JSON configs', () => {
      expect(
        strategy.mergeJSON({
          current: commonBaseFxt.current,
          upcoming: commonBaseFxt.upcoming,
        }),
      ).toEqual(commonBaseFxt.result)
    })

    it('should merge lists', () => {
      expect(
        strategy.mergeJSON({
          current: commonListsFxt.current,
          upcoming: commonListsFxt.upcoming,
        }),
      ).toEqual(commonListsFxt.result)
    })

    it('should return object without applied properties from second object', () => {
      expect(
        strategy.unapplyJSON({
          current: commonBaseFxt.result,
          upcoming: commonBaseFxt.upcoming,
        }),
      ).toEqual(commonBaseFxt.restored)
    })

    it('should return empty object if objects have not difference', () => {
      expect(
        strategy.unapplyJSON({
          current: commonBaseFxt.result,
          upcoming: commonBaseFxt.result,
        }),
      ).toEqual({})
    })

    it('should unapply lists', () => {
      expect(
        strategy.unapplyJSON({
          current: commonListsFxt.result,
          upcoming: commonListsFxt.upcoming,
        }),
      ).toEqual(commonListsFxt.restored)
    })

    it('should not overwrite properties changed by user', () => {
      expect(
        strategy.mergeJSON({
          current: commonPreventOverwriteFxt.current,
          upcoming: commonPreventOverwriteFxt.upcoming,
          cached: commonPreventOverwriteFxt.cached,
        }),
      ).toEqual(commonPreventOverwriteFxt.result)
    })

    it('should unapply cache from hashes', () => {
      expect(
        strategy.unapplyCacheJSON({
          current: commonBaseFxt.current,
          cached: commonBaseFxt.cached,
        }),
      ).toEqual(commonBaseFxt.uncached)
    })

    it('should unapply cache from lists', () => {
      expect(
        strategy.unapplyCacheJSON({
          current: commonListsFxt.current,
          cached: commonListsFxt.cached,
        }),
      ).toEqual(commonListsFxt.uncached)
    })
  })

  describe.only('YAML', () => {
    it('should merge YAML configs', () => {
      expect(
        strategy.mergeYAML({
          current: commonBaseFxtYaml.current,
          upcoming: commonBaseFxtYaml.upcoming,
        }),
      ).toWraplessEqual(commonBaseFxtYaml.result)
    })

    it('should merge lists', () => {
      expect(
        strategy.mergeYAML({
          current: commonListsFxtYaml.current,
          upcoming: commonListsFxtYaml.upcoming,
        }),
      ).toWraplessEqual(commonListsFxtYaml.result)
    })

    it('should return YAML string without applied properties from second YAML', () => {
      expect(
        strategy.unapplyYAML({
          current: commonBaseFxtYaml.result,
          upcoming: commonBaseFxtYaml.upcoming,
        }),
      ).toWraplessEqual(commonBaseFxtYaml.restored)
    })

    it('should return empty string if YAML string have not difference', () => {
      expect(
        strategy.unapplyYAML({
          current: commonBaseFxtYaml.result,
          upcoming: commonBaseFxtYaml.result,
        }),
      ).toBe('')
    })

    it('should unapply lists', () => {
      expect(
        strategy.unapplyYAML({
          current: commonListsFxtYaml.result,
          upcoming: commonListsFxtYaml.upcoming,
        }),
      ).toWraplessEqual(commonListsFxtYaml.restored)
    })

    it('should not overwrite properties changed by user', () => {
      expect(
        strategy.mergeYAML({
          current: commonPreventOverwriteFxtYaml.current,
          upcoming: commonPreventOverwriteFxtYaml.upcoming,
          cached: commonPreventOverwriteFxtYaml.cached,
        }),
      ).toWraplessEqual(commonPreventOverwriteFxtYaml.result)
    })

    it('should unapply cache from hashes', () => {
      expect(
        strategy.unapplyCacheYAML({
          current: commonBaseFxtYaml.current,
          cached: commonBaseFxtYaml.cached,
        }),
      ).toWraplessEqual(commonBaseFxtYaml.uncached)
    })

    it('should unapply cache from lists', () => {
      expect(
        strategy.unapplyCacheYAML({
          current: commonListsFxtYaml.current,
          cached: commonListsFxtYaml.cached,
        }),
      ).toWraplessEqual(commonListsFxtYaml.uncached)
    })

    describe('quotes styles', () => {
      const singleQuotesYamlFxt = fixtures('common/yaml/05-single-quotes-style')
      const doubleQuotesYamlFxt = fixtures('common/yaml/06-double-quotes-style')

      it('should save single quotes style', () => {
        expect(
          strategy.mergeYAML({
            current: singleQuotesYamlFxt.current,
            upcoming: singleQuotesYamlFxt.upcoming,
          }),
        ).toWraplessEqual(singleQuotesYamlFxt.result)
      })

      it('should save double quotes style', () => {
        expect(
          strategy.mergeYAML({
            current: doubleQuotesYamlFxt.current,
            upcoming: doubleQuotesYamlFxt.upcoming,
          }),
        ).toWraplessEqual(doubleQuotesYamlFxt.result)
      })
    })
  })

  describe('Lines', () => {
    it('should merge linear text files', () => {
      expect(
        strategy.mergeLines({
          current: gitignoreBaseFxt.current,
          upcoming: gitignoreBaseFxt.upcoming,
        }),
      ).toEqual(gitignoreBaseFxt.result)
    })

    it('should unapply upcoming changes from linear text files', () => {
      expect(
        strategy.unapplyLines({
          current: gitignoreBaseFxt.result,
          upcoming: gitignoreBaseFxt.upcoming,
        }),
      ).toEqual(gitignoreBaseFxt.restored)
    })
  })

  describe('auto', () => {
    it('should automatically determine and apply merge method to given file', () => {
      expect(
        strategy.merge('common_01.json')({
          current: commonBaseFxt.current,
          upcoming: commonBaseFxt.upcoming,
        }),
      ).toEqual(commonBaseFxt.result)
      expect(
        strategy.merge('common_01.yaml')({
          current: commonBaseFxtYaml.current,
          upcoming: commonBaseFxtYaml.upcoming,
        }),
      ).toWraplessEqual(commonBaseFxtYaml.result)
      expect(
        strategy.merge('common_01.yaml')({
          current: commonBaseFxtYaml.current,
          upcoming: commonBaseFxtYaml.upcoming,
        }),
      ).toWraplessEqual(commonBaseFxtYaml.result)
    })

    it('should automatically determine and apply unapply method to given file', () => {
      expect(
        strategy.unapply('common.json')({
          current: commonBaseFxt.result,
          upcoming: commonBaseFxt.upcoming,
        }),
      ).toEqual(commonBaseFxt.restored)
      expect(
        strategy.unapply('common.yaml')({
          current: commonBaseFxtYaml.result,
          upcoming: commonBaseFxtYaml.upcoming,
        }),
      ).toWraplessEqual(commonBaseFxtYaml.restored)
      expect(
        strategy.unapply('common.txt')({
          current: gitignoreBaseFxt.result,
          upcoming: gitignoreBaseFxt.upcoming,
        }),
      ).toEqual(gitignoreBaseFxt.restored)
    })
  })
})
