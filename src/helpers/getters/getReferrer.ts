import { ZeroAddress } from 'ethers'


const getReferrer = () => {
  return process.env.NEXT_PUBLIC_REFERRER || ZeroAddress
}


export default getReferrer
