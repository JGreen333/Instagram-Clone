import React, { useState } from "react";
import Button from "@mui/material/Button";
import { db, storage } from "./firebase";
import { serverTimestamp, collection, addDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

function ImageUpload({ username }) {
  const [image, setImage] = useState(null);
  //   const [url, setUrl] = useState("");
  const [progress, setProgress] = useState(0);
  const [caption, setCaption] = useState("");

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    //will handle upload
    const storageRef = ref(storage, `images/${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        //progress bar function
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        // Error Function
        console.log(error);
        alert(error.message);
      },
      () => {
        //gets url from pic/video uploaded
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          addDoc(collection(db, "posts"), {
            timestamp: serverTimestamp(),
            caption: caption,
            imageUrl: url,
            username: username,
          });

          setProgress(0);
          setCaption("");
          setImage(null);
        });
      }
    );
  };

  return (
    <div>
      {/* Progress Meter */}
      <progress value={progress} max="100" />
      {/* Caption Input */}
      <input
        type="text"
        placeholder="Enter a caption..."
        onChange={(event) => setCaption(event.target.value)}
        value={caption}
      />

      {/* File Picker */}
      <input type="file" onChange={handleChange} />

      {/* Post Button */}
      <Button onClick={handleUpload}>Upload</Button>
    </div>
  );
}

export default ImageUpload;
