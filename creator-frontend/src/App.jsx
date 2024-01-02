import { useState, useEffect } from 'react'
import './App.css'
import {Route, Routes} from 'react-router-dom'
import {createContext} from 'react'
import Login from './pages/Login'
import Home from './pages/Home'
import Post from './pages/Post'
import NewPost from './pages/NewPost'

export const ShopContext = createContext({
  posts: [],
  currentPost: '',
});

function App() {


  const [posts, setPosts] = useState([]);
  const [currentPost, setCurrentPost] = useState('');
console.log(posts);
 return (
  <ShopContext.Provider value={{posts, currentPost}}>
  <div>
    <Routes>
      <Route path='/login' element={<Login/>}></Route>
      <Route path='/' element={<Home setPosts={setPosts} posts={posts} handleSelect={setCurrentPost}/>}></Route>
      <Route path={`/posts/:id`} element={<Post postData={posts}/>}></Route>
      <Route path='/new-post' element={<NewPost/>}></Route>
    </Routes>
  </div>
  </ShopContext.Provider>
 );
}

export default App
