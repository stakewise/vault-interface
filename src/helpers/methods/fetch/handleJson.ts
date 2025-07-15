const handleJson = <T = any>(json: any): T => {
  if (json?.errors?.length) {
    throw new Error(json.errors[0].message)
  }

  if (json?.data?._meta?.hasIndexingErrors) {
    throw new Error('Subgraph indexing error')
  }

  return (json.data ?? json) as T
}


export default handleJson
