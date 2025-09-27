// // import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
// // import { Home } from './pages/Home'
// // import { About } from './pages/About'
// // import { Work } from './pages/Work'
// // import { Contact } from './pages/Contact'

// // function App() {
// //   return (
// //     <Router>
// //       <Routes>
// //         <Route path="/" element={<Home />} />
// //         <Route path="/about" element={<About />} />
// //         <Route path="/work" element={<Work />} />
// //         <Route path="/contact" element={<Contact />} />
// //       </Routes>
// //     </Router>
// //   )
// // }

// // export default App

// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
// import { Home } from './pages/Home'
// import { About } from './pages/About'
// import { Work } from './pages/Work'
// import { Contact } from './pages/Contact'
// import { SmoothScrollNavigator } from './components/SmoothScrollNavigator'
// import './App.module.css'

// function App() {
//   return (
//     <Router>
//       <div className="appContainer">
//         <SmoothScrollNavigator />
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/about" element={<About />} />
//           <Route path="/work" element={<Work />} />
//           <Route path="/contact" element={<Contact />} />
//         </Routes>
//       </div>
//     </Router>
//   )
// }

// export default App
// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { SinglePage } from './pages/SinglePage'
import { SmoothScrollNavigator } from './components/SmoothScrollNavigator'
import './App.module.css'

function App() {
  return (
    <Router>
      <div className="appContainer">
        <SmoothScrollNavigator />
        <Routes>
          <Route path="/*" element={<SinglePage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
