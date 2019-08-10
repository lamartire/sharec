const { fixture } = require('testUtils')
const { babelStrategy } = require('../../babel')

describe('strategy > babel > with empty > ', () => {
  const babelCurrent = fixture('babel/json/02-with-empty/current.json', 'json')
  const babelNew = fixture('babel/json/02-with-empty/new.json', 'json')
  const babelResult = fixture('babel/json/02-with-empty/result.json', 'json')
  const babelRestored = fixture(
    'babel/json/02-with-empty/restored.json',
    'json',
  )

  it('should handle merge with empty config', () => {
    expect(babelStrategy.mergeJSON(babelCurrent, babelNew)).toEqual(babelResult)
    expect(babelStrategy.mergeJSON(babelNew, babelCurrent)).toEqual(babelResult)
  })

  it('should fully unapply babel JSON config', () => {
    expect(babelStrategy.unapplyJSON(babelResult, babelNew)).toEqual(
      babelRestored,
    )
  })
})