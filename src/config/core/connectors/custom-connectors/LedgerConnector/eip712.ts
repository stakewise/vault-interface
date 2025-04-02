import { AbiCoder, keccak256 } from 'ethers'


type Types = { [key: string]: any }

const dependencies = (primaryType: string, found: any[] = [], types: Types = {}) => {
  if (found.includes(primaryType)) {
    return found
  }

  if (types[primaryType] === undefined) {
    return found
  }

  found.push(primaryType)

  for (let field of types[primaryType]) {
    for (let dep of dependencies(field.type, found)) {
      if (!found.includes(dep)) {
        found.push(dep)
      }
    }
  }

  return found
}

const encodeType = (primaryType: string, types: Types) => {
  let result = ''
  let deps = dependencies(primaryType)

  deps = deps.filter((t) => t !== primaryType)
  deps = [ primaryType ].concat(deps.sort())

  for (let type of deps) {
    if (!types[type]) {
      throw new Error(
        `Type '${type}' not defined in types (${JSON.stringify(types)})`
      )
    }

    const typeNames = types[type]
      .map(({ name, type }: any) => `${type} ${name}`)
      .join(',')

    result += `${type}(${typeNames})`
  }

  return result
}

const typeHash = (primaryType: string, types: Types) => (
  keccak256(Buffer.from(encodeType(primaryType, types)))
)

export const encodeData = (data: any, primaryType: string, types: Types = {}) => {
  const encTypes = []
  const encValues = []

  encTypes.push('bytes32')
  encValues.push(typeHash(primaryType, types))

  for (let field of types[primaryType]) {
    let value = data[field.name]

    if (field.type === 'string' || field.type === 'bytes') {
      encTypes.push('bytes32')

      value = keccak256(Buffer.from(value))
      encValues.push(value)
    }
    else if (types[field.type] !== undefined) {
      value = keccak256(Buffer.from(encodeData(value, field.type, types)))

      encTypes.push('bytes32')
      encValues.push(value)
    }
    else if (field.type.lastIndexOf(']') === field.type.length - 1) {
      throw new Error('Arrays currently unimplemented in encodeData')
    }
    else {
      encTypes.push(field.type)
      encValues.push(value)
    }
  }

  return AbiCoder.defaultAbiCoder().encode(encTypes, encValues)
}

export const structHash = (typedData: any, primaryType: string, data: any) => (
  keccak256(Buffer.from(encodeData(data, primaryType, typedData.types)))
)
