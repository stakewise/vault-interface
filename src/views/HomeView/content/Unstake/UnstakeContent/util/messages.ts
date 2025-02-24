export default {
  queue: {
    en: 'Enters exit queue',
    ru: 'Входит в очередь на выход',
    fr: 'Entre dans la file de sortie',
    es: 'Entra en la cola de salida',
    pt: 'Entra na fila de saída',
    de: 'Tritt in die Austrittswarteschlange',
    zh: '进入退出队列',
  },
  exchanger: {
    en: 'Received instantly',
    ru: 'Получено мгновенно',
    fr: 'Reçu instantanément',
    es: 'Recibido instantáneamente',
    pt: 'Recebido instantaneamente',
    de: 'Sofort erhalten',
    zh: '立即收到',
  },
  tooltips: {
    exchanger: {
      en: `
        The amount of {depositToken} you receive instantly.
        The {mintToken} is swapped for {depositToken} through the Balancer exchange.
      `,
      ru: `
        Количество {depositToken}, которое вы получаете мгновенно.
        {mintToken} обменивается на {depositToken} через обменник Balancer.
      `,
      fr: `
        Le montant de {depositToken} que vous recevez instantanément.
        Le {mintToken} est échangé contre {depositToken} via l'exchange Balancer.
      `,
      es: `
        La cantidad de {depositToken} que recibes instantáneamente.
        El {mintToken} se intercambia por {depositToken} a través del intercambio Balancer.
      `,
      pt: `
        A quantidade de {depositToken} que você recebe instantaneamente.
        O {mintToken} é trocado por {depositToken} através da troca Balancer.
      `,
      de: `
        Die Menge an {depositToken}, die Sie sofort erhalten.
        Das {mintToken} wird über den Balancer-Exchange gegen {depositToken} getauscht.
      `,
      zh: `
        您即时收到的 {depositToken} 数量。
        {mintToken} 通过 Balancer 交易所交换为 {depositToken}。
      `,
    },
    rate: {
      en: 'The amount of {depositToken} you receive for each {mintToken}.',
      ru: 'Количество {depositToken}, которое вы получаете за каждый {mintToken}.',
      fr: 'Le montant de {depositToken} que vous recevez pour chaque {mintToken}.',
      es: 'La cantidad de {depositToken} que recibe por cada {mintToken}.',
      pt: 'A quantidade de {depositToken} que você recebe para cada {mintToken}.',
      de: 'Der Betrag von {depositToken}, den Sie für jeden {mintToken} erhalten.',
      zh: '每个 {mintToken} 您收到的 {depositToken} 数量。',
    },
  },
}
