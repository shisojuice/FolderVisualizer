import './App.css';
import React, { useState } from 'react';
import { extensionSVGMap } from './extensionSVGMap';

function App() {
  const [selectedFolder, setSelectedFolder] = useState(null);

  const handleFolderSelect = (e) => {
    setSelectedFolder(e.target.files);
  };

  const MyFolder = ({ children, title }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <details onToggle={(e) => setIsOpen(e.target.open)}>
        <summary className='filebase'><img className='fileicon' src={isOpen ? './default_folder_opened.svg' : './default_folder.svg'} alt='folder' />{title}</summary>
        <div style={{ paddingLeft: '1em' }}>{children}</div>
      </details>
    );
  };

  const MyFile = ({ title }) => {
    const ext = title.split('.').pop();
    const extSVGname = extensionSVGMap[ext.toLowerCase()] || ext;
    const svgPath = `./file_type_${extSVGname}.svg`;
    return <div className='filebase'>  <img className='fileicon' src={svgPath} alt={ext} onError={(e) => { e.target.src = './default_file.svg'; }} />{title}</div>;
  };

  const renderTree = (files) => {
    if (!files) return <div>Folderを指定してください</div>;

    const tree = {};

    for (const file of files) {
      const pathParts = file.webkitRelativePath.split('/');
      let currentLevel = tree;

      for (let i = 0; i < pathParts.length - 1; i++) { // ファイル名を除外
        const part = pathParts[i];
        if (!currentLevel[part]) {
          currentLevel[part] = {};
        }
        currentLevel = currentLevel[part];
      }
      currentLevel[pathParts.slice(-1)[0]] = file.name; // ファイル名を格納
    }

    const renderNode = (node, name) => {
      if (typeof node === 'string') {
        return <MyFile key={node} title={node} />;
      }
      return (
        <MyFolder key={name} title={name}>
          {Object.entries(node).map(([key, value]) => renderNode(value, key))}
        </MyFolder>
      );
    };

    return Object.entries(tree).map(([key, value]) => renderNode(value, key));
  };

  return (
    <div className='App'>
      <input
        type='file'
        webkitdirectory='true'
        directory='true'
        onChange={handleFolderSelect}
      />
      {renderTree(selectedFolder)}
    </div>
  );
}

export default App;