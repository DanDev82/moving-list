import React, { useState } from 'react';
import { Box, Item } from '../types';

interface BoxDetailProps {
  box: Box;
  onClose: () => void;
  onEditBox: (id: string, newName: string) => void;
  onDeleteBox: (id: string) => void;
  onEditItem: (boxId: string, itemIndex: number, newName: string) => void;
  onDeleteItem: (boxId: string, itemIndex: number) => void;
  onAddItem: (itemName: string, boxId: string) => void;
}

export const BoxDetail = ({ 
  box, 
  onClose, 
  onEditBox, 
  onDeleteBox, 
  onEditItem, 
  onDeleteItem,
  onAddItem 
}: BoxDetailProps) => {
  const [editingItem, setEditingItem] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [isEditingBoxName, setIsEditingBoxName] = useState(false);
  const [editBoxName, setEditBoxName] = useState(box.name);

  const handleStartEditItem = (index: number, currentName: string) => {
    setEditingItem(index);
    setEditValue(currentName);
  };

  const handleSaveEdit = (index: number) => {
    if (editValue.trim()) {
      onEditItem(box.id, index, editValue.trim());
      setEditingItem(null);
      setEditValue('');
    }
  };

  const handleSaveBoxName = () => {
    if (editBoxName.trim() && editBoxName !== box.name) {
      onEditBox(box.id, editBoxName.trim());
    }
    setIsEditingBoxName(false);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemName.trim()) {
      onAddItem(newItemName.trim(), box.id);
      setNewItemName('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          {isEditingBoxName ? (
            <div className="flex items-center gap-2 flex-1 max-w-sm">
              <input
                type="text"
                value={editBoxName}
                onChange={(e) => setEditBoxName(e.target.value)}
                className="flex-1 px-2 py-1 border rounded text-lg"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSaveBoxName();
                  } else if (e.key === 'Escape') {
                    setIsEditingBoxName(false);
                    setEditBoxName(box.name);
                  }
                }}
              />
              <button
                onClick={handleSaveBoxName}
                className="text-green-600 hover:text-green-800"
                title="Save box name"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </button>
              <button
                onClick={() => {
                  setIsEditingBoxName(false);
                  setEditBoxName(box.name);
                }}
                className="text-gray-600 hover:text-gray-800"
                title="Cancel editing"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">{box.name}</h2>
              <button
                onClick={() => {
                  setIsEditingBoxName(true);
                  setEditBoxName(box.name);
                }}
                className="text-blue-600 hover:text-blue-800 p-1"
                title="Edit box name"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
              </button>
            </div>
          )}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onDeleteBox(box.id)}
              className="text-red-600 hover:text-red-800 p-1"
              title="Delete box"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="p-4">
          <form onSubmit={handleAddItem} className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="Add new item..."
                className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                Add
              </button>
            </div>
          </form>

          <div className="space-y-2">
            {box.items?.map((item, index) => (
              <div key={item.id} className="flex items-center justify-between group bg-gray-50 p-3 rounded-md">
                {editingItem === index ? (
                  <div className="flex items-center gap-2 w-full">
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="flex-1 px-2 py-1 border rounded"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveEdit(index)}
                      className="text-green-600 hover:text-green-800"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingItem(null)}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                      <span className="text-gray-600">{item.name}</span>
                    </div>
                    <div className="hidden group-hover:flex items-center gap-1">
                      <button
                        onClick={() => handleStartEditItem(index, item.name)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="Edit item"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onDeleteItem(box.id, index)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Delete item"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
            {(!box.items || box.items.length === 0) && (
              <p className="text-gray-500 italic text-center py-4">No items in this box</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 