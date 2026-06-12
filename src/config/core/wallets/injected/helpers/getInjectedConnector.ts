import type { InjectedParameters } from '@wagmi/connectors'


const getInjectedConnector = (values: InjectedParameters) => async (_: any, options: GetConnectorOptions) => {
  const InjectedConnector = (await import('../../../connectors/InjectedConnector')).default

  return new InjectedConnector({ ...values, ...options })
}


export default getInjectedConnector
