import Sidebar from '../Sidebar/Sidebar';
import ChatContainer from '../Chat/ChatContainer';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen bg-pink-50">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <ChatContainer />
        {children}
      </main>
    </div>
  );
} 