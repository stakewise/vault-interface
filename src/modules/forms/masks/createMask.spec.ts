import { createMask } from './index'


describe('forms/masks', () => {

  it(`Check phone mask`, () => {
    const mask = createMask('+1 (XXX) XXX-XX-XX')

    expect(mask('9')).toEqual('+1 (9')
    expect(mask('92')).toEqual('+1 (92')
    expect(mask('922')).toEqual('+1 (922')
    expect(mask('9224')).toEqual('+1 (922) 4')
    expect(mask('92244')).toEqual('+1 (922) 44')
    expect(mask('922444')).toEqual('+1 (922) 444')
    expect(mask('9224442')).toEqual('+1 (922) 444-2')
    expect(mask('92244422')).toEqual('+1 (922) 444-22')
    expect(mask('922444224')).toEqual('+1 (922) 444-22-4')
    expect(mask('9224442244')).toEqual('+1 (922) 444-22-44')
    expect(mask('922444224413131313')).toEqual('+1 (922) 444-22-44')
  })

  it(`Check date mask`, () => {
    const mask = createMask('XXXX-XX-XX')

    expect(mask('2')).toEqual('2')
    expect(mask('20')).toEqual('20')
    expect(mask('202')).toEqual('202')
    expect(mask('2024')).toEqual('2024')
    expect(mask('20241')).toEqual('2024-1')
    expect(mask('202412')).toEqual('2024-12')
    expect(mask('2024121')).toEqual('2024-12-1')
    expect(mask('20241212')).toEqual('2024-12-12')
    expect(mask('202412121313')).toEqual('2024-12-12')
  })

  it(`Check card mask`, () => {
    const mask = createMask('XXXX XXXX XXXX XXXX')

    expect(mask('1')).toEqual('1')
    expect(mask('12')).toEqual('12')
    expect(mask('123')).toEqual('123')
    expect(mask('1234')).toEqual('1234')
    expect(mask('12345')).toEqual('1234 5')
    expect(mask('123456')).toEqual('1234 56')
    expect(mask('1234567')).toEqual('1234 567')
    expect(mask('12345678')).toEqual('1234 5678')
    expect(mask('1234567890123456')).toEqual('1234 5678 9012 3456')
  })
})
