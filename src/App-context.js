import {createContext, useContext, useState} from "react";
import {PostsProvider, usePost} from './PostContext'
import {faker} from "@faker-js/faker";
import Test from "./Test";

function createRandomPost() {
  return {
    title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
    body: faker.hacker.phrase(),
  };
}

function App() {
  return (
       <PostsProvider>
         <section>
           <Button/>
           <Header/>
           <Main/>
           <Archive/>
           <Footer/>
         </section>
       </PostsProvider>
  );
}

function Button() {
  const {handleToggleFakeDark, isFakeDark} = usePost();
  return (
       <button
            onClick={handleToggleFakeDark}
            className="btn-fake-dark-mode"
       >
         {isFakeDark ? "☀️" : "🌙"}
       </button>
  )
}

function Header() {
  const {handleClearPosts, posts} = usePost();
  return (
       <header>
         <h1><span>⚛️</span>The Atomic Blog </h1>
         <div>
           <p>🚀 {posts.length} atomic posts found</p>
           <SearchPosts/>
           <button onClick={handleClearPosts}>Clear posts</button>
         </div>
       </header>
  );
}

function SearchPosts() {
  const {query, handleQuery} = usePost();
  return (
       <input value={query} placeholder="Search posts..."
              onChange={(e) => handleQuery(e.target.value)}/>
  );
}

function Main() {
  return (
       <main>
         <FormAddPost/>
         <section><List/></section>
       </main>
  );
}

function FormAddPost() {
  const {handleAddPost} = usePost();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const handleSubmit = function (e) {
    e.preventDefault();
    if (!body || !title) return;
    handleAddPost({title, body});
    setTitle("");
    setBody("");
  };

  return (
       <form onSubmit={handleSubmit}>
         <input value={title} placeholder="Post title"
                onChange={(e) => setTitle(e.target.value)}/>
         <textarea value={body} placeholder="Post body"
                   onChange={(e) => setBody(e.target.value)}/>
         <button>Add post</button>
       </form>
  );
}

function List() {
  const {posts} = usePost();
  return (<>
     <ul>
         {posts.map((post, i) => <li key={i}>
           <h3>{post.title}</h3>
           <p>{post.body}</p>
         </li>)}
     </ul>
     {/*<Test/>*/}
  </>
  );
}

const ArchiveContext = createContext();

function Archive() {

  // Here we don't need the setter function. We're only using state to store these posts
  // because the callback function passed into useState (which generates the posts) is
  // only called once, on the initial render. So we use this trick as an optimization technique,
  // because if we just used a regular variable, these posts would be re-created on every render.
  // We could also move the posts outside the components, but I wanted to show you this trick 😉
  const [posts] = useState(() =>
       // 💥 WARNING: This might make your computer slow! Try a smaller `length` first
       Array.from({length: 10000}, () => createRandomPost())
  );

  const [showArchive, setShowArchive] = useState(false);

  return (
       <ArchiveContext.Provider value={{showArchive, setShowArchive, posts}}>
         <aside>
           <h2>Post archive</h2>
           <ButtonArchive/>
           {showArchive && <PostArchives/>}
         </aside>
       </ArchiveContext.Provider>
  );
}

function ButtonArchive() {
  const {setShowArchive, showArchive} = useContext(ArchiveContext)
  return (
       <button onClick={() => setShowArchive((s) => !s)}>
         {showArchive ? "Hide archive posts" : "Show archive posts"}
       </button>
  )
}

function PostArchives() {
  const {posts} = useContext(ArchiveContext);
  const {handleAddPost} = usePost();

  return (
       <ul>
         {posts.map((post, i) => (
              <li key={i}>
                <p>
                  <strong>{post.title}:</strong> {post.body}
                </p>
                <button onClick={() => handleAddPost(post)}>Add as new post</button>
              </li>
         ))}
       </ul>
  )
}

function Footer() {
  return <footer>&copy; by The Atomic Blog ✌️</footer>;
}

export default App;
