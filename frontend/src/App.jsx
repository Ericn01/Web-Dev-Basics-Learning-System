import { useState } from 'react'
import './App.css'
import FaqComponent from './components/FaqComponent'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <FaqComponent/>
    </>
  )
}

export default App
