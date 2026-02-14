import UploadPanel from './features/upload/UploadPanel';
import Header from './shared/ui/Header/Header';
import ViewPanel from './shared/ui/ViewPanel/ViewPanel';

function App() {
  return (
    <div className="app">
      <Header />
      <main className="layout">
        <UploadPanel />
        <ViewPanel />
      </main>
    </div>
  )
}

export default App
