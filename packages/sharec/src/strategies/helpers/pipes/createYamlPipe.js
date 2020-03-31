const flow = require('lodash/flow')
const toYaml = require('./toYaml')
const fromYaml = require('./fromYaml')

const createYamlPipe = (...handlers) => params => {
  const isSingleQuote = params.current && /'/g.test(params.current)
  const pipe = flow(
    fromYaml,
    ...handlers,
    toYaml,
  )
  const result = pipe(params)

  if (isSingleQuote) return result.replace(/"/m, "'")

  return result.replace(/'/m, '"')
}

module.exports = createYamlPipe
