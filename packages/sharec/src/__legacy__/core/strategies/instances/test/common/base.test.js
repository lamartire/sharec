const { fixtures } = require('testUtils')
const { commonStrategy } = require('../../common')

describe('strategy > common > ', () => {
  const commonBaseFxt = fixtures('common/json/01-base', 'json')
  const commonBaseFxtYaml = fixtures('common/yaml/01-base')

  describe('merge', () => {
    it('should return last argument if it is not mergable', () => {
      expect(
        commonStrategy.merge('config')({
          current: 'bar',
          upcoming: 'baz',
        }),
      ).toBe('baz')
    })

    describe('JSON', () => {
      it('should merge objects by one deep level', () => {
        expect(
          commonStrategy.mergeJSON({
            current: commonBaseFxt.current,
            upcoming: commonBaseFxt.upcoming,
          }),
        ).toEqual(commonBaseFxt.result)
      })

      it('should automatically merge configs with method determination', () => {
        expect(
          commonStrategy.merge('config.json')({
            current: commonBaseFxt.current,
            upcoming: commonBaseFxt.upcoming,
          }),
        ).toEqual(commonBaseFxt.result)
      })
    })

    describe('YAML', () => {
      it('should merge objects by one deep level', () => {
        expect(
          commonStrategy.mergeYAML({
            current: commonBaseFxtYaml.current,
            upcoming: commonBaseFxtYaml.upcoming,
          }),
        ).toWraplessEqual(commonBaseFxtYaml.result)
      })
      it('should automatically merge configs with method determination', () => {
        expect(
          commonStrategy.merge('config.yaml')({
            current: commonBaseFxtYaml.current,
            upcoming: commonBaseFxtYaml.upcoming,
          }),
        ).toWraplessEqual(commonBaseFxtYaml.result)
      })
    })
  })

  describe('unapply', () => {
    describe('JSON', () => {
      it('should unapply objects by one deep level', () => {
        expect(
          commonStrategy.unapplyJSON({
            current: commonBaseFxt.result,
            upcoming: commonBaseFxt.upcoming,
          }),
        ).toEqual(commonBaseFxt.restored)
      })

      it('should automatically unapply configs with method determination', () => {
        expect(
          commonStrategy.unapply('config.json')({
            current: commonBaseFxt.result,
            upcoming: commonBaseFxt.upcoming,
          }),
        ).toEqual(commonBaseFxt.restored)
      })
    })

    describe('YAML', () => {
      it('should unapply objects by one deep level', () => {
        expect(
          commonStrategy.unapplyYAML({
            current: commonBaseFxtYaml.result,
            upcoming: commonBaseFxtYaml.upcoming,
          }),
        ).toWraplessEqual(commonBaseFxtYaml.restored)
      })

      it('should automatically merge configs with method determination', () => {
        expect(
          commonStrategy.unapply('config.yaml')({
            current: commonBaseFxtYaml.result,
            upcoming: commonBaseFxtYaml.upcoming,
          }),
        ).toWraplessEqual(commonBaseFxtYaml.restored)
      })
    })
  })
})
