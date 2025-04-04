const prefix0x = {
  add: (str: string): string => str.startsWith('0x') ? str : `0x${str}`,
  remove: (str: string) => str.startsWith('0x') ? str.replace(/^0x/, '') : str,
}


export default prefix0x
