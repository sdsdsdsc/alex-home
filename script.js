import { db } from "./firebase.js";
import { 
  collection, addDoc, onSnapshot, doc, updateDoc, increment, query, orderBy 
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const postBtn = document.getElementById("postBtn");
const postInput = document.getElementById("postInput");
const postsDiv = document.getElementById("posts");

// Add new post
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

// Show posts in real time
onSnapshot(query(collection(db, "posts"), orderBy("createdAt", "desc")), (snapshot) => {
  postsDiv.innerHTML = "";
  snapshot.forEach((docSnap) => {
    const post = docSnap.data();
    const postRef = doc(db, "posts", docSnap.id);
    const div = document.createElement("div");
    div.className = "post";

    // Post text
    const textEl = document.createElement("p");
    textEl.textContent = post.text;
    div.appendChild(textEl);

    // Like button
    const likeBtn = document.createElement("button");
    likeBtn.textContent = `❤️ ${post.likes || 0}`;
    likeBtn.className = "like-btn";
    likeBtn.addEventListener("click", async () => {
      await updateDoc(postRef, { likes: increment(1) });
    });
    div.appendChild(likeBtn);

    // Comment section
    const commentBox = document.createElement("div");
    commentBox.className = "comment-box";

    const input = document.createElement("input");
    input.placeholder = "Write a comment...";
    input.className = "comment-input";

    const sendBtn = document.createElement("button");
    sendBtn.textContent = "Send";
    sendBtn.className = "comment-send";

    // Add new comment
    sendBtn.addEventListener("click", async () => {
      const commentText = input.value.trim();
      if (!commentText) return;
      await addDoc(collection(postRef, "comments"), {
        text: commentText,
        createdAt: new Date()
      });
      input.value = "";
    });

    commentBox.appendChild(input);
    commentBox.appendChild(sendBtn);

    // Show comments
    const commentsDiv = document.createElement("div");
    commentsDiv.className = "comments";

    onSnapshot(query(collection(postRef, "comments"), orderBy("createdAt")), (commentSnap) => {
      commentsDiv.innerHTML = "";
      commentSnap.forEach((c) => {
        const cmt = document.createElement("p");
        cmt.textContent = `💬 ${c.data().text}`;
        cmt.className = "comment-text";
        commentsDiv.appendChild(cmt);
      });
    });

    div.appendChild(commentBox);
    div.appendChild(commentsDiv);
    postsDiv.appendChild(div);
  });
});
