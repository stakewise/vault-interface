const stripSpaces = (message: string) => (
  message
    .replace(/\s{2,}/g, ' ')
    .replace(/<br\s?\/>\s+/g, '<br />')
    .replace(/{\s+/, '{')
    .replace(/\s+}/, '}')
    .trim()
)


export default stripSpaces
