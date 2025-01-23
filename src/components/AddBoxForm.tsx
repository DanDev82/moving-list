import React, { useState } from 'react';

interface AddBoxFormProps {
  onAddBox: (boxName: string) => void;
}

export const AddBoxForm = ({ onAddBox }: AddBoxFormProps) => {
  const [boxName, setBoxName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (boxName.trim()) {
      onAddBox(boxName.trim());
      setBoxName('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <input
          type="text"
          value={boxName}
          onChange={(e) => setBoxName(e.target.value)}
          placeholder="Enter box name"
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
          autoFocus
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Create Box
        </button>
      </div>
    </form>
  );
}; 