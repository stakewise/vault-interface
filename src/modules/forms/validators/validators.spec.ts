import { parseEther } from 'ethers'

import validators from './index'
import messages from './messages'


describe('forms/validators', () => {
  const {
    min,
    max,
    email,
    exclude,
    httpsUrl,
    required,
    maxLength,
    minLength,
    validDate,
    ethAddress,
    numberWithDot,
    greaterThanZero,
    sufficientBalance,
  } = validators

  describe('required validator', () => {
    it('should not return an error if the value exists', () => {
      expect(required('string')).toBeFalsy()
      expect(required(true)).toBeFalsy()
      // @ts-ignore
      expect(required(123)).toBeFalsy()
    })

    it('should return an error if the value does not exists', () => {
      // @ts-ignore
      expect(required(undefined)).toEqual(messages.required)
      // @ts-ignore
      expect(required(null)).toEqual(messages.required)
      expect(required('')).toEqual(messages.required)
    })
  })

  describe('email validator', () => {
    it('should not return an error if the email is valid', () => {
      expect(email('123@mail.com')).toBeFalsy()
      expect(email('123@mail.co.com')).toBeFalsy()
      expect(email('email@mail.com')).toBeFalsy()
      expect(email('email.123@mail.com')).toBeFalsy()
    })

    it('should return an error if the email is not valid', () => {
      expect(email('@mail.com')).toEqual(messages.email)
      expect(email('email@mail')).toEqual(messages.email)
      expect(email('@mail.co.com')).toEqual(messages.email)
      expect(email('email.co@mail')).toEqual(messages.email)
      expect(email('.email@mail.com')).toEqual(messages.email)
      expect(email('email@mail.com.')).toEqual(messages.email)
      expect(email('email@@mail.com')).toEqual(messages.email)
    })
  })

  describe('ETH address validator', () => {
    it('should not return an error if the address is valid', () => {
      expect(ethAddress('0xEC01cB780202595Ce2Fb11225aABfAd201B54e0f')).toBeFalsy()
    })

    it('should return an error if the address is not valid', () => {
      expect(ethAddress('xEC01cB780202595Ce2Fb11225aABfAd201B54e0f')).toEqual(messages.ethAddress)
      expect(ethAddress('0xEC01cB780202595Ce2Fb11225aABfAd201B54e')).toEqual(messages.ethAddress)
    })
  })

  describe('sufficientBalance validator', () => {
    const balanceRef = { current: parseEther('32') }

    it('should return an error if the value > balance', () => {
      expect(sufficientBalance(balanceRef)('33')).toEqual(messages.insufficientBalance)
      expect(sufficientBalance(balanceRef)('32.000000000000000001')).toEqual(messages.insufficientBalance)
    })

    it('should not return an error if the value is correct', () => {
      expect(sufficientBalance(balanceRef)('32')).toBeFalsy()
      expect(sufficientBalance(balanceRef)('31.000000000000000001')).toBeFalsy()
    })
  })

  describe('numberWithDot validator', () => {
    it('should return an error if the value is incorrect', () => {
      expect(numberWithDot('AAA')).toEqual(messages.invalidNumberWithDot)
      expect(numberWithDot('1..1')).toEqual(messages.invalidNumberWithDot)
      expect(numberWithDot('..1')).toEqual(messages.invalidNumberWithDot)
      expect(numberWithDot('1..')).toEqual(messages.invalidNumberWithDot)
    })

    it('should not return an error if the value is correct', () => {
      expect(numberWithDot('1.55')).toBeFalsy()
      expect(numberWithDot('155')).toBeFalsy()
    })
  })

  describe('exclude validator', () => {
    it('should return an error if the value is incorrect', () => {
      const values = [ '1', '2' ]

      expect(exclude(values)('1')).toEqual(messages.exclude)
      expect(exclude(values)('2')).toEqual(messages.exclude)
    })

    it('should not return an error if the value is correct', () => {
      expect(exclude([ '1', '2' ])('3')).toBeFalsy()
    })
  })

  describe('httpsUrl validator', () => {
    it('should not return an error if the URL is valid', () => {
      expect(httpsUrl('https://rpc.example.com')).toBeFalsy()
      expect(httpsUrl('https://eth-mainnet.g.alchemy.com/v2/abc123')).toBeFalsy()
      expect(httpsUrl('https://example.com/path?query=1')).toBeFalsy()
    })

    it('should return an error if the URL is not valid', () => {
      expect(httpsUrl('http://example.com')).toEqual(messages.httpsUrl)
      expect(httpsUrl('ws://example.com')).toEqual(messages.httpsUrl)
      expect(httpsUrl('wss://example.com')).toEqual(messages.httpsUrl)
      expect(httpsUrl('ftp://example.com')).toEqual(messages.httpsUrl)
      expect(httpsUrl('example.com')).toEqual(messages.httpsUrl)
      expect(httpsUrl('https://')).toEqual(messages.httpsUrl)
      expect(httpsUrl('not-a-url')).toEqual(messages.httpsUrl)
    })
  })

  describe('maxLength validator', () => {
    it('should not return an error for strings within the limit, empty or undefined', () => {
      expect(maxLength(5)('abc')).toBeFalsy()
      expect(maxLength(5)('abcde')).toBeFalsy()
      expect(maxLength(5)('')).toBeFalsy()
      expect(maxLength(5)(undefined)).toBeFalsy()
    })

    it('should return an error for strings over the limit', () => {
      expect(maxLength(5)('abcdef')).toEqual({ ...messages.maxLength, values: { maxLength: 5 } })
    })
  })

  describe('minLength validator', () => {
    it('should not return an error for strings at or over the limit, or undefined', () => {
      expect(minLength(5)('abcde')).toBeFalsy()
      expect(minLength(5)('abcdef')).toBeFalsy()
      expect(minLength(5)(undefined)).toBeFalsy()
    })

    it('should not return an error for an empty string (emptiness is the required validator job)', () => {
      expect(minLength(5)('')).toBeFalsy()
    })

    it('should return an error for strings under the limit', () => {
      expect(minLength(5)('abc')).toEqual({ ...messages.minLength, values: { minLength: 5 } })
    })
  })

  describe('validDate validator', () => {
    it('should not return an error for a valid date or undefined', () => {
      expect(validDate('2024-01-15')).toBeFalsy()
      expect(validDate(undefined)).toBeFalsy()
    })

    it('should return an error for an invalid date format', () => {
      expect(validDate('2024-1-5')).toEqual(messages.invalidDate)
      expect(validDate('notadate')).toEqual(messages.invalidDate)
    })
  })

  describe('min validator', () => {
    it('should not return an error for values at or above the minimum', () => {
      expect(min(32)('32')).toBeFalsy()
      expect(min(32)('100')).toBeFalsy()
    })

    it('should not return an error for NaN (e.g. "∞" unlimited capacity)', () => {
      expect(min(32)('∞')).toBeFalsy()
    })

    it('should return an error for values below the minimum', () => {
      expect(min(32)('10')).toEqual({ ...messages.min, values: { minValue: 32 } })
    })
  })

  describe('max validator', () => {
    it('should not return an error for values at or below the maximum', () => {
      expect(max(100)('50')).toBeFalsy()
      expect(max(100)('100')).toBeFalsy()
    })

    it('should not return an error for NaN (e.g. "∞")', () => {
      expect(max(100)('∞')).toBeFalsy()
    })

    it('should return an error for values above the maximum', () => {
      expect(max(100)('150')).toEqual({ ...messages.max, values: { maxValue: 100 } })
    })
  })

  describe('greaterThanZero validator', () => {
    it('should not return an error for positive values, NaN or empty', () => {
      expect(greaterThanZero('5')).toBeFalsy()
      expect(greaterThanZero('∞')).toBeFalsy()
      expect(greaterThanZero(undefined)).toBeFalsy()
    })

    it('should return an error for zero or negative values', () => {
      expect(greaterThanZero('0')).toEqual(messages.greaterThanZero)
      expect(greaterThanZero('-1')).toEqual(messages.greaterThanZero)
    })
  })
})

