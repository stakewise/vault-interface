export default {
  vault: {
    en: 'Vault',
    ru: 'Волт',
    fr: 'Vault',
    es: 'Vault',
    pt: 'Vault',
    de: 'Vault',
    zh: 'Vault',
  },
  tooltips: {
    notProfitable: {
      en: `
        Your boosted APY is currently lower than the {type} APY,
        which may be due to an unclaimed unboost position, a lowered {type} APY, 
        or an increased borrow APY on Aave.
        Please claim your unboost request or consider unboosting if the APY does not normalize in the next few days.
      `,
      ru: `
        Ваш увеличенный APY в настоящее время ниже, чем {type} APY, что может быть связано с неполученной позицией unboost, 
        пониженным {type} APY или увеличенным заемным APY на Aave. Пожалуйста, 
        запросите вашу unboost позицию или рассмотрите возможность анстейкинга, 
        если APY не нормализуется в ближайшие несколько дней.
      `,
      fr: `
        Votre APY boosté est actuellement inférieur au APY {type}, 
        ce qui peut être dû à une position unboost non réclamée, un APY {type} abaissé, 
        ou un APY d'emprunt accru sur Aave. 
        Veuillez réclamer votre demande d'unboost ou envisagez de débooster si l'APY ne se normalise pas dans les prochains jours.
      `,
      es: `
        Su APY potenciado actualmente es inferior al APY de {type}, 
        lo que puede deberse a una posición de unboost no reclamada, 
        un APY de {type} reducido, o un APY de préstamo aumentado en Aave. 
        Por favor, reclame su solicitud de unboost o considere desboostear si el APY no se normaliza en los próximos días.
      `,
      pt: `
        O seu APY impulsionado está atualmente inferior ao APY {type}, 
        o que pode ser devido a uma posição de unboost não reclamada, um APY {type} reduzido, 
        ou um aumento no APY de empréstimo na Aave. Por favor, 
        solicite o seu pedido de unboost ou considere despotencializar se o APY não normalizar nos próximos dias.
      `,
      de: `
        Ihr erhöhter APY ist derzeit niedriger als der {type} APY, 
        was auf eine nicht eingelöste Unboost-Position, 
        einen gesenkten {type} APY oder einen erhöhten Borrow-APY bei Aave zurückzuführen sein kann. 
        Bitte fordern Sie Ihre Unboost-Anfrage an oder ziehen Sie einen Unboost in Betracht, 
        wenn sich der APY in den nächsten Tagen nicht normalisiert.
      `,
      zh: `
        您的提升后 APY 目前低于 {type} APY，
        这可能是由于未领取的未提升头寸、降低的 {type} APY 或 Aave 上增加的借贷 APY。请领取您的未提升申请或考虑解除提升，
        如果 APY 在接下来的几天内未恢复正常。
      `,
    },
    dangerous: {
      en: `
        Your boosted APY is currently negative, which may be due to an unclaimed unboost position, 
        a lowered {type} APY, or an increased borrow APY on Aave. 
        Please claim your unboost request or consider unboosting if the APY does not normalize in the next few days.
      `,
      ru: `
        Ваш увеличенный APY в настоящее время отрицательный, 
        что может быть связано с неотклоненной позицией анбуст, 
        снижением APY {type} или увеличением APY заимствования на Aave. 
        Пожалуйста, получите ваш запрос на анбуст или рассмотрите возможность анбуста, 
        если APY не нормализуется в ближайшие несколько дней.
      `,
      fr: `
        Votre APY boosté est actuellement négatif, ce qui peut être dû à une position non réclamée de dé-boost, 
        à un APY {type} réduit, ou à un APY d'emprunt accru sur Aave. 
        Veuillez réclamer votre demande de dé-boost ou envisagez de vous dé-booster si l'APY ne se normalise pas dans les prochains jours.
      `,
      es: `
        Su APY potenciado actualmente es negativo, lo que puede deberse a una posición de desaprovechamiento no reclamada, 
        a un APY {type} reducido, o a un APY de préstamo aumentado en Aave. 
        Por favor, reclame su solicitud de desaprovechamiento o considere desaprovechar si el APY no se normaliza en los próximos días.
      `,
      pt: `
        Seu APY aumentado está atualmente negativo, o que pode ser devido a uma posição de despotencialização não reivindicada, 
        uma redução no APY {type} ou um aumento no APY de empréstimo na Aave. 
        Por favor, reivindique sua solicitação de despotencialização 
        ou considere despotencializar se o APY não se normalizar nos próximos dias.
      `,
      de: `
        Ihr erhöhter APY ist derzeit negativ, was auf eine nicht beanspruchte Deboost-Position, 
        einen verringerten {type} APY oder einen erhöhten Borrow-APY auf Aave zurückzuführen sein könnte. 
        Bitte beantragen Sie Ihre Deboost-Anforderung oder ziehen Sie in Betracht, die Deboost-Position aufzulösen, 
        falls sich der APY in den nächsten Tagen nicht normalisiert.
      `,
      zh: `
        您的增强 APY 目前为负，这可能是由于未领取的取消增强头寸、
        降低的 {type} APY 或增加的 Aave 借贷 APY。请领取您的取消增强请求，或在 APY 在未来几天内未能正常化时考虑取消增强。
      `,
    },
  },
}
