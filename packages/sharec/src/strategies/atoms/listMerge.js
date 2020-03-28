const listMergeAtom = atom => ({ current, upcoming, cached }) => {
  // TODO: what do with arrays with different length?
  if (current && upcoming === undefined) return current
  if (current === undefined && upcoming) return upcoming

  const resultLength = Math.max(current.length, upcoming.length)
  let result = new Array(resultLength)

  for (let i = 0; i < result.length; i++) {
    if (current[i] === undefined && upcoming[i]) {
      result[i] = upcoming[i]
      continue
    }

    if (current[i] && upcoming[i] === undefined) {
      result[i] = current[i]
      continue
    }

    result[i] = atom({
      current: current[i],
      upcoming: upcoming[i],
      cached: cached && cached[i],
    })
  }

  return result
}

module.exports = listMergeAtom
