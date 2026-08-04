import replaceSimpleVariables from './replaceSimpleVariables'


describe('module:intl/replaceSimpleVariables', () => {

  it('should return passed message without changes', () => {
    const message = 'Hello, {username}'
    const expected = 'Hello, {username}'
    const actual = replaceSimpleVariables(message)

    expect(actual).toEqual(expected)
  })

  it('should replace one variable', () => {
    const message = 'Hello, {username}'
    const expected = 'Hello, John Doe'
    const actual = replaceSimpleVariables(message, { username: 'John Doe' })

    expect(actual).toEqual(expected)
  })

  it('should replace multiple variables', () => {
    const message = 'Hello, {username}. Get a free {product}'
    const expected = 'Hello, John Doe. Get a free cologne'
    const actual = replaceSimpleVariables(message, { username: 'John Doe', product: 'cologne' })

    expect(actual).toEqual(expected)
  })

  it('should replace multiple same variables', () => {
    const message = 'Get a free {product}. This is nice {product}'
    const expected = 'Get a free cologne. This is nice cologne'
    const actual = replaceSimpleVariables(message, { product: 'cologne' })

    expect(actual).toEqual(expected)
  })

})
