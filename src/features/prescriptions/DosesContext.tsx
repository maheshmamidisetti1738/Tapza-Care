import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { DoseTiming } from '../../types/models';
import { toDateKey } from '../../utils/date';
import { vibrate } from '../../utils/feedback';

const STORAGE_KEY = 'tapza.takenDoses';

interface DosesState {
  isTaken: (
    prescriptionId: string,
    medicineId: string,
    timing: DoseTiming,
  ) => boolean;
  toggleDose: (
    prescriptionId: string,
    medicineId: string,
    timing: DoseTiming,
  ) => void;
}

const DosesContext = createContext<DosesState | null>(null);

function doseKey(
  prescriptionId: string,
  medicineId: string,
  timing: DoseTiming,
) {
  return `${toDateKey(new Date())}:${prescriptionId}:${medicineId}:${timing}`;
}

export function DosesProvider({ children }: { children: ReactNode }) {
  const [takenKeys, setTakenKeys] = useState<string[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(saved => {
      if (saved) {
        setTakenKeys(JSON.parse(saved));
      }
    });
  }, []);

  const isTaken = useCallback(
    (prescriptionId: string, medicineId: string, timing: DoseTiming) =>
      takenKeys.includes(doseKey(prescriptionId, medicineId, timing)),
    [takenKeys],
  );

  const toggleDose = useCallback(
    (prescriptionId: string, medicineId: string, timing: DoseTiming) => {
      const key = doseKey(prescriptionId, medicineId, timing);
      const next = takenKeys.includes(key)
        ? takenKeys.filter(item => item !== key)
        : [...takenKeys, key];

      setTakenKeys(next);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      vibrate();
    },
    [takenKeys],
  );

  const value = useMemo(() => ({ isTaken, toggleDose }), [isTaken, toggleDose]);

  return (
    <DosesContext.Provider value={value}>{children}</DosesContext.Provider>
  );
}

export function useDoses() {
  const value = useContext(DosesContext);
  if (!value) {
    throw new Error('useDoses must be used inside DosesProvider');
  }
  return value;
}
