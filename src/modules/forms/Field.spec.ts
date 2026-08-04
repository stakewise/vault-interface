import { parseEther } from 'ethers'

import Field from './Field'
import validators from './validators'


const requiredError = JSON.stringify(validators.required(''))

describe('forms/Field', () => {

  describe('Check init params', () => {

    it(`date mask`, () => {
      const field = new Field({
        valueType: 'string',
        mask: 'date',
      })

      field.setValue('20210919')

      expect(field.value).toEqual('2021-09-19')
    })

    it(`validators`, () => {
      const field = new Field({ valueType: 'string', validators: [ validators.required ] })

      field.validate('')

      expect(JSON.stringify(field.error)).toEqual(requiredError)
    })

    it(`pattern`, () => {
      const field = new Field({
        valueType: 'string',
        pattern: '^[0-9]+$',
      })

      field.setValue('asd')
      expect(field.value).toEqual(undefined)

      field.setValue('AGH')
      expect(field.value).toEqual(undefined)

      field.setValue('./{}]][..')
      expect(field.value).toEqual(undefined)

      field.setValue('123')
      expect(field.value).toEqual('123')
    })

    it(`initial value`, () => {
      const field = new Field({ valueType: 'string', initialValue: '333' })

      expect(field.value).toEqual('333')
    })
  })

  describe('Check input types', () => {

    it(`date`, () => {
      const field = new Field({
        valueType: 'string',
        type: 'date',
      })

      field.validate('')
      expect(JSON.stringify(field.error)).toEqual(requiredError)

      field.setValue('20210919')
      expect(field.value).toEqual('2021-09-19')
    })

    it(`wallet address`, () => {
      const field = new Field({
        valueType: 'string',
        type: 'address',
      })

      field.validate('')
      expect(JSON.stringify(field.error)).toEqual(requiredError)

      field.setValue('agfgdsasd')

      const addressError = JSON.stringify(validators.ethOrEnsAddress(field.value))
      expect(JSON.stringify(field.error)).toEqual(addressError)

      field.setValue('0x4Fe7Cb62C98Ca5F71011d0DA0DAC680b832b858c')
      expect(field.error).toEqual(null)

      field.setValue('powerstake.eth')
      expect(field.error).toEqual(null)
    })

    it(`token amount`, () => {
      const field = new Field({
        valueType: 'string',
        type: 'tokenAmount',
      })

      field.validate('')
      expect(JSON.stringify(field.error)).toEqual(requiredError)

      field.setValue('0..0')
      expect(field.value).toEqual(undefined)

      field.setValue('0')
      const zeroError = JSON.stringify(validators.greaterThanZero(field.value))
      expect(JSON.stringify(field.error)).toEqual(zeroError)

      field.setValue('0.00001')
      expect(field.error).toEqual(null)
    })

    it(`bigint`, () => {
      const field = new Field({ valueType: 'bigint' })

      field.setValue('0')
      expect(field.value).toEqual(undefined)

      field.setValue(false)
      expect(field.value).toEqual(undefined)

      field.setValue(11)
      expect(field.value).toEqual(undefined)

      field.setValue(100n)
      expect(field.value).toEqual(100n)
    })

    it(`token amount with balance ref`, () => {
      const balanceRef = {
        current: parseEther('1.01'),
      }

      const field = new Field({
        type: 'tokenAmount',
        valueType: 'string',
        typeInput: { balanceRef },
      })

      field.validate('1.02')

      const balanceError = JSON.stringify(
        validators.sufficientBalance(balanceRef)('1.02')
      )

      expect(JSON.stringify(field.error)).toEqual(balanceError)

      field.setValue('1')
      expect(field.error).toEqual(null)
    })
  })
})
