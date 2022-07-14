import { useAppDispatch } from "store/hooks";
import { useEffect } from "react";
import {
  cleanEntered,
  decimalSeparatorEntered,
  digitEntered,
  Operation,
  operationEntered,
  resultEntered,
} from "store/calculatorSlice";

const numbers = [...Array(10).keys()].map(String);
const signs: Record<string, Operation> = {
  "+": Operation.Plus,
  "-": Operation.Minus,
  "*": Operation.Multiply,
  "/": Operation.Divide,
};

export const useKeyboardCalculator = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) {
        return;
      }

      if (signs.hasOwnProperty(event.key)) {
        dispatch(operationEntered({ operation: signs[event.key] }));
        return;
      }

      if (numbers.includes(event.key)) {
        dispatch(digitEntered({ digit: event.key }));
        return;
      }

      switch (event.key) {
        case "=":
          dispatch(resultEntered());
          return;
        case ".":
        case ",":
          dispatch(decimalSeparatorEntered());
          return;
        case "c":
        case "C":
          dispatch(cleanEntered());
          return;
      }
    };

    window.addEventListener("keyup", handleKeyUp);

    return () => window.removeEventListener("keyup", handleKeyUp);
  }, []);
};
