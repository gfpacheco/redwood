import camelcase from 'camelcase'
import pluralize from 'pluralize'

import {
  templateForComponentFile,
  createYargsForComponentGeneration,
} from '../helpers'

export const files = async ({ name, model, ...rest }) => {
  const componentName = camelcase(pluralize(name))
  const relationFields = model.fields
    .filter((field) => field.kind === 'object')
    .map((field) => field.name)
  const templateVars = { relationFields, ...rest }
  const serviceFile = templateForComponentFile({
    name,
    componentName,
    apiPathSection: 'services',
    templatePath: 'service/service.js.template',
    templateVars,
  })
  const testFile = templateForComponentFile({
    name,
    componentName,
    extension: '.test.js',
    apiPathSection: 'services',
    templatePath: 'service/test.js.template',
    templateVars,
  })

  // Returns
  // {
  //    "path/to/fileA": "<<<template>>>",
  //    "path/to/fileB": "<<<template>>>",
  // }
  return [serviceFile, testFile].reduce((acc, [outputPath, content]) => {
    return {
      [outputPath]: content,
      ...acc,
    }
  }, {})
}

export const builder = {
  crud: { type: 'boolean', default: false, desc: 'Create CRUD functions' },
  force: { type: 'boolean', default: false },
}

export const { command, desc, handler } = createYargsForComponentGeneration({
  componentName: 'service',
  filesFn: files,
})
