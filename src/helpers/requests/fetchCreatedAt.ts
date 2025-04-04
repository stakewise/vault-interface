import methods from 'helpers/methods'


type CreatedAtQueryPayload = {
  vault: {
    createdAt: string
  }
}

type CreatedAtVariables = {
  address: string
}

const fetchCreatedAt = ({ url, variables }: { url: string, variables: CreatedAtVariables }) => {
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
