import { useState, useEffect } from "react";
import { db } from "../firebase.js";
import { collection, getDocs, addDoc, updateDoc, doc } from "firebase/firestore";

function App() {
  const [responses, setResponses] = useState([]);
  const [newResponse, setNewResponse] = useState("");

  useEffect(() => {
    fetchResponses();
  }, []);

  const fetchResponses = async () => {
    const querySnapshot = await getDocs(collection(db, "responses"));
    const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    data.sort((a, b) => b.upvotes - a.upvotes);
    setResponses(data);
  };

  const submitResponse = async () => {
    if (!newResponse) return;
    await addDoc(collection(db, "responses"), { text: newResponse, upvotes: 0 });
    setNewResponse("");
    fetchResponses();
  };

  const upvote = async (id, currentUpvotes) => {
    await updateDoc(doc(db, "responses", id), { upvotes: currentUpvotes + 1 });
    fetchResponses();
  };

  return (
    <div>
      <h1>What is your favorite programming language?</h1>
      <input
        value={newResponse}
        onChange={(e) => setNewResponse(e.target.value)}
        placeholder="Type your answer..."
      />
      <button onClick={submitResponse}>Submit</button>
      <ul>
        {responses.map((r) => (
          <li key={r.id}>
            {r.text} — {r.upvotes} upvotes
            <button onClick={() => upvote(r.id, r.upvotes)}>👍</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
