import React, { useState, useEffect } from "react";
import "./App.css";
import Post from "./Post.js";
import { db, auth } from "./firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateProfile,
  signInWithEmailAndPassword,
} from "firebase/auth";
import ImageUpload from "./ImageUpload";
// import InstagramEmbed from "react-instagram-embed";

// Styling for Modal
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

// CREATING THE APP
function App() {
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);
  const [openSignIn, setOpenSignIn] = useState(false);

  //useEffect HOOKS

  useEffect(() => {
    // Keeps Track of User Signed In Status with user and username
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
    // Gets Post data from Firebase and maps it into posts variable
    onSnapshot(
      query(collection(db, "posts"), orderBy("timestamp", "desc")),
      (snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      }
    );
  }, []);

  const signUp = (event) => {
    // Creates a new user using email, password and username, catches errors (if any) and closes signup modal
    event.preventDefault();

    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        return updateProfile(auth.currentUser, {
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));

    setOpen(false);
  };

  const signIn = (event) => {
    // Sign In feature for existing users and closes sign in modal
    event.preventDefault();

    signInWithEmailAndPassword(auth, email, password).catch((error) =>
      alert(error.message)
    );

    setOpenSignIn(false);
  };

  return (
    <div className="app">
      {/* Sign Up Modal */}
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
      {/* Sign In Modal */}
      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <form action="">
          <Box sx={{ ...style, width: 200 }}>
            <center>
              <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />

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

              <Button type="submit" onClick={signIn}>
                Sign In
              </Button>
            </center>
          </Box>
        </form>
      </Modal>

      {/* App Header */}
      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
        />
        {user ? (
          <Button onClick={() => signOut(auth)}>Logout</Button>
        ) : (
          <div className="app__loginContainer">
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>
        )}
      </div>

      <div className="app__posts">
        <div className="app__postsLeft">
          {posts.map(({ id, post }) => (
            <Post
              key={id}
              postId={id}
              user={user}
              username={post.username}
              caption={post.caption}
              imageUrl={post.imageUrl}
            />
          ))}
        </div>
        {/* <div className="app__postsRight">
          <InstagramEmbed
            url="https://www.instagram.com/p/CipFjvIOEXf/"
            clientAccessToken="123|456"
            maxWidth={320}
            hideCaption={false}
            containerTagName="div"
            protocol=""
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div> */}
      </div>

      {/* Uses data in posts variable to create posts using template from "./Post.js" */}

      {/* Only Allow Image Upload IF Signed In */}
      {auth.currentUser && auth.currentUser.displayName ? (
        <ImageUpload username={auth.currentUser.displayName} />
      ) : (
        <h3>Signup/Login to upload.</h3>
      )}
    </div>
  );
}

export default App;
