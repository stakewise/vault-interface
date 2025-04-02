const downloadFile = (link: string, fileName: string) => {
  const linkElement = document.createElement('a')

  linkElement.rel = 'noreferrer nofollow'
  linkElement.download = fileName
  linkElement.target = '_blank'
  linkElement.href = link

  document.body.appendChild(linkElement)
  linkElement.click()
  document.body.removeChild(linkElement)
}


export default downloadFile
