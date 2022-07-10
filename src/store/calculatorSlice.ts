import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum Operation {
  Plus = "Plus",
  Minus = "Minus",
  Multiply = "Multiply",
  Divide = "Divide",
}

export interface CalculatorState {
  value: string | null;
  operation: Operation | null;
  prevValue: string | null;
}

const initialState: CalculatorState = {
  value: null,
  operation: null,
  prevValue: null,
};

const performOperation = (state: CalculatorState) => {
  const { value, prevValue, operation } = state;

  switch (operation) {
    case Operation.Plus:
      state.value = String(Number(prevValue) + Number(value));
      break;
    case Operation.Minus:
      state.value = String(Number(prevValue) - Number(value));
      break;
    case Operation.Multiply:
      state.value = String(Number(prevValue) * Number(value));
      break;
    case Operation.Divide:
      state.value = String(Number(prevValue) / Number(value));
      break;
    default:
      state.value = null;
  }

  state.prevValue = value;

  return state;
};

export const calculatorSlice = createSlice({
  name: "calculator",
  initialState,
  reducers: {
    digitEntered: (state, action: PayloadAction<{ digit: string }>) => {
      const { digit } = action.payload;

      if (!/^[0-9]$/.test(digit)) {
        return;
      }

      if (state.value === "0" || state.value === null) {
        state.value = digit;
      } else {
        state.value += digit;
      }
    },
    decimalSeparatorEntered: (state) => {
      if (!state.value.includes(".")) {
        state.value += ".";
      }
    },
    resultEntered: (state) => {
      if (state.operation) {
        performOperation(state);
      }
    },
    cleanEntered: (state) => {
      state.value = initialState.value;
      state.prevValue = initialState.prevValue;
      state.operation = initialState.operation;
    },
    operationEntered: (
      state,
      action: PayloadAction<{ operation: Operation }>
    ) => {
      if (state.value !== null) {
        performOperation(state);
      }

      state.operation = action.payload.operation;
    },
  },
});

export const selectDisplayValue = (state: CalculatorState) => {
  if (state.value !== null) {
    return state.value;
  }

  return state.prevValue ?? "0";
};
