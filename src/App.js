import './App.css';
import PostList from './components/PostList';
import NotFound from './components/NotFound';
import PostDetail from './components/PostDetail';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<PostList />} />
          <Route path="/home" element={<PostList />} />
          <Route path="/dashboard" element={<PostList />} />
          <Route path="/posts/:postid" element={<PostDetail />} />
          <Route path="/notfound" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;