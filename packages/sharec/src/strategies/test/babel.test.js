const { strategy } = require('strategies/babel')

describe('strategy > babel', () => {
  describe('json strategy', () => {
    // Base merge case
    const babel01 = require('fixtures/babel/json/babel_01.json')
    const babel02 = require('fixtures/babel/json/babel_02.json')

    // Env merging features
    const babel04 = require('fixtures/babel/json/babel_04.json')
    const babel05 = require('fixtures/babel/json/babel_05.json')
    const babel07 = require('fixtures/babel/json/babel_07.json')
    const babel08 = require('fixtures/babel/json/babel_08.json')

    it('should merge babel json configs', () => {
      expect(strategy(babel01, babel02)).toMatchSnapshot()
    })

    it('should handle unique env cases during merging', () => {
      expect(strategy(babel04, babel05)).toMatchSnapshot()
      expect(strategy(babel05, babel04)).toMatchSnapshot()
      expect(strategy(babel07, babel08)).toMatchSnapshot()
      expect(strategy(babel08, babel07)).toMatchSnapshot()
    })
  })
})