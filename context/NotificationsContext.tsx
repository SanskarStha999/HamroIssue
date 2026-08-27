// context/NotificationsContext.tsx
import React, { createContext, useContext, useState } from "react";

export type NotificationItem = {
  id: string;
  type: "review" | "support" | "progress";
  title: string;
  description: string;
  time: string;
  unread: boolean;
};

const initialNotifications: NotificationItem[] = [
  {
    id: "1",
    type: "review",
    title: "Authority Review",
    description:
      "Your report on Satdobato road has been reviewed and approved by the ward office.",
    time: "2m ago",
    unread: true,
  },
  {
    id: "2",
    type: "support",
    title: "Community Support",
    description: "Someone liked your report on Satdobato road.",
    time: "8m ago",
    unread: true,
  },
  {
    id: "3",
    type: "progress",
    title: "Work in progress",
    description:
      "Maintenance team has been dispatched to Satdobato road to begin repairs.",
    time: "21h ago",
    unread: false,
  },
  {
    id: "4",
    type: "support",
    title: "Community Support",
    description: "Someone liked your report on Satdobato road.",
    time: "2d ago",
    unread: false,
  },
];

type NotificationsContextValue = {
  items: NotificationItem[];
  unreadCount: number;
  markAllRead: () => void;
  markOneRead: (id: string) => void;
};

const NotificationsContext = createContext<NotificationsContextValue | undefined>(
  undefined
);

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<NotificationItem[]>(initialNotifications);

  const markAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const markOneRead = (id: string) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  };

  const unreadCount = items.filter((n) => n.unread).length;

  return (
    <NotificationsContext.Provider value={{ items, unreadCount, markAllRead, markOneRead }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) {
    throw new Error("useNotifications must be used inside NotificationsProvider");
  }
  return ctx;
}