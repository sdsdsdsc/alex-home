import { db } from "./firebase.js";
import { collection, addDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const postBtn = document.getElementById("postBtn");
const postInput = document.getElementById("postInput");
const postsDiv = document.getElementById("posts");

postBtn.addEventListener("click", async () => {
  const text = postInput.value.trim();
  if (!text) return;
  await addDoc(collection(db, "posts"), { text, createdAt: new Date() });
  postInput.value = "";
});

// Show live updates
onSnapshot(collection(db, "posts"), (snapshot) => {
  postsDiv.innerHTML = "";
  snapshot.forEach((doc) => {
    const post = doc.data();
    const div = document.createElement("div");
    div.className = "post";
    div.textContent = post.text;
    postsDiv.appendChild(div);
  });
});
