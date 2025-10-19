import { db, storage } from "./firebase.js";
import { 
  collection, addDoc, onSnapshot, doc, updateDoc, increment, query, orderBy 
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { 
  ref, uploadBytes, getDownloadURL 
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";

const postBtn = document.getElementById("postBtn");
const postInput = document.getElementById("postInput");
const imageInput = document.getElementById("imageInput");
const postsDiv = document.getElementById("posts");

// Add new post with optional image
postBtn.addEventListener("click", async () => {
  const text = postInput.value.trim();
  const file = imageInput.files[0];
  let imageUrl = "";

  // If there’s an image, upload it first
  if (file) {
    const storageRef = ref(storage, `images/${Date.now()}-${file.name}`);
    await uploadBytes(storageRef, file);
    imageUrl = await getDownloadURL(storageRef);
  }

  await addDoc(collection(db, "posts"), {
    text,
    imageUrl,
    createdAt: new Date(),
    likes: 0
  });

  postInput.value = "";
  imageInput.value = "";
});

// Show posts in real-time
onSnapshot(query(collection(db, "posts"), orderBy("createdAt", "desc")), (snapshot) => {
  postsDiv.innerHTML = "";
  snapshot.forEach((docSnap) => {
    const post = docSnap.data();
    const postRef = doc(db, "posts", docSnap.id);
    const div = document.createElement("div");
    div.className = "post";

    // Text
    const textEl = document.createElement("p");
    textEl.textContent = post.text;
    div.appendChild(textEl);

    // Image (if exists)
    if (post.imageUrl) {
      const img = document.createElement("img");
      img.src = post.imageUrl;
      img.className = "post-image";
      div.appendChild(img);
    }

    // Like button
    const likeBtn = document.createElement("button");
    likeBtn.textContent = `❤️ ${post.likes || 0}`;
    likeBtn.className = "like-btn";
    likeBtn.addEventListener("click", async () => {
      await updateDoc(postRef, { likes: increment(1) });
    });
    div.appendChild(likeBtn);

    postsDiv.appendChild(div);
  });
});
