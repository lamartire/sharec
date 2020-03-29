const { fixtures } = require('testUtils')
const { pipe } = require('../pipe')

describe('pipes > stylelint > pipe', () => {
  describe('JSON', () => {
    const stylelintBaseFxt = fixtures('atomic/stylelint/json/00-base')

    it('should merge configs', () => {
      expect(pipe('.stylelint')(stylelintBaseFxt)).toEqual(stylelintBaseFxt.result)
    })
  })
})
