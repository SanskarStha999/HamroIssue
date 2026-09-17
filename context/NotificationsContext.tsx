import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useState } from "react";

export type NotificationItem = {
  id: string;
  type: "review" | "support" | "progress" | "welcome" | "report";
  title: string;
  description: string;
  time: string;
  unread: boolean;
};

type NotificationsContextValue = {
  items: NotificationItem[];
  unreadCount: number;
  refresh: () => Promise<void>;
  markAllRead: () => Promise<void>;
  markOneRead: (id: string) => Promise<void>;
  addNotification: (
    title: string,
    description: string,
    type: NotificationItem["type"]
  ) => Promise<void>;
};

const NotificationsContext = createContext<NotificationsContextValue | undefined>(
  undefined
);

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<NotificationItem[]>([]);

  const refresh = async () => {
    const currentRaw = await AsyncStorage.getItem("currentUser");
    if (!currentRaw) {
      setItems([]);
      return;
    }
    const { identifier } = JSON.parse(currentRaw);
    const raw = await AsyncStorage.getItem(`notifications:${identifier}`);
    setItems(raw ? JSON.parse(raw) : []);
  };

  const addNotification = async (
    title: string,
    description: string,
    type: NotificationItem["type"]
  ) => {
    const currentRaw = await AsyncStorage.getItem("currentUser");
    if (!currentRaw) return;
    const { identifier } = JSON.parse(currentRaw);
    const raw = await AsyncStorage.getItem(`notifications:${identifier}`);
    const existing: NotificationItem[] = raw ? JSON.parse(raw) : [];
    const newNotification: NotificationItem = {
      id: Date.now().toString(),
      type,
      title,
      description,
      time: "Just now",
      unread: true,
    };
    const updated = [newNotification, ...existing];
    await AsyncStorage.setItem(`notifications:${identifier}`, JSON.stringify(updated));
    setItems(updated);
  };

  const markAllRead = async () => {
    const currentRaw = await AsyncStorage.getItem("currentUser");
    if (!currentRaw) return;
    const { identifier } = JSON.parse(currentRaw);
    const updated = items.map((n) => ({ ...n, unread: false }));
    await AsyncStorage.setItem(`notifications:${identifier}`, JSON.stringify(updated));
    setItems(updated);
  };

  const markOneRead = async (id: string) => {
    const currentRaw = await AsyncStorage.getItem("currentUser");
    if (!currentRaw) return;
    const { identifier } = JSON.parse(currentRaw);
    const updated = items.map((n) => (n.id === id ? { ...n, unread: false } : n));
    await AsyncStorage.setItem(`notifications:${identifier}`, JSON.stringify(updated));
    setItems(updated);
  };

  const unreadCount = items.filter((n) => n.unread).length;

  return (
    <NotificationsContext.Provider
      value={{ items, unreadCount, refresh, markAllRead, markOneRead, addNotification }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotifications must be used inside NotificationsProvider");
  return ctx;
}