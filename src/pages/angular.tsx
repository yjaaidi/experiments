import React, { useEffect, useState } from 'react'
import { HelloModule } from '../components/hello.component'
import { renderScam } from '../components/render-scam'

export function isBrowser() {
  try {
    return window != null
  } catch {
    return false
  }
}

export default () => {
  const [content, setContent] = useState('')

  useEffect(() => {
    if (!isBrowser()) {
      renderScam(HelloModule, { title: 'test' }).then(setContent)
    }
  }, [])

  return (
    <div>
      <h1>Welcome</h1>
      <div>{isBrowser() ? 'YES' : 'NO'}</div>
      {/* <div dangerouslySetInnerHTML={{__html: content}}></div> */}
      <div>{content}</div>
    </div>
  )
}
