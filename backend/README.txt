# Secure Hugging Face Backend Setup

1. Open a terminal and go to the backend folder:
   cd backend

2. Install dependencies:
   npm install

3. Create a .env file in backend/ and add your Hugging Face API key:
   HF_API_KEY=your_huggingface_api_key_here

4. Start the backend server:
   npm start

5. Keep your frontend running on Live Server or Python server as before.

6. The frontend will now call http://localhost:5000/api/symptom-check for AI responses. Your API key is never exposed to the browser.

---

**Note:** If you deploy online, use a secure host for the backend and update the frontend URL accordingly.
