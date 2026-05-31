// App.jsx
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { SinglePage } from './pages/SinglePage'
import { SmoothScrollNavigator } from './components/SmoothScrollNavigator'
import Loader from './components/Loader/Loader'
import './App.module.css'

function App() {
  const [loadingDone, setLoadingDone] = useState(false)

  return (
    <>
      {!loadingDone && <Loader onComplete={() => setLoadingDone(true)} />}
      <Router>
        <div className="appContainer">
          <SmoothScrollNavigator />
          <Routes>
            <Route path="/*" element={<SinglePage />} />
          </Routes>
        </div>
      </Router>
    </>
  )
}

export default App
