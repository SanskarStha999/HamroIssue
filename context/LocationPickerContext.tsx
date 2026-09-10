import React, { createContext, useContext, useState } from "react";

type Coordinate = { latitude: number; longitude: number };

type LocationPickerContextValue = {
  pickedLocation: Coordinate | null;
  setPickedLocation: (loc: Coordinate | null) => void;
};

const LocationPickerContext = createContext<LocationPickerContextValue | undefined>(undefined);

export function LocationPickerProvider({ children }: { children: React.ReactNode }) {
  const [pickedLocation, setPickedLocation] = useState<Coordinate | null>(null);

  return (
    <LocationPickerContext.Provider value={{ pickedLocation, setPickedLocation }}>
      {children}
    </LocationPickerContext.Provider>
  );
}

export function useLocationPicker() {
  const ctx = useContext(LocationPickerContext);
  if (!ctx) throw new Error("useLocationPicker must be used inside LocationPickerProvider");
  return ctx;
}