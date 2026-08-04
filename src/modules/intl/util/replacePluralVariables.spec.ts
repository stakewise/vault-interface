import replacePluralVariables from './replacePluralVariables'


describe('module:intl/replacePluralVariables', () => {

  it('should work with non-existent locale', () => {
    const messages = {
      xyz: 'Get {count, plural, one {# product} other {# products}} for free.',
    }
    const expectedMessages = {
      xyz: 'Get products for free.',
    }

    for (const [ key, value ] of Object.entries(messages)) {
      const expectedMessage = expectedMessages[key as keyof typeof expectedMessages]

      expect(replacePluralVariables(value, key)).toEqual(expectedMessage)
    }
  })

  it('should return passed message without changes if wrong variable template used #1', () => {
    const messages = {
      en: 'Get {count, plural, one {# product}} for free.',
      ru: 'Получить {count, plural, one {# продукт}} бесплатно.',
      fr: 'Obtenez {count, plural, one {# produit}} gratuitement.',
      de: 'Erhalten Sie das {count, plural, one {# Produkt}} kostenlos',
      es: 'Obtenga {count, plural, one {# producto}} gratis',
      pt: 'Receba {count, plural, one {# o produto}} gratuitamente.',
      zh: '免费获取{count, plural, one {# 产品}}',
    }
    for (const [ key, value ] of Object.entries(messages)) {
      expect(replacePluralVariables(value, key)).toEqual(value)
    }
  })

  it('should return passed message without changes if wrong variable template used #2', () => {
    const messages = {
      en: 'Get {count, plural , one {# product} other {# products} for free.',
      ru: 'Получить {count, plural , one {# продукт} other {# products} бесплатно.',
      fr: 'Obtenez {count, plural , one {# produit} other {# produits}} gratuitement.',
      de: 'Erhalten Sie das {count, plural , one {# Produkt} other {# Produkte}} kostenlos',
      es: 'Obtenga {count, plural , one {# producto}} gratis',
      pt: 'Receba {count, plural , one {# o produto}} gratuitamente.',
      zh: '免费获取{count, plural , one {# o 产品}}',
    }

    for (const [ key, value ] of Object.entries(messages)) {
      expect(replacePluralVariables(value, key)).toEqual(value)
    }
  })

  it('should return passed message without changes if wrong variable template used #3', () => {
    const messages = {
      en: 'Get {count, plurall, one {# product} other {# products}} for free.',
      ru: 'Получить {count, plurall, one {# продукт} other {# продукты}} бесплатно.',
      fr: 'Obtenez {count, plurall, one {# produit} other {# produits}} gratuitement.',
      de: 'Erhalten Sie das {count, plurall, one {# Produkt} other {# Produkte}} kostenlos',
      es: 'Obtenga {count, plurall, one {# producto}} gratis',
      pt: 'Receba {count, plurall, one {# o produto}} gratuitamente.',
      zh: '免费获取{count, plurall, one {# 产品}}',
    }

    for (const [ key, value ] of Object.entries(messages)) {
      expect(replacePluralVariables(value, key)).toEqual(value)
    }
  })

  it('should return "other" variable value if values not passed', () => {
    const messages = {
      en: 'Get {count, plural, one {# product} other {# products}} for free.',
      ru: 'Получить {count, plural, one {# продукт} other {# продукты}} бесплатно.',
      fr: 'Obtenez {count, plural, one {# produit} other {# des produits}} gratuitement.',
      de: 'Erhalten Sie das {count, plural, one {# Produkt} other {# Produkte}} kostenlos',
      es: 'Obtenga {count, plural, one {# producto} other {# productos}} gratis',
      pt: 'Receba {count, plural, one {# o produto} other {# produtos}} gratuitamente.',
      zh: '免费获得{count, plural, one {# 产品} other {# 产品}}',
    }
    const expectedMessages = {
      en: 'Get products for free.',
      ru: 'Получить продукты бесплатно.',
      fr: 'Obtenez des produits gratuitement.',
      de: 'Erhalten Sie das Produkte kostenlos',
      es: 'Obtenga productos gratis',
      pt: 'Receba produtos gratuitamente.',
      zh: '免费获得产品',
    }

    for (const [ key, value ] of Object.entries(messages)) {
      const expectedMessage = expectedMessages[key as keyof typeof expectedMessages]

      expect(replacePluralVariables(value, key)).toEqual(expectedMessage)
      expect(replacePluralVariables(value, key, {})).toEqual(expectedMessage)
      expect(replacePluralVariables(value, key, { count: null })).toEqual(expectedMessage)
      expect(replacePluralVariables(value, key, { count: undefined })).toEqual(expectedMessage)
    }
  })

  it('should return "one" variable', () => {
    const messages = {
      en: 'Get {count, plural, one {# product} other {# products}} for free.',
      ru: 'Получить {count, plural, one {# продукт} other {# продуктов}} бесплатно.',
      fr: 'Obtenez {count, plural, one {# produit} other {# produits}} gratuitement.',
      de: 'Erhalten Sie das {count, plural, one {# Produkt} other {# Produkte}} kostenlos.',
      es: 'Obtenga {count, plural, one {# producto} other {# productos}} gratis.',
      pt: 'Receba {count, plural, one {# produto} other {# produtos}} gratuitamente.',
      zh: '免费获得 {count, plural, one {# 产品} other {# 产品}}',
    }
    const expectedMessages = {
      en: 'Get 1 product for free.',
      ru: 'Получить 1 продукт бесплатно.',
      fr: 'Obtenez 1 produit gratuitement.',
      de: 'Erhalten Sie das 1 Produkt kostenlos.',
      es: 'Obtenga 1 producto gratis.',
      pt: 'Receba 1 produto gratuitamente.',
      zh: '免费获得 1 产品',
    }

    for (const [ key, value ] of Object.entries(messages)) {
      const expectedMessage = expectedMessages[key as keyof typeof expectedMessages]

      expect(replacePluralVariables(value, key, { count: 1 })).toEqual(expectedMessage)
    }
  })

  it('should return "other" variable', () => {
    const messages = {
      en: 'Get {count, plural, one {# product} other {# products}} for free.',
      ru: 'Получить {count, plural, one {# продукт} other {# продукта}} бесплатно.',
      fr: 'Obtenez {count, plural, one {# produit} other {# produits}} gratuitement.',
      de: 'Erhalten Sie das {count, plural, one {# Produkt} other {# Produkte}} kostenlos',
      es: 'Obtenga {count, plural, one {# producto} other {# productos}} gratis',
      pt: 'Receba {count, plural, one {# produto} other {# produtos}} gratuitamente.',
      zh: '免费获得 {count, plural, one {# 产品} other {# 产品}}。',
    }
    const expectedMessages = {
      en: 'Get 2.5 products for free.',
      ru: 'Получить 2.5 продукта бесплатно.',
      fr: 'Obtenez 2.5 produits gratuitement.',
      de: 'Erhalten Sie das 2.5 Produkte kostenlos',
      es: 'Obtenga 2.5 productos gratis',
      pt: 'Receba 2.5 produtos gratuitamente.',
      zh: '免费获得 2.5 产品。',
    }

    for (const [ key, value ] of Object.entries(messages)) {
      const expectedMessage = expectedMessages[key as keyof typeof expectedMessages]

      expect(replacePluralVariables(value, key, { count: 2.5 })).toEqual(expectedMessage)
    }
  })

  it('should replace multiple variables', () => {
    const messages = {
      en: `
        Get {count, plural, one {# product} other {# products}} for free.
        Get {amount, plural, one {one item} other {items}} for free.
      `,
      ru: `
        Получить {count, plural, one {# продукт} other {# продукта}} бесплатно.
        Получить {amount, plural, one {один элемент} other {# элемента}} бесплатно.
      `,
      fr: `
        Obtenez {count, plural, one {# produit} other {# produits}} gratuitement.
        Obtenez {amount, plural, one {un produit} other {# produits}} gratuitement.
      `,
      de: `
        Erhalten Sie das {count, plural, one {# Produkt} other {# Produkte}} kostenlos.
        Erhalten Sie das {amount, plural, one {ein Produkt} other {# Produkte}} kostenlos.
      `,
      es: `
        Obtenga {count, plural, one {# producto} other {# productos}} gratis.
        Obtenga {amount, plural, one {un producto} other {# productos}} gratis.
      `,
      pt: `
        Receba {count, plural, one {# produto} other {# produtos}} gratuitamente.
        Receba {amount, plural, one {um produto} other { produtos}} gratuitamente.
      `,
      zh: `
        免费获得 {count, plural, one {# 产品} other {# 产品}}。
        免费获得 {count, plural, one {一 产品} other { 产品}}。
      `,
    }

    const expectedMessages = {
      en: `
        Get 2 products for free.
        Get one item for free.
      `,
      ru: `
        Получить 2 продукта бесплатно.
        Получить один элемент бесплатно.
      `,
      fr: `
        Obtenez 2 produits gratuitement.
        Obtenez un produit gratuitement.
      `,
      de: `
        Erhalten Sie das 2 Produkte kostenlos.
        Erhalten Sie das ein Produkt kostenlos.
      `,
      es: `
        Obtenga 2 productos gratis.
        Obtenga un producto gratis.
      `,
      pt: `
        Receba 2 produtos gratuitamente.
        Receba um produto gratuitamente.
      `,
      zh: `
        免费获得 2 产品。
        免费获得  产品。
      `,
    }

    for (const [ key, value ] of Object.entries(messages)) {
      const expectedMessage = expectedMessages[key as keyof typeof expectedMessages]

      expect(replacePluralVariables(value, key, { count: 2, amount: 1 })).toEqual(expectedMessage)
    }
  })

  it('should return "few" variable or "others" if "few" does not exist', () => {
    const messages = {
      en: 'Get {count, plural, one {# product} few {few products} other {# products}} for free.',
      ru: 'Получить {count, plural, one {# продукт} few {# продукта} many {# продуктов}} бесплатно.',
      fr: 'Obtenez {count, plural, one {# produit} few {# plusieurs produits} other {# produits}} gratuitement.',
      de: 'Erhalten Sie das {count, plural, one {# Produkt} few {# mehrere Produkte} other {# Produkte}} kostenlos.',
      es: 'Obtenga {count, plural, one {# producto} few {# varios productos} other {# productos}} gratis',
      pt: 'Receba {count, plural, one {# produto} few {# vários productos} other {# produtos}} gratuitamente.',
      zh: '免费获得 {count, plural, one {# } few {# 产品} other {# 产品}}',
    }

    const expectedMessages = {
      en: 'Get 2 products for free.',
      ru: 'Получить 2 продукта бесплатно.',
      fr: 'Obtenez 2 produits gratuitement.',
      de: 'Erhalten Sie das 2 Produkte kostenlos.',
      es: 'Obtenga 2 productos gratis',
      pt: 'Receba 2 produtos gratuitamente.',
      zh: '免费获得 2 产品',
    }

    for (const [ key, value ] of Object.entries(messages)) {
      const expectedMessage = expectedMessages[key as keyof typeof expectedMessages]

      expect(replacePluralVariables(value, key, { count: 2 })).toEqual(expectedMessage)
    }
  })

})
