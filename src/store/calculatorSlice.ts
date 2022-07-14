import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import BigNumber from "bignumber.js";

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

const calculate = (operation: Operation, prevValue: string, value: string) => {
  switch (operation) {
    case Operation.Plus:
      return new BigNumber(prevValue ?? 0).plus(value).toString();
    case Operation.Minus:
      return new BigNumber(prevValue ?? 0).minus(value).toString();
    case Operation.Multiply:
      return new BigNumber(prevValue ?? 0).multipliedBy(value).toString();
    case Operation.Divide:
      return new BigNumber(prevValue ?? 0).dividedBy(value).toString();
  }
};

const performOperation = (state: CalculatorState) => {
  const { value, prevValue, operation } = state;

  state.prevValue = operation ? calculate(operation, prevValue, value) : value;
  state.value = null;

  return state;
};

const performEqual = (state: CalculatorState) => {
  const { value, prevValue, operation } = state;

  if (operation) {
    state.prevValue = value;
    state.value = operation ? calculate(operation, prevValue, value) : value;
  }

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
      performEqual(state);
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
      if (action.payload.operation === Operation.Minus && !state.value) {
        // in that case minus is not an operation but a sign for the next number
        state.value = "-";
        return;
      }

      if (state.value !== null) {
        performOperation(state);
      }

      state.operation = action.payload.operation;
    },
  },
});

export const {
  digitEntered,
  decimalSeparatorEntered,
  resultEntered,
  cleanEntered,
  operationEntered,
} = calculatorSlice.actions;

export const selectDisplayValue = (state: CalculatorState) => {
  if (state.value !== null) {
    return state.value;
  }

  return state.prevValue ?? "0";
};
