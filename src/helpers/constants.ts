import * as constants from 'sw-helpers/constants'


const colors = [
  'dark',
  'light',
  'white',
  'black',
  'primary',
  'secondary',
  'background',
  'error',
  'warning',
  'success',
  'success-light',
  'primary-start',
  'primary-end',
  'secondary-start',
  'secondary-end',
] as const


export default {
  ...constants,
  colors,
}
