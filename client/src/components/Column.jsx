import React, { useState } from 'react';
import Card from './Card';

const Column = ({ column, onAddCard, onEditCard, onDeleteCard, onEditColumn, onDeleteColumn, onDragStart, onDrop, onDragOver }) => {
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [columnTitle, setColumnTitle] = useState(column.title);

  const handleAddCard = () => {
    if (newCardTitle.trim()) {
      onAddCard(column.id, newCardTitle);
      setNewCardTitle('');
      setIsAddingCard(false);
    }
  };

  const handleEditColumn = () => {
    if (columnTitle.trim() && columnTitle !== column.title) {
      onEditColumn(column.id, columnTitle);
    }
    setIsEditingTitle(false);
  };

  const handleCancelEdit = () => {
    setColumnTitle(column.title);
    setIsEditingTitle(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddCard();
    } else if (e.key === 'Escape') {
      setIsAddingCard(false);
      setNewCardTitle('');
    }
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleEditColumn();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 min-w-80 max-w-80">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        {isEditingTitle ? (
          <input
            type="text"
            value={columnTitle}
            onChange={(e) => setColumnTitle(e.target.value)}
            onKeyDown={handleTitleKeyDown}
            onBlur={handleEditColumn}
            className="flex-1 font-semibold text-gray-900 bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoFocus
          />
        ) : (
          <h3 
            className="flex-1 font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded transition-colors"
            onClick={() => setIsEditingTitle(true)}
          >
            {column.title}
          </h3>
        )}
        
        <div className="flex items-center gap-1">
          <span className="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
            {column.cards?.length || 0}
          </span>
          <button
            onClick={() => onDeleteColumn(column.id)}
            className="text-gray-400 hover:text-red-600 p-1 rounded hover:bg-gray-200 transition-colors"
            title="Delete column"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 11-2 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Cards Container */}
      <div 
        className="min-h-20"
        onDrop={(e) => onDrop(e, column.id)}
        onDragOver={onDragOver}
      >
        {column.cards?.map((card) => (
          <Card
            key={card.id}
            card={card}
            onEdit={onEditCard}
            onDelete={onDeleteCard}
            onDragStart={onDragStart}
          />
        ))}
      </div>

      {/* Add Card Button */}
      {isAddingCard ? (
        <div className="mt-3">
          <textarea
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter a title for this card..."
            className="w-full p-2 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="2"
            autoFocus
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleAddCard}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
            >
              Add Card
            </button>
            <button
              onClick={() => {
                setIsAddingCard(false);
                setNewCardTitle('');
              }}
              className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsAddingCard(true)}
          className="w-full mt-3 p-2 text-left text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
        >
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add a card
          </div>
        </button>
      )}
    </div>
  );
};

export default Column;
