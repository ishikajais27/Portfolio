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
        <div
          className="appContainer"
          style={{
            opacity: loadingDone ? 1 : 0,
            transform: loadingDone ? 'translateY(0px)' : 'translateY(28px)',
            transition: loadingDone
              ? 'opacity 1.1s cubic-bezier(0.22, 1, 0.36, 1), transform 1.1s cubic-bezier(0.22, 1, 0.36, 1)'
              : 'none',
            pointerEvents: loadingDone ? 'all' : 'none',
          }}
        >
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
