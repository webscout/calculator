import { createSlice } from "@reduxjs/toolkit";

export interface CalculatorState {
  value: number;
}

const initialState: CalculatorState = {
  value: 0,
};

export const calculatorSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {},
});
