import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { HMSRoomProvider } from '@100mslive/react-sdk';
import App from './App';
import { MemoryRouter as Router } from 'react-router-dom';

async function init(){
  
  const container = document.getElementById('root')!;
  const root = createRoot(container);

  // Strict mode checks are run in development mode only; they do not impact the production build.
  // and it triggers render twice on page load causing a lot of problems

  root.render(
    // <StrictMode> // strict creates issues for 100ms connection because it reloads pages multiple times
    <>
      <HMSRoomProvider>
        <Router>
          <App />
        </Router>
      </HMSRoomProvider>
    </>
    // </StrictMode>
  );

  ping();
}

function ping(){

  try {
    // calling IPC exposed from preload script
    window.electron.ipcRenderer.once('ipc-example', (arg) => {
      // eslint-disable-next-line no-console
      console.log(arg);
    });
    window.electron.ipcRenderer.sendMessage('ipc-example', ['ping']);
    
  } catch (e) {
    console.error('ignore if testing on browser', e);
  }
}


// INITIALIZE
init();
