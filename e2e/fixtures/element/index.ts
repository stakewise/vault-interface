import { createCheckLink, CheckLink } from './checkLink'
import { createCheckText, CheckText } from './checkText'
import { createCheckVisibility, CheckVisibility } from './checkVisibility'


export type ElementFixture = {
  checkText: CheckText
  checkLink: CheckLink
  checkVisibility: CheckVisibility
}

const element: E2E.Fixture<ElementFixture> = async ({ page }, use) => {
  await use({
    checkText: createCheckText({ page }),
    checkLink: createCheckLink({ page }),
    checkVisibility: createCheckVisibility({ page }),
  })
}


export default element
