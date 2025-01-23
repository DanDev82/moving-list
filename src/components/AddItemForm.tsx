import { useState } from 'react';

interface AddItemFormProps {
  onAddItem: (boxId: string, itemName: string) => void;
  boxes: { id: string; name: string }[];
}

export const AddItemForm = ({ onAddItem, boxes }: AddItemFormProps) => {
  const [itemName, setItemName] = useState('');
  const [selectedBox, setSelectedBox] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (itemName.trim() && selectedBox) {
      onAddItem(selectedBox, itemName.trim());
      setItemName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-3">Add New Item</h2>
      <div className="flex flex-col gap-2">
        <input
          type="text"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          placeholder="Enter item name"
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <div className="flex flex-col sm:flex-row gap-2">
          <select
            value={selectedBox}
            onChange={(e) => setSelectedBox(e.target.value)}
            className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          >
            <option value="">Select Box</option>
            {boxes.map((box) => (
              <option key={box.id} value={box.id}>
                {box.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors w-full sm:w-auto"
          >
            Add Item
          </button>
        </div>
      </div>
    </form>
  );
}; 