import React, { useState, useEffect } from "react";
import "./App.css";
import Post from "./Post.js";
import { db, auth } from "./firebase";
import { collection, onSnapshot } from "firebase/firestore";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateProfile,
} from "firebase/auth";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function App() {
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);

  //useEffect

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        //user has logged in
        console.log(authUser);
        setUser(authUser);
      } else {
        //user has logged out
        setUser(null);
      }
    });

    return () => {
      //perform cleanup action
      unsubscribe();
    };
  }, [user, username]);

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

  const signUp = (event) => {
    event.preventDefault();

    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        return updateProfile(auth.currentUser, {
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));
  };

  return (
    <div className="app">
      <Modal open={open} onClose={() => setOpen(false)}>
        <form action="">
          <Box sx={{ ...style, width: 200 }}>
            <center>
              <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
              <Input
                placeholder="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              ></Input>

              <Input
                placeholder="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></Input>

              <Input
                placeholder="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></Input>

              <Button type="submit" onClick={signUp}>
                Sign Up
              </Button>
            </center>
          </Box>
        </form>
      </Modal>

      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
        />
      </div>

      {user ? (
        <Button onClick={() => signOut(auth)}>Logout</Button>
      ) : (
        <Button onClick={() => setOpen(true)}>Sign Up</Button>
      )}

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
