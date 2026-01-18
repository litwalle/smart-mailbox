"use client";

import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Sidebar } from "@/components/layout/Sidebar";
import { SidebarCollapsed } from "@/components/layout/SidebarCollapsed";
import { MailList } from "@/components/mail/MailList";
import { MailDetail } from "@/components/mail/MailDetail";
import { ComposeWindow } from "@/components/mail/compose/ComposeWindow";
import { SettingsView } from "@/components/settings/SettingsView";
import { useMailStore } from "@/store/mailStore";

export default function Home() {
  const { selectedFolderId, selectedEventId, activeModule } = useMailStore();

  // Decide if we should show detail view
  // 1. Not in calendar (Mail mode always shows detail or empty state)
  // 2. In calendar AND has selected event
  const showDetail = (selectedFolderId !== 'calendar' || !!selectedEventId) && activeModule !== 'settings';

  let listContent;
  if (activeModule === 'settings') {
    listContent = <SettingsView />;
  } else {
    listContent = <MailList />;
  }

  return (
    <>
      <ThreeColumnLayout
        sidebar={<Sidebar />}
        sidebarCollapsed={<SidebarCollapsed />}
        list={listContent}
        detail={showDetail ? <MailDetail /> : null}
      />
      <ComposeWindow />
    </>
  );
}
