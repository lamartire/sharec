const { fixtures } = require('testUtils')
const { eslintIgnoreStrategy } = require('../../eslintIgnore')

describe('strategy > eslintignore', () => {
  const eslintignoreBaseFxt = fixtures('eslintignore/lines/01-base')
  const eslintignoreArrayLikeFxt = fixtures(
    'eslintignore/json/01-array-like',
    'json',
  )

  describe('merge', () => {
    it('should correctly merge configs', () => {
      expect(
        eslintIgnoreStrategy.merge('.eslintignore')({
          current: eslintignoreBaseFxt.current,
          upcoming: eslintignoreBaseFxt.upcoming,
        }),
      ).toEqual(eslintignoreBaseFxt.result)
      expect(
        eslintIgnoreStrategy.merge('eslintIgnore')({
          current: eslintignoreArrayLikeFxt.current,
          upcoming: eslintignoreArrayLikeFxt.upcoming,
        }),
      ).toEqual(eslintignoreArrayLikeFxt.result)
    })
  })

  describe('uapplying', () => {
    it('should correctly unapply configs', () => {
      expect(
        eslintIgnoreStrategy.unapply('.eslintignore')({
          current: eslintignoreBaseFxt.result,
          upcoming: eslintignoreBaseFxt.upcoming,
        }),
      ).toEqual(eslintignoreBaseFxt.restored)
      expect(
        eslintIgnoreStrategy.unapply('eslintIgnore')({
          current: eslintignoreArrayLikeFxt.result,
          upcoming: eslintignoreArrayLikeFxt.upcoming,
        }),
      ).toEqual(eslintignoreArrayLikeFxt.restored)
    })
  })
})
