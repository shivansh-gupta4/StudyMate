"use client";

import React, { useState } from 'react';
import { generateResponse } from '@/app/services/groqApi'; // Update the path accordingly

const Chatbot: React.FC = () => {
  const [userInput, setUserInput] = useState<string>('');
  const [jsonOutput, setJsonOutput] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const jsonResponse = await generateResponse(userInput);
      setJsonOutput(jsonResponse);
      setError(null);
    } catch (err) {
      console.error('Error processing response:', err);
      setError('Failed to retrieve the JSON response.');
      setJsonOutput(null);
    }
  };

  return (
    <div>
      <h1>Machine Learning Study Plan Chatbot</h1>
      <input 
        type="text" 
        value={userInput} 
        onChange={handleUserInput} 
        placeholder="Ask something..."
      />
      <button onClick={handleSubmit}>Submit</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {jsonOutput && (
        <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
          {JSON.stringify(jsonOutput, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default Chatbot;
