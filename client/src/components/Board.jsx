import React, { useState } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import Column from './Column';

const Board = ({ board, onUpdateBoard }) => {
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');

  const handleDragEnd = (result) => {
    const { destination, source, draggableId, type } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type === 'column') {
      const newColumnOrder = Array.from(board.columns);
      const [removed] = newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, removed);

      onUpdateBoard({
        ...board,
        columns: newColumnOrder
      });
    } else if (type === 'card') {
      const sourceColumn = board.columns.find(col => col.id === source.droppableId);
      const destColumn = board.columns.find(col => col.id === destination.droppableId);
      
      if (!sourceColumn || !destColumn) return;

      const newSourceCards = Array.from(sourceColumn.cards || []);
      const newDestCards = Array.from(destColumn.cards || []);
      
      const [movedCard] = newSourceCards.splice(source.index, 1);
      
      if (source.droppableId === destination.droppableId) {
        newSourceCards.splice(destination.index, 0, movedCard);
        
        const newColumns = board.columns.map(col =>
          col.id === source.droppableId
            ? { ...col, cards: newSourceCards }
            : col
        );
        
        onUpdateBoard({
          ...board,
          columns: newColumns
        });
      } else {
        newDestCards.splice(destination.index, 0, movedCard);
        
        const newColumns = board.columns.map(col => {
          if (col.id === source.droppableId) {
            return { ...col, cards: newSourceCards };
          }
          if (col.id === destination.droppableId) {
            return { ...col, cards: newDestCards };
          }
          return col;
        });
        
        onUpdateBoard({
          ...board,
          columns: newColumns
        });
      }
    }
  };

  const handleAddColumn = () => {
    if (newColumnTitle.trim()) {
      const newColumn = {
        id: `column-${Date.now()}`,
        title: newColumnTitle,
        cards: []
      };
      
      onUpdateBoard({
        ...board,
        columns: [...board.columns, newColumn]
      });
      
      setNewColumnTitle('');
      setIsAddingColumn(false);
    }
  };

  const handleAddCard = (columnId, cardTitle) => {
    const newCard = {
      id: `card-${Date.now()}`,
      title: cardTitle,
      description: '',
      createdAt: new Date().toISOString()
    };
    
    const newColumns = board.columns.map(col =>
      col.id === columnId
        ? { ...col, cards: [...(col.cards || []), newCard] }
        : col
    );
    
    onUpdateBoard({
      ...board,
      columns: newColumns
    });
  };

  const handleEditCard = (cardId, updates) => {
    const newColumns = board.columns.map(col => ({
      ...col,
      cards: (col.cards || []).map(card =>
        card.id === cardId
          ? { ...card, ...updates }
          : card
      )
    }));
    
    onUpdateBoard({
      ...board,
      columns: newColumns
    });
  };

  const handleDeleteCard = (cardId) => {
    const newColumns = board.columns.map(col => ({
      ...col,
      cards: (col.cards || []).filter(card => card.id !== cardId)
    }));
    
    onUpdateBoard({
      ...board,
      columns: newColumns
    });
  };

  const handleEditColumn = (columnId, newTitle) => {
    const newColumns = board.columns.map(col =>
      col.id === columnId
        ? { ...col, title: newTitle }
        : col
    );
    
    onUpdateBoard({
      ...board,
      columns: newColumns
    });
  };

  const handleDeleteColumn = (columnId) => {
    const newColumns = board.columns.filter(col => col.id !== columnId);
    
    onUpdateBoard({
      ...board,
      columns: newColumns
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddColumn();
    } else if (e.key === 'Escape') {
      setIsAddingColumn(false);
      setNewColumnTitle('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Board Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{board.title}</h1>
        <p className="text-gray-600">{board.description}</p>
      </div>

      {/* Board Content */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="board" type="column" direction="horizontal">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex gap-6 overflow-x-auto pb-6"
            >
              {board.columns.map((column, index) => (
                <Column
                  key={column.id}
                  column={column}
                  onAddCard={handleAddCard}
                  onEditCard={handleEditCard}
                  onDeleteCard={handleDeleteCard}
                  onEditColumn={handleEditColumn}
                  onDeleteColumn={handleDeleteColumn}
                  onDragStart={(e, cardId) => {
                    e.dataTransfer.setData('cardId', cardId);
                  }}
                  onDrop={(e, columnId) => {
                    e.preventDefault();
                    const cardId = e.dataTransfer.getData('cardId');
                    // Handle drop logic is in handleDragEnd
                  }}
                  onDragOver={(e) => e.preventDefault()}
                />
              ))}
              {provided.placeholder}
              
              {/* Add Column Button */}
              {isAddingColumn ? (
                <div className="bg-gray-50 rounded-lg p-4 min-w-80 max-w-80">
                  <input
                    type="text"
                    value={newColumnTitle}
                    onChange={(e) => setNewColumnTitle(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter column title..."
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddColumn}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                    >
                      Add Column
                    </button>
                    <button
                      onClick={() => {
                        setIsAddingColumn(false);
                        setNewColumnTitle('');
                      }}
                      className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsAddingColumn(true)}
                  className="bg-gray-50 hover:bg-gray-100 rounded-lg p-4 min-w-80 max-w-80 border-2 border-dashed border-gray-300 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <div className="flex items-center justify-center">
                    <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add another list
                  </div>
                </button>
              )}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default Board;
