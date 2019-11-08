import React from "react"


export default ({pageContext}) => {
  return <div>
    <h1>TITLE</h1>
    <div dangerouslySetInnerHTML={{__html: pageContext.html}}></div>
  </div>
}