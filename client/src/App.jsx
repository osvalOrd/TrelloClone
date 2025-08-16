import { useState } from 'react';
import { Board } from './components';
import './App.css';

function App() {
  const [board, setBoard] = useState({
    id: 'board-1',
    title: 'My Trello Board',
    description: 'A simple project management board',
    columns: [
      {
        id: 'column-1',
        title: 'To Do',
        cards: [
          {
            id: 'card-1',
            title: 'Learn React',
            description: 'Study React fundamentals and hooks',
            createdAt: new Date().toISOString(),
            labels: [
              { name: 'Learning', color: '#3b82f6', textColor: 'white' }
            ]
          },
          {
            id: 'card-2',
            title: 'Build Trello Clone',
            description: 'Create a project management app',
            createdAt: new Date().toISOString(),
            labels: [
              { name: 'Project', color: '#10b981', textColor: 'white' }
            ]
          }
        ]
      },
      {
        id: 'column-2',
        title: 'In Progress',
        cards: [
          {
            id: 'card-3',
            title: 'Design Components',
            description: 'Create UI components with Tailwind CSS',
            createdAt: new Date().toISOString(),
            labels: [
              { name: 'Design', color: '#f59e0b', textColor: 'white' }
            ]
          }
        ]
      },
      {
        id: 'column-3',
        title: 'Done',
        cards: [
          {
            id: 'card-4',
            title: 'Setup Project',
            description: 'Initialize React project with Vite',
            createdAt: new Date().toISOString(),
            labels: [
              { name: 'Setup', color: '#8b5cf6', textColor: 'white' }
            ]
          }
        ]
      }
    ]
  });

  const handleUpdateBoard = (updatedBoard) => {
    setBoard(updatedBoard);
  };

  return (
    <div className="App">
      <Board board={board} onUpdateBoard={handleUpdateBoard} />
    </div>
  );
}

export default App;
