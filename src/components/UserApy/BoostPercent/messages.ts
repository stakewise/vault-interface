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
        заберите вашу unboost позицию или рассмотрите возможность unboost,
        если APY не нормализуется в ближайшие несколько дней.
      `,
      fr: `
        Votre APY boosté est actuellement inférieur au APY {type},
        ce qui peut être dû à une position unboost non réclamée, un APY {type} abaissé,
        ou un APY d'emprunt accru sur Aave.
        Veuillez réclamer votre demande d'unboost ou envisager un unboost si l'APY ne se normalise pas dans les prochains jours.
      `,
      es: `
        Su APY con Boost actualmente es inferior al APY de {type},
        lo que puede deberse a una posición de unboost no reclamada,
        un APY de {type} reducido, o un APY de préstamo aumentado en Aave.
        Por favor, reclame su solicitud de unboost o considere hacer unboost si el APY no se normaliza en los próximos días.
      `,
      pt: `
        O seu APY com Boost está atualmente inferior ao APY {type},
        o que pode ser devido a uma posição de unboost não reclamada, um APY {type} reduzido,
        ou um aumento no APY de empréstimo na Aave. Por favor,
        reclame o seu pedido de unboost ou considere fazer unboost se o APY não normalizar nos próximos dias.
      `,
      de: `
        Ihr erhöhter APY ist derzeit niedriger als der {type} APY, 
        was auf eine nicht eingelöste Unboost-Position, 
        einen gesenkten {type} APY oder einen erhöhten Borrow-APY bei Aave zurückzuführen sein kann. 
        Bitte fordern Sie Ihre Unboost-Anfrage an oder ziehen Sie einen Unboost in Betracht, 
        wenn sich der APY in den nächsten Tagen nicht normalisiert.
      `,
      zh: `
        您的Boost APY目前低于{type} APY，
        这可能是由于未领取的unboost头寸、降低的{type} APY或Aave上增加的借贷APY。
        请领取您的unboost申请，或在APY在接下来的几天内未恢复正常时考虑进行unboost。
      `,
    },
    dangerous: {
      en: `
        Your boosted APY is currently negative, which may be due to an unclaimed unboost position, 
        a lowered {type} APY, or an increased borrow APY on Aave. 
        Please claim your unboost request or consider unboosting if the APY does not normalize in the next few days.
      `,
      ru: `
        Ваш Boost APY в настоящее время отрицательный,
        что может быть связано с неполученной позицией unboost,
        снижением APY {type} или увеличением APY заимствования на Aave.
        Пожалуйста, заберите ваш запрос на unboost или рассмотрите возможность unboost,
        если APY не нормализуется в ближайшие несколько дней.
      `,
      fr: `
        Votre APY boosté est actuellement négatif, ce qui peut être dû à une position d'unboost non réclamée,
        à un APY {type} réduit, ou à un APY d'emprunt accru sur Aave.
        Veuillez réclamer votre demande d'unboost ou envisager un unboost si l'APY ne se normalise pas dans les prochains jours.
      `,
      es: `
        Su APY con Boost actualmente es negativo, lo que puede deberse a una posición de unboost no reclamada,
        a un APY {type} reducido, o a un APY de préstamo aumentado en Aave.
        Por favor, reclame su solicitud de unboost o considere hacer unboost si el APY no se normaliza en los próximos días.
      `,
      pt: `
        Seu APY com Boost está atualmente negativo, o que pode ser devido a uma posição de unboost não reivindicada,
        uma redução no APY {type} ou um aumento no APY de empréstimo na Aave.
        Por favor, reivindique sua solicitação de unboost
        ou considere fazer unboost se o APY não se normalizar nos próximos dias.
      `,
      de: `
        Ihr Boost-APY ist derzeit negativ, was auf eine nicht beanspruchte Unboost-Position,
        einen verringerten {type} APY oder einen erhöhten Borrow-APY auf Aave zurückzuführen sein könnte.
        Bitte fordern Sie Ihre Unboost-Anfrage an oder ziehen Sie einen Unboost in Betracht,
        falls sich der APY in den nächsten Tagen nicht normalisiert.
      `,
      zh: `
        您的Boost APY目前为负，这可能是由于未领取的unboost头寸、
        降低的{type} APY或增加的Aave借贷APY。请领取您的unboost请求，或在APY未来几天内未能恢复正常时考虑unboost。
      `,
    },
  },
}
