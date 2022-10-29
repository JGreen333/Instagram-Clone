import React, { useState, useEffect } from "react";
import "./App.css";
import Post from "./Post.js";
import { db } from "./firebase";
import { collection, onSnapshot } from "firebase/firestore";

function App() {
  const [posts, setPosts] = useState([]);

  //useEffect
  useEffect(() => {
    //this is where the code runs
    onSnapshot(collection(db, "posts"), (snapshot) => {
      setPosts(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          post: doc.data(),
        }))
      );
    });
  }, []);

  return (
    <div className="app">
      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
        />
      </div>
      <h1>
        Hello Clever Programmers Let's Build an Instagram Clone with React!
      </h1>

      {posts.map(({ id, post }) => (
        <Post
          key={id}
          username={post.username}
          caption={post.caption}
          imageUrl={post.imageUrl}
        />
      ))}

      {/* POST HARDCODED TEMPLATE */}

      {/* <Post
        username="jamminjulian"
        caption="Wow! Coding is going great!!!"
        imageUrl="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8oHECkDLAQzEXHPX_zgbWxXWL9a4QWox6Xw&usqp=CAU"
      />
      <Post
        username="asertiveanthony"
        caption="You DID that."
        imageUrl="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8oHECkDLAQzEXHPX_zgbWxXWL9a4QWox6Xw&usqp=CAU"
      />
      <Post
        username="confusedchristian"
        caption="Why did we all post the same picture?"
        imageUrl="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8oHECkDLAQzEXHPX_zgbWxXWL9a4QWox6Xw&usqp=CAU"
      /> */}
    </div>
  );
}

export default App;
