const getArrUniqueItems = <T>(arr: T[], uniqueId: keyof T): T[] => {
  const itemsMap = new Map(arr.map((item) => [ item[uniqueId], item ])).values()

  return Array.from(itemsMap)
}


export default getArrUniqueItems
