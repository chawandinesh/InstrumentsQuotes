import {lazy,Suspense} from 'react'
import { Route } from 'react-router'
import { HashRouter as Router,Routes } from 'react-router-dom'
// import { Instruments } from '../pages/instruments'
import {Navigate} from 'react-router-dom'

const Instruments = lazy(() => import("../pages/instruments"))
const Quotes = lazy(() => import("../pages/quotes"))

const AppRoutes = () => {
  return (
    <Suspense fallback={<p>Loading</p>}>
        <Router>
            <Routes>
                <Route path='/instruments' element={<Instruments/>}/>
                <Route path='/quotes' element={<Quotes/>}/>
                <Route path="/" element={<Navigate to="/instruments"/>}/>
            </Routes>
        </Router>
    </Suspense>
  )
}

export default AppRoutes