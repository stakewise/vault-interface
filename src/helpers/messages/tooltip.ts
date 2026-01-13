export default {
  queue: {
    en: 'The amount of {token} that enters the exit queue.',
    ru: 'Количество {token}, которое попадает в очередь выхода.',
    fr: 'Le montant de {token} qui entre dans la file de sortie.',
    es: 'La cantidad de {token} que entra en la cola de salida.',
    pt: 'A quantidade de {token} que entra na fila de saída.',
    de: 'Der Betrag von {token}, der in die Ausstiegswarteschlange gelangt.',
    zh: '{token} 进入退出队列的数量。',
  },
  gas: {
    en: 'The fee (in {nativeToken}) you need to pay for the transaction to be confirmed by the network.',
    ru: 'Комиссия (в {nativeToken}), которую вам нужно заплатить, чтобы транзакция была подтверждена сетью.',
    fr: 'Les frais (en {nativeToken}) que vous devez payer pour que la transaction soit confirmée par le réseau.',
    es: 'La tarifa (en {nativeToken}) que debe pagar para que la transacción sea confirmada por la red.',
    pt: 'A taxa (em {nativeToken}) que você precisa pagar para que a transação seja confirmada pela rede.',
    de: 'Die Gebühr (in {nativeToken}), die Sie zahlen müssen, damit die Transaktion vom Netzwerk bestätigt wird.',
    zh: '您需要支付的费用（以 {nativeToken} 计），以便网络确认交易。',
  },
  unboostPenalties: {
    en: 'Please claim your unboost request as soon as it becomes claimable to avoid penalties.',
    ru: 'Пожалуйста, заявите о своем запросе на анбуст сразу после того, как он станет доступным для получения, чтобы избежать штрафов.',
    fr: 'Veuillez réclamer votre demande de déboost dès qu\'elle devient réclamable pour éviter des pénalités.',
    es: 'Por favor, reclame su solicitud de desempeño tan pronto como sea reclamable para evitar penalizaciones.',
    pt: 'Por favor, reivindique seu pedido de desimpulsionamento assim que se tornar reivindicável para evitar penalidades.',
    de: 'Bitte fordern Sie Ihre Entboost-Anfrage ein, sobald sie einforderbar ist, um Strafen zu vermeiden.',
    zh: '请在您的解除提升请求可以认领后尽快认领，以免受到惩罚。',
  },
  earnedRewards: {
    en: 'The total rewards earned since you started staking. Rewards are updated every 24 hours.',
    ru: 'Общие награды, полученные с момента начала стейкинга. Награды обновляются каждые 24 часа.',
    fr: 'Les récompenses totales gagnées depuis que vous avez commencé le staking. Les récompenses sont mises à jour toutes les 24 heures.',
    es: 'Las recompensas totales ganadas desde que comenzaste a hacer staking. Las recompensas se actualizan cada 24 horas.',
    pt: 'As recompensas totais ganhas desde que você começou a fazer staking. As recompensas são atualizadas a cada 24 horas.',
    de: 'Die gesamten Belohnungen, die seit Beginn des Stakings verdient wurden. Belohnungen werden alle 24 Stunden aktualisiert.',
    zh: '自您开始进行Staking以来，总奖励收益。奖励每24小时更新一次。',
  },
  boostDisabled: {
    en: `
      The current unboost request must be <CustomComponent /> before boosting again
    `,
    ru: `
      Текущий запрос на анбуст должен быть <CustomComponent /> перед повторным бустом
    `,
    fr: `
      La demande de débouclage actuelle doit être <CustomComponent /> avant de booster à nouveau.
    `,
    es: `
      La solicitud de despotenciar actual debe ser <CustomComponent /> antes de potenciar nuevamente.
    `,
    pt: `
      A solicitação de despotencialização atual deve ser <CustomComponent /> antes de potencializar novamente.
    `,
    de: `
      Die aktuelle Entboost-Anforderung muss <CustomComponent /> bevor Sie erneut boosten können.
    `,
    zh: `
      当前的取消加速请求必须在再次加速之前 <CustomComponent />。
    `,
  },
  unboostDisabled: {
    en: `
      The current unboost request must be <CustomComponent /> before unboosting again
    `,
    ru: `
      Текущий запрос на анбуст должен быть <CustomComponent /> перед повторным анбустом
    `,
    fr: `
      La demande de désactivation actuelle doit être <CustomComponent /> avant de pouvoir désactiver à nouveau.
    `,
    es: `
      La solicitud de desactivación actual debe ser <CustomComponent /> antes de volver a desactivar.
    `,
    pt: `
      A solicitação de desativação atual deve ser <CustomComponent /> antes de desativar novamente.
    `,
    de: `
      Die aktuelle Entboosting-Anfrage muss <CustomComponent /> sein, bevor Sie erneut entboosten können.
    `,
    zh: `
      当前的取消提升请求必须是<CustomComponent />后才能再次取消提升
    `,
  },
  unstakeQueueV1: {
    en: `
      Currently it takes up to {queueDays} days for the validator(s) to exit and {depositToken} to become claimable.
      You continue to earn staking rewards while the validators are in exit queue.
    `,
    ru: `
      В настоящее время выход валидатора(ов) может занять до {queueDays} дней,
      прежде чем {depositToken} станет доступным для получения. Вы продолжаете получать награды за стейкинг,
      пока валидаторы находятся в очереди на выход.
    `,
    fr: `
      Actuellement, il faut jusqu'à {queueDays} jours pour que le(s) validateur(s) sorte(nt) et que le {depositToken} devienne réclamable.
      Vous continuez à gagner des récompenses de staking tant que les validateurs sont dans la file d'attente de sortie.
    `,
    es: `
      Actualmente, tomar hasta {queueDays} días para que el/los validador(es) salgan y el {depositToken} se pueda reclamar.
      Continúa ganando recompensas de staking mientras los validadores están en la cola de salida.
    `,
    pt: `
      Atualmente, leva até {queueDays} dias para que o(s) validador(es) saia(m) e o {depositToken} se torne disponível para reivindicação.
      Você continua a ganhar recompensas de staking enquanto os validadores estão na fila de saída.
    `,
    de: `
      Derzeit dauert es bis zu {queueDays} Tage, bis die Validatoren austreten und {depositToken} eingefordert werden kann.
      Sie verdienen weiterhin Staking-Belohnungen, während sich die Validatoren in der Austrittswarteschlange befinden.
    `,
    zh: `
      当前，验证器退出并且 {depositToken} 可被领取可能需要长达 {queueDays} 天
      在验证器处于退出队列时，您将继续获得质押奖励。
    `,
  },
  unstakeQueueV2: {
    en: `
      Currently it takes up to {queueDays} days for the validator(s) to exit and {depositToken} to become claimable.
    `,
    ru: `
      В настоящее время выход валидатора(ов) занимает до {queueDays} дней, и {depositToken} становится доступным для получения.
    `,
    fr: `
      Actuellement, il faut jusqu'à {queueDays} jours pour que le(s) validateur(s) se retire(nt) et que {depositToken} devienne réclamable.
    `,
    es: `
      Actualmente se tarda hasta {queueDays} días para que el/los validador(es) salgan y {depositToken} se pueda reclamar.
    `,
    pt: `
      Atualmente, leva até {queueDays} dias para que o(s) validador(es) saia(m) e {depositToken} se torne disponível para reivindicação.
    `,
    de: `
      Derzeit dauert es bis zu {queueDays} Tage, bis der/die Validator(en) aussteigt/aussteigen und {depositToken} beansprucht werden kann.
    `,
    zh: `
      目前，验证器退出并让 {depositToken} 可申领需要最多 {queueDays} 天。
    `,
  },
  duration: {
    en: 'It may take up to {queueDays, plural, one {# day} other {# days}} for an exit request to be processed on the {network} network.',
    ru: 'Обработка запроса на выход в сети {network} может занять до {queueDays, plural, one {# дня} other {# дней}}.',
    fr: 'Il peut falloir jusqu\'à {queueDays, plural, one {# jour} other {# jours}} pour qu\'une demande de sortie soit traitée sur le réseau {network}.',
    es: 'Puede tardar hasta {queueDays, plural, one {# día} other {# días}} en procesarse una solicitud de salida en la red {network}.',
    pt: 'Pode levar até {queueDays, plural, one {# dia} other {# dias}} para que um pedido de saída seja processado na rede {network}.',
    de: 'Es kann bis zu {queueDays, plural, one {# Tag} other {# Tagen}} dauern, bis eine Ausstiegsanfrage im Netzwerk {network} bearbeitet wird.',
    zh: '{network}网络上的退出请求可能需要最多{queueDays, plural, one {# 天} other {# 天}}来处理。',
  },
  avgDuration: {
    en: 'On average, exits over the past month took {avgQueueDays, plural, one {# day} other {# days}} to complete',
    ru: 'В среднем, выходы за прошлый месяц занимали {avgQueueDays, plural, one {# день} few {# дня} other {# дней}} для завершения',
    fr: 'En moyenne, les sorties du mois dernier ont pris {avgQueueDays, plural, one {# jour} other {# jours}} pour se compléter',
    es: 'En promedio, las salidas del último mes tomaron {avgQueueDays, plural, one {# día} other {# días}} en completarse',
    pt: 'Em média, as saídas do último mês levaram {avgQueueDays, plural, one {# dia} other {# dias}} para serem concluídas',
    de: 'Im Durchschnitt dauerten die Ausstiege im letzten Monat {avgQueueDays, plural, one {# Tag} other {# Tage}}',
    zh: '平均而言，上个月完成退出耗时 {avgQueueDays, plural, one {# 天} other {# 天}}',
  },
}
