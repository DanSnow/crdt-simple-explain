import { useEffect, useState } from 'react'
import { crdt } from './global'
import { JSONTree } from 'react-json-tree'

export function DevTools() {
  const [state, setState] = useState(null as any)
  useEffect(() => {
    crdt.onUpdate(() =>
      setState({
        events: crdt.events,
        lastSyncClock: crdt.lastSyncClock,
      }),
    )
  }, [])

  return <JSONTree data={state} />
}
