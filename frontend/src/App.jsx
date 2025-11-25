import { Toaster} from 'sonner';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import HomePage from './pages/HomePage';
import NotFound from './pages/NotFound';
import CuteBot from './components/CuteBot';

function App() {
  return (
    <>
 <Toaster richColors/>

      <BrowserRouter>
              <CuteBot />
        <Routes>
          <Route 
          path='/' 
          element={<HomePage/>}
          />
          <Route 
          path='*' 
          element={<NotFound/>}
          />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
