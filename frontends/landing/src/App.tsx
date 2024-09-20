import { Planning } from './Planning'
import { TimekeepingV1 } from './TimekeepingV1'
import { TimekeepingV2 } from './TimekeepingV2'

function App() {
  return (
    <>
      {location.pathname === '/v1' ? <TimekeepingV1 /> : <TimekeepingV2 />}
      <Planning />
    </>
  )
}

export default App
