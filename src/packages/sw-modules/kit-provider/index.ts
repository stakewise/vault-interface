import initContext from 'helpers/initContext'


type Context = {
  imagesUrls: Record<string, string>
}

const initialContext = {
  imagesUrls: {},
}

const {
  Provider,
  useData,
  useInit,
} = initContext<Context, Context>(initialContext, ({ imagesUrls }) => ({
  imagesUrls,
}))


export default {
  Provider,
  useData,
  useInit,
}
