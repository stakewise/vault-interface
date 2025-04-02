const getOriginHostName = (): string => {
  return typeof window !== 'undefined' && window.location.origin ? window.location.origin : ''
}

export default getOriginHostName
