import _formatMessage from './formatMessage'


const formatMessage = _formatMessage.bind(null, 'en')

describe('module:intl/formatMessage', () => {

  describe('common', () => {

    it('with no variables', () => {
      const message = { en: 'Hello world' }
      const expected = 'Hello world'

      expect(formatMessage(message)).toEqual(expected)
    })

    it('with html tags', () => {
      const message = { en: '<b>Hello world</b>' }
      const expected = '<b>Hello world</b>'

      expect(formatMessage(message)).toEqual(expected)
    })

    it('with multiple lines', () => {
      const message = {
        en: `
          Discover a new burger 
          This is delicious
        `,
      }
      const expected = 'Discover a new burger This is delicious'

      expect(formatMessage(message)).toEqual(expected)
    })

  })

  // Simple variables ----------------------------------------------------- /

  describe('with simple variables', () => {

    it('with no value', () => {
      const message = { en: 'Hello, {username}' }
      const expected = 'Hello, {username}'

      expect(formatMessage(message)).toEqual(expected)
    })

    it('with null value', () => {
      const message = { en: 'Hello, {username}' }
      const values = { username: null }
      const expected = 'Hello, {username}'

      // @ts-ignore
      expect(formatMessage(message, values)).toEqual(expected)
    })

    it('with string value', () => {
      const message = { en: 'Hello, {username}' }
      const values = { username: 'John Doe' }
      const expected = 'Hello, John Doe'

      expect(formatMessage(message, values)).toEqual(expected)
    })

    it('with price value', () => {
      const message = { en: 'Price: {price}' }
      const values = { price: '$10.15' }
      const expected = 'Price: $10.15'

      expect(formatMessage(message, values)).toEqual(expected)
    })

    it('with multiple values', () => {
      const message = { en: 'Discover a new {product} {period} for ${price}' }
      const values = { product: 'burger', period: 'every month', price: 1.95 }
      const expected = 'Discover a new burger every month for $1.95'

      expect(formatMessage(message, values)).toEqual(expected)
    })

  })

  // Plural variables ----------------------------------------------- /

  describe('with plural variable', () => {

    it('with values { count: 1 }', () => {
      const messages = {
        en: 'Get {count, plural, one {# product} other {# products}} for free.',
        ru: 'Получить {count, plural, one {# продукт} other {# продуктов}} бесплатно.',
        fr: 'Obtenez {count, plural, one {# produit} other {# produits}} gratuitement.',
        de: 'Erhalten Sie das {count, plural, one {# Produkt} other {# Produkte}} kostenlos.',
        es: 'Obtenga {count, plural, one {# producto} other {# productos}} gratis.',
        pt: 'Receba {count, plural, one {# produto} other {# produtos}} gratuitamente.',
        zh: '免费获得 {count, plural, one {# 产品} other {# 产品}}。',
      }
      const expectedMessages = {
        en: 'Get 1 product for free.',
        ru: 'Получить 1 продукт бесплатно.',
        fr: 'Obtenez 1 produit gratuitement.',
        de: 'Erhalten Sie das 1 Produkt kostenlos.',
        es: 'Obtenga 1 producto gratis.',
        pt: 'Receba 1 produto gratuitamente.',
        zh: '免费获得 1 产品。',
      }
      const values = { count: 1 }

      for (const [ key, value ] of Object.entries(messages)) {
        const expectedMessage = expectedMessages[key as keyof typeof expectedMessages]

        expect(_formatMessage(key, { [key]: value }, values)).toEqual(expectedMessage)
      }
    })

    it('with values { count: 23 }', () => {
      const messages = {
        en: 'Get {count, plural, one {# product} other {products}} for free.',
        ru: 'Получить {count, plural, one {# продукт} other {продукты}} бесплатно.',
        fr: 'Obtenez {count, plural, one {# produit} other {produits}} gratuitement.',
        de: 'Erhalten Sie das {count, plural, one {# Produkt} other {Produkte}} kostenlos.',
        es: 'Obtenga {count, plural, one {# producto} other {productos}} gratis.',
        pt: 'Receba {count, plural, one {# produto} other {produtos}} gratuitamente.',
        zh: '免费获得{count, plural, one {# 产品} other {产品}}。',
      }
      const expectedMessages = {
        en: 'Get products for free.',
        ru: 'Получить продукты бесплатно.',
        fr: 'Obtenez produits gratuitement.',
        de: 'Erhalten Sie das Produkte kostenlos.',
        es: 'Obtenga productos gratis.',
        pt: 'Receba produtos gratuitamente.',
        zh: '免费获得产品。',
      }
      const values = { count: 23 }

      for (const [ key, value ] of Object.entries(messages)) {
        const expectedMessage = expectedMessages[key as keyof typeof expectedMessages]

        expect(_formatMessage(key, { [key]: value }, values)).toEqual(expectedMessage)
      }
    })

    it('if # exists', () => {
      const messages = {
        en: 'Get {count, plural, one {# product} other {# products}} for free.',
        ru: 'Получить {count, plural, one {# продукт} other {# продукта}} бесплатно.',
        fr: 'Obtenez {count, plural, one {# produit} other {# produits}} gratuitement.',
        de: 'Erhalten Sie das {count, plural, one {# Produkt} other {# Produkte}} kostenlos.',
        es: 'Obtenga {count, plural, one {# producto} other {# productos}} gratis.',
        pt: 'Receba {count, plural, one {# produto} other {# produtos}} gratuitamente.',
        zh: '免费获得 {count, plural, one {# 产品} other {# 产品}}。',
      }
      const expectedMessages = {
        en: 'Get 23 products for free.',
        ru: 'Получить 23 продукта бесплатно.',
        fr: 'Obtenez 23 produits gratuitement.',
        de: 'Erhalten Sie das 23 Produkte kostenlos.',
        es: 'Obtenga 23 productos gratis.',
        pt: 'Receba 23 produtos gratuitamente.',
        zh: '免费获得 23 产品。',
      }
      const values = { count: 23 }

      for (const [ key, value ] of Object.entries(messages)) {
        const expectedMessage = expectedMessages[key as keyof typeof expectedMessages]

        expect(_formatMessage(key, { [key]: value }, values)).toEqual(expectedMessage)
      }
    })

    it('with no values', () => {
      const messages = {
        en: 'Get {count, plural, one {# product} other {products}} for free.',
        ru: 'Получить {count, plural, one {# продукт} other {продукты}} бесплатно.',
        fr: 'Obtenez {count, plural, one {# produit} other {produits}} gratuitement.',
        de: 'Erhalten Sie das {count, plural, one {# Produkt} other {Produkte}} kostenlos.',
        es: 'Obtenga {count, plural, one {# producto} other {productos}} gratis.',
        pt: 'Receba {count, plural, one {# produto} other {produtos}} gratuitamente.',
        zh: '免费获得{count, plural, one {# 产品} other {产品}}。',
      }
      const expectedMessages = {
        en: 'Get products for free.',
        ru: 'Получить продукты бесплатно.',
        fr: 'Obtenez produits gratuitement.',
        de: 'Erhalten Sie das Produkte kostenlos.',
        es: 'Obtenga productos gratis.',
        pt: 'Receba produtos gratuitamente.',
        zh: '免费获得产品。',
      }

      for (const [ key, value ] of Object.entries(messages)) {
        const expectedMessage = expectedMessages[key as keyof typeof expectedMessages]

        expect(_formatMessage(key, { [key]: value })).toEqual(expectedMessage)
      }
    })

    it('with no values #2', () => {
      const messages = {
        en: 'Get {count, plural, one {# product} other {new products}} for free.',
        ru: 'Получить {count, plural, one {# продукт} other {новые продукты}} бесплатно.',
        fr: 'Obtenez {count, plural, one {# produit} other {nouveaux produits}} gratuitement.',
        de: 'Erhalten Sie das {count, plural, one {# Produkt} other {Neue Produkte}} kostenlos.',
        es: 'Obtenga {count, plural, one {# producto} other {nuevos productos}} gratis.',
        pt: 'Receba {count, plural, one {# produto} other {novos produtos}} gratuitamente.',
        zh: '免费获得{count, plural, one {# 产品} other {新产品}}。',
      }
      const expectedMessages = {
        en: 'Get new products for free.',
        ru: 'Получить новые продукты бесплатно.',
        fr: 'Obtenez nouveaux produits gratuitement.',
        de: 'Erhalten Sie das Neue Produkte kostenlos.',
        es: 'Obtenga nuevos productos gratis.',
        pt: 'Receba novos produtos gratuitamente.',
        zh: '免费获得新产品。',
      }

      for (const [ key, value ] of Object.entries(messages)) {
        const expectedMessage = expectedMessages[key as keyof typeof expectedMessages]

        expect(_formatMessage(key, { [key]: value })).toEqual(expectedMessage)
      }
    })

    it('with several values', () => {
      const messages = {
        en: 'Get {count, plural, one {# product} other {two products}} for free.',
        ru: 'Получить {count, plural, one {# продукт} other {два продукта}} бесплатно.',
        fr: 'Obtenez {count, plural, one {# produit} other {deux produits}} gratuitement.',
        de: 'Erhalten Sie das {count, plural, one {# Produkt} other {zwei Produkte}} kostenlos.',
        es: 'Obtenga {count, plural, one {# producto} other {dos productos}} gratis.',
        pt: 'Receba {count, plural, one {# produto} other {dois produtos}} gratuitamente.',
        zh: '免费获得{count, plural, one {# 产品} other {二}}产品。',
      }
      const expectedMessages = {
        en: 'Get two products for free.',
        ru: 'Получить два продукта бесплатно.',
        fr: 'Obtenez deux produits gratuitement.',
        de: 'Erhalten Sie das zwei Produkte kostenlos.',
        es: 'Obtenga dos productos gratis.',
        pt: 'Receba dois produtos gratuitamente.',
        zh: '免费获得二产品。',
      }
      const values = { count: 2 }

      for (const [ key, value ] of Object.entries(messages)) {
        const expectedMessage = expectedMessages[key as keyof typeof expectedMessages]

        expect(_formatMessage(key, { [key]: value }, values)).toEqual(expectedMessage)
      }
    })

  })

  // Select variables ----------------------------------------------- /

  describe('with select variable', () => {

    it('with values { currency: "ETH" }', () => {
      const message = { en: 'Check a new {currency, select, ETH {ethereum} BTC {bitcoin}}' }
      const values = { currency: 'ETH' }
      const expected = 'Check a new ethereum'

      expect(formatMessage(message, values)).toEqual(expected)
    })

    it('with no values', () => {
      const message = { en: 'Check a new {currency, select, ETH {ethereum} BTC {bitcoin}}' }
      const expected = 'Check a new ethereum'

      expect(formatMessage(message)).toEqual(expected)
    })

    it('with empty values', () => {
      const message = { en: 'Check a new {currency, select, ETH {ethereum} BTC {bitcoin}}' }
      const expected = 'Check a new ethereum'

      expect(formatMessage(message)).toEqual(expected)
    })

  })

  // Mixed variables ---------------------------------- /

  describe('with mixed variables', () => {

    it('with same plural and simple variable names', () => {
      const message = { en: 'Get a free {product}. One {count, plural, one {product} other {products}}' }
      const values = { count: 1, product: 'burger' }
      const expected = 'Get a free burger. One product'

      expect(formatMessage(message, values)).toEqual(expected)
    })

    it('inline', () => {
      // eslint-disable-next-line max-len
      const message = { en: 'Discover a new {gender, select, female {cheeseburger} male {burger}} {period} for {price, plural, one {# dollar} other {# dollars}}' }
      const values = { gender: 'male', period: 'every month', price: 1 }
      const expected = 'Discover a new burger every month for 1 dollar'

      expect(formatMessage(message, values)).toEqual(expected)
    })

  })

})
