// ...existing code from script.js...
import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

let currentUser = null;
onAuthStateChanged(auth, (user) => {
  if (user) currentUser = user;
});

// No API key in frontend! Calls secure backend instead
let conversation = [];

// 🩺 Add message to chat
function addMessage(text, sender) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("msg", sender);
  msgDiv.innerHTML = text
    .replace(/\n\n/g, "<br><br>")
    .replace(/\n/g, "<br>");
  document.getElementById("chat").appendChild(msgDiv);
  document.getElementById("chat").scrollTop = document.getElementById("chat").scrollHeight;
  return msgDiv;
}

// 🕓 Typing effect
function typeMessage(element, text, speed = 25) {
  element.innerHTML = "";
  let i = 0;
  const formattedText = text.replace(/\n\n/g, "<br><br>").replace(/\n/g, "<br>");
  const plainText = formattedText.replace(/<br>/g, "\n");

  const interval = setInterval(() => {
    element.innerHTML = plainText.slice(0, i).replace(/\n/g, "<br>");
    i++;
    if (i > plainText.length) clearInterval(interval);
    document.getElementById("chat").scrollTop = document.getElementById("chat").scrollHeight;
  }, speed);
}

// 🚀 Main chatbot send function
window.sendMessage = async function () {
  const input = document.getElementById("userInput");
  const userText = input.value.trim();
  if (!userText) return;

  addMessage(userText, "user");
  conversation.push({ role: "user", text: userText });
  input.value = "";

  const botMsgDiv = addMessage("🤖 Typing...", "bot");

  try {
    // Compose prompt for backend
    const prompt = `You are a helpful medical assistant.\n\nConversation so far:\n${conversation.map((c) => c.role + ": " + c.text).join("\n")}\n\nYour task:\n1. Explain possible causes of the user's symptoms in 2–3 short paragraphs.\n2. Be empathetic and clear.\n3. Advise if the user should see a doctor urgently or routinely.\n4. Ask exactly ONE follow-up question.`;

    // Call backend API (make sure backend is running)
    const response = await fetch("http://localhost:5000/api/symptom-check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });
    const data = await response.json();
    console.log("🔎 Backend API Response:", data);

    let botReply = data.reply || "❌ Sorry, I couldn’t process that.";

    botMsgDiv.textContent = "";
    typeMessage(botMsgDiv, botReply);
    conversation.push({ role: "bot", text: botReply });

    // 💾 Save to Firestore
    if (currentUser) {
      try {
        await addDoc(collection(db, "users", currentUser.uid, "symptomHistory"), {
          userInput: userText,
          botReply: botReply.replace(/<[^>]*>?/gm, ""), // strip HTML tags
          timestamp: serverTimestamp()
        });
        console.log("✅ Saved to symptomHistory");
      } catch (err) {
        console.error("❌ Firestore save failed:", err);
      }
    }

  } catch (error) {
    console.error("❌ API Error:", error);
    botMsgDiv.textContent = "⚠️ Error connecting to backend API.";
  }
};
