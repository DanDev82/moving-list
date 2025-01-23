/** @jsxImportSource react */
import { useState } from 'react';
import { Box } from '../types';
import { BoxDetail } from './BoxDetail';

interface BoxListProps {
  boxes: Box[];
  onDeleteBox: (id: string) => void;
  onEditBox: (id: string, newName: string) => void;
  onDeleteItem: (boxId: string, itemIndex: number) => void;
  onEditItem: (boxId: string, itemIndex: number, newName: string) => void;
  onAddItem: (boxId: string, itemName: string) => void;
}

export const BoxList = ({ 
  boxes, 
  onDeleteBox, 
  onEditBox, 
  onDeleteItem, 
  onEditItem,
  onAddItem 
}: BoxListProps) => {
  const [selectedBox, setSelectedBox] = useState<string | null>(null);

  const handleBoxClick = (boxId: string) => {
    setSelectedBox(boxId);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Boxes</h2>
        </div>
        <div className="divide-y">
          {boxes.map((box) => (
            <div
              key={box.id}
              className="p-4 hover:bg-gray-50 cursor-pointer flex items-center justify-between group"
              onClick={() => handleBoxClick(box.id)}
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{box.name}</h3>
                  <p className="text-sm text-gray-500">{box.items?.length ?? 0} items</p>
                </div>
              </div>
              <div className="hidden group-hover:flex items-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteBox(box.id);
                  }}
                  className="text-red-600 hover:text-red-800 p-1"
                  title="Delete box"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
          {boxes.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              No boxes added yet. Create a box to get started!
            </div>
          )}
        </div>
      </div>

      {selectedBox && (
        <BoxDetail
          box={boxes.find(box => box.id === selectedBox)!}
          onClose={() => setSelectedBox(null)}
          onEditBox={onEditBox}
          onDeleteBox={(boxId) => {
            onDeleteBox(boxId);
            setSelectedBox(null);
          }}
          onEditItem={onEditItem}
          onDeleteItem={onDeleteItem}
          onAddItem={onAddItem}
        />
      )}
    </>
  );
}; 