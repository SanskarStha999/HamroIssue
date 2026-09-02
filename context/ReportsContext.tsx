import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useState } from "react";

export type MyReport = {
  id: string;
  title: string;
  status: "Pending" | "In Progress" | "Resolved";
  category: "Potholes" | "Streetlights" | "Dumping";
  location: string;
  date: string;
  upvotes: number;
  image: any;
};

type ReportsContextValue = {
  reports: MyReport[];
  refresh: () => Promise<void>;
  addReport: (report: MyReport) => Promise<void>;
  clearReports: () => Promise<void>;
};

const ReportsContext = createContext<ReportsContextValue | undefined>(
  undefined,
);

export function ReportsProvider({ children }: { children: React.ReactNode }) {
  const [reports, setReports] = useState<MyReport[]>([]);

  const refresh = async () => {
    const currentRaw = await AsyncStorage.getItem("currentUser");
    if (!currentRaw) {
      setReports([]);
      return;
    }
    const { identifier } = JSON.parse(currentRaw);
    const raw = await AsyncStorage.getItem(`myReports:${identifier}`);
    setReports(raw ? JSON.parse(raw) : []);
  };

  const addReport = async (report: MyReport) => {
    const currentRaw = await AsyncStorage.getItem("currentUser");
    if (!currentRaw) return;
    const { identifier } = JSON.parse(currentRaw);
    const raw = await AsyncStorage.getItem(`myReports:${identifier}`);
    const existing: MyReport[] = raw ? JSON.parse(raw) : [];
    const updated = [report, ...existing];
    await AsyncStorage.setItem(
      `myReports:${identifier}`,
      JSON.stringify(updated),
    );
    setReports(updated);
  };
  const clearReports = async () => {
    const currentRaw = await AsyncStorage.getItem("currentUser");
    if (!currentRaw) return;
    const { identifier } = JSON.parse(currentRaw);
    await AsyncStorage.removeItem(`myReports:${identifier}`);
    setReports([]);
  };

  return (
    <ReportsContext.Provider
      value={{ reports, refresh, addReport, clearReports }}
    >
      {children}
    </ReportsContext.Provider>
  );
}

export function useReports() {
  const ctx = useContext(ReportsContext);
  if (!ctx) throw new Error("useReports must be used inside ReportsProvider");
  return ctx;
}
