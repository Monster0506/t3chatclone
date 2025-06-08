'use client';
import Sidebar from '../Sidebar/Sidebar';
import ChatContainer from '../Chat/ChatContainer';
import SettingsModal from '../Settings/SettingsModal';
import { useState } from 'react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  // TODO: Load/save user settings from db/localStorage
  const [userSettings, setUserSettings] = useState<any>(null);

  return (
    <div className="flex h-screen w-screen bg-pink-50">
      <Sidebar onOpenSettings={() => setSettingsOpen(true)} />
      <main className="flex-1 flex flex-col">
        <ChatContainer />
        {children}
      </main>
      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onSave={settings => {
          setUserSettings(settings);
          setSettingsOpen(false);
        }}
        initial={userSettings}
      />
    </div>
  );
} 