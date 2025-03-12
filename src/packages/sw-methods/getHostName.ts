const getHostName = (): string => {
  return typeof window !== 'undefined' && window.location.host ? window.location.host : ''
}

export default getHostName
