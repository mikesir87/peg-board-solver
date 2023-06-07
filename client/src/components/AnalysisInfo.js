const AnalysisInfo = ({ analysis }) => {
  if (!analysis) return null;
  if (analysis.paths.toOne.length === 0) {
    return "There is no chance to be left with only one peg. Sorry!"
  }

  const totalCount = analysis.paths.toOne.reduce((acc, curr) => acc + curr.count, 0);

  const description = analysis.paths.toOne.length === 1 ?
    `There is only one next step that will let you get to one peg (${totalCount} paths from there)`
    : `There are ${analysis.paths.toOne.length} next steps that will let you get to one peg (${totalCount} total paths from there)`

  return (
    <>
      <p>{ description }</p>
      <h4>Move Info</h4>
      <p>The following next step(s) will get you to one peg...</p>
      <ul>
        { analysis.paths.toOne.map(path => (
          <li key={path.hash}>
            {path.description} ({path.count} paths)
          </li>
        ))}
      </ul>
    </>
  )
};

export default AnalysisInfo;