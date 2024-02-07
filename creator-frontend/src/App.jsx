import { useState, useEffect } from 'react'
import './App.css'
import {Route, Routes} from 'react-router-dom'
import {createContext} from 'react'
import Login from './pages/Login'
import Home from './pages/Home'
import Post from './pages/Post'
import NewPost from './pages/NewPost'
import SignUp from './pages/Signup'
import Profile from './pages/Profile'
import Protected from './pages/Protected'


export const ShopContext = createContext({
  posts: [],
  currentPost: '',
});

function App() {


  const [noReduxPosts, noReduxSetPosts] = useState([]);
  const [currentPost, setCurrentPost] = useState('');

 return (
  <ShopContext.Provider value={{noReduxPosts, currentPost}}>
  <div>
    <Routes>
      <Route path='/login' element={<Login/>}></Route>
      <Route path='/' element={<Home setPosts={noReduxSetPosts} posts={noReduxPosts} handleSelect={setCurrentPost}/>}></Route>
      <Route path={`/posts/:id`} element={<Post postData={noReduxPosts}/>}></Route>
      <Route path='/new-post' element={<NewPost/>}></Route>
      <Route path='/signup' element={<SignUp/>}></Route>
      <Route path='/profile' element={<Profile/>}></Route>
      <Route path='/protected' element={<Protected/>}></Route>

    </Routes>
  </div>
  </ShopContext.Provider>
 );
}

export default App
