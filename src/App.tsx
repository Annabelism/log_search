import React from 'react';
import { SearchBar } from "./components/SearchBar";
import { LogsViewer } from "./components/LogViewer";

const App: React.FC = () => {
  return (
    <div style={{ minWidth: 400, maxWidth: "100vw" }}>
      <SearchBar />
      <div className="app-content">
        <LogsViewer />
      </div>
    </div>
  );
}

export default App;
