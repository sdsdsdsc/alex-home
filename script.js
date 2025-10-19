import { db } from "./firebase.js";
import { collection, addDoc, onSnapshot, doc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const postBtn = document.getElementById("postBtn");
const postInput = document.getElementById("postInput");
const postsDiv = document.getElementById("posts");

// Add a new post
postBtn.addEventListener("click", async () => {
  const text = postInput.value.trim();
  if (!text) return;
  await addDoc(collection(db, "posts"), { 
    text, 
    createdAt: new Date(),
    likes: 0
  });
  postInput.value = "";
});

// Show live updates
onSnapshot(collection(db, "posts"), (snapshot) => {
  postsDiv.innerHTML = "";
  snapshot.forEach((docSnap) => {
    const post = docSnap.data();
    const div = document.createElement("div");
    div.className = "post";

    // Text
    const textEl = document.createElement("p");
    textEl.textContent = post.text;

    // Like button
    const likeBtn = document.createElement("button");
    likeBtn.textContent = `❤️ ${post.likes || 0}`;
    likeBtn.className = "like-btn";
    likeBtn.addEventListener("click", async () => {
      const postRef = doc(db, "posts", docSnap.id);
      await updateDoc(postRef, { likes: increment(1) });
    });

    div.appendChild(textEl);
    div.appendChild(likeBtn);
    postsDiv.appendChild(div);
  });
});
