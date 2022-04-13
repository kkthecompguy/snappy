import { BrowserRouter, Routes,  Route } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Chat from './pages/chat/Chat';
import SetAvatar from './pages/chat/SetAvatar';



function RoutesPages() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/' element={<Chat />} />
        <Route path='/set/avatar' element={<SetAvatar />} />
      </Routes>
    </BrowserRouter>
  )
}

export default RoutesPages;