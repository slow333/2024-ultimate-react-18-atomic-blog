// noinspection JSCheckFunctionSignatures
// noinspection JSCheckFunctionSignatures

import {createContext, useContext, useEffect, useMemo, useReducer} from "react";
import {faker} from "@faker-js/faker";

function createRandomPost() {
  return {
    title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
    body: faker.hacker.phrase(),
  };
}

const initialState = {
  posts: [], query: '', isFakeDark: false,
}

const PostContext = createContext();

function reducer(state, action) {
  switch (action.type) {
    case 'getPosts':
      return {...state, posts: action.payload}
    case 'getQuery':
      return {...state, query: action.payload}
    case 'addPost':
      return {...state, posts: [...state.posts, action.payload]}
    case 'clearPosts' :
      return {...state, posts: []}
    case 'toggleFakeDark':
      return {...state, isFakeDark: !state.isFakeDark}
    default:
      throw new Error("Type is not defined !!")
  }
}

function PostsProvider({children}) {

  const [state, dispatch] = useReducer(reducer, initialState);
  const {posts, query, isFakeDark} = state;

  useEffect(() => {
    dispatch({
      type: 'getPosts',
      payload: Array.from({length: 30}, () => createRandomPost())
    })
  }, []);

  const searchedPosts = query.length > 0
       ? posts.filter((post) =>
            `${post.title} ${post.body}`
                 .toLowerCase()
                 .includes(query.toLowerCase())
       )
       : posts;

  useEffect(() => {
         document.documentElement.classList.toggle("fake-dark-mode");
       }, [isFakeDark]
  );
  const handleAddPost = (post) => dispatch({type: 'addPost', payload: post})
  const handleClearPosts = () => dispatch({type: 'clearPosts'})
  const handleQuery = (query) => dispatch({type: 'getQuery', payload: query})
  const handleToggleFakeDark = () => dispatch({type: 'toggleFakeDark'})

  const value = useMemo(() => {
    return {
      posts: searchedPosts, query, isFakeDark, dispatch,
      handleAddPost, handleClearPosts, handleQuery, handleToggleFakeDark
    }
  })

  return (
       <PostContext.Provider value={value}>
         {children}
       </PostContext.Provider>
  );
}

function usePost() {
  const context = useContext(PostContext);
  if (context === undefined) throw new Error('Context 밖에서 정의됐습니다.')
  return context;
}

export {PostsProvider, usePost};