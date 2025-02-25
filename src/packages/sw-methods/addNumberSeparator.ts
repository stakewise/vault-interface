const addNumberSeparator = (value: string) => {
  var reverseArray = value.split('').reverse()

  const changedArray = reverseArray.reduce((acc, number, index) => {
    if (index && index % 3 === 0) {
      return [ ...acc, ',', number ]
    }

    return [ ...acc, number ]
  }, [] as string[])

  return changedArray.reverse().join('')
}


export default addNumberSeparator
