import { Planning } from './Planning'
import { BigMote } from './BigMote'
import { Bookkeeping } from './Bookkeeping'

function App() {
  return (
    <>
      <BigMote>
        <h1>bookeater</h1>
      </BigMote>
      <BigMote>
        <Bookkeeping />
      </BigMote>
      <Planning />
    </>
  )
}

export default App
