import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

type VotesContextValue = {
  isVoted: (id: string) => boolean;
  toggleVote: (id: string) => void;
};

const VotesContext = createContext<VotesContextValue | undefined>(undefined);

export function VotesProvider({ children }: { children: React.ReactNode }) {
  const [votedIds, setVotedIds] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem("votedIssues");
      setVotedIds(raw ? JSON.parse(raw) : []);
    })();
  }, []);

  const toggleVote = (id: string) => {
    setVotedIds((prev) => {
      const next = prev.includes(id)
        ? prev.filter((v) => v !== id)
        : [...prev, id];
      AsyncStorage.setItem("votedIssues", JSON.stringify(next));
      return next;
    });
  };

  const isVoted = (id: string) => votedIds.includes(id);

  return (
    <VotesContext.Provider value={{ isVoted, toggleVote }}>
      {children}
    </VotesContext.Provider>
  );
}

export function useVotes() {
  const ctx = useContext(VotesContext);
  if (!ctx) throw new Error("useVotes must be used inside VotesProvider");
  return ctx;
}
