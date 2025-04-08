import methods from 'helpers/methods'


type Input = {
  url: string | readonly string[]
  variables: CreatedAtVariables
}

type CreatedAtQueryPayload = {
  vault: {
    createdAt: string
  }
}

type CreatedAtVariables = {
  address: string
}

const fetchCreatedAt = ({ url, variables }: Input) => {
  return methods.fetch<CreatedAtQueryPayload>(url, {
    method: 'POST',
    body: JSON.stringify({
      query: `
        query CreatedAt($address: ID!) {
          vault(id: $address) {
            createdAt
          }
        }
      `,
      variables,
    }),
  })
}


export default fetchCreatedAt
