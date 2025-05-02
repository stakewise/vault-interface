const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)

  if (result) {
    return result
      .filter((_, index) => index && index <= 3)
      .map((color) => parseInt(color, 16))
      .join(', ')
  }

  return null
}


module.exports = hexToRgb
