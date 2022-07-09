import * as React from "react";
import { useAppSelector } from "./store/hooks";

export const App = () => {
  const calculatorValue = useAppSelector((state) => state.calculator.value);

  return <div>Welcome to calculator: {calculatorValue}</div>;
};
