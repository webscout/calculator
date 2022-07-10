import React from "react";
import { useAppDispatch, useAppSelector } from "store/hooks";
import {
  decimalSeparatorEntered,
  digitEntered,
  cleanEntered,
  resultEntered,
  Operation,
  operationEntered,
  selectDisplayValue,
} from "store/calculatorSlice";
import styles from "./styles.module.css";

const digits = [...Array(9).keys()].map(String);

export const Calculator = () => {
  const displayValue = useAppSelector((state) =>
    selectDisplayValue(state.calculator)
  );

  const dispatch = useAppDispatch();

  return (
    <div className={styles.calculator}>
      <div className={styles.displayValue}>{displayValue}</div>

      <button onClick={() => dispatch(cleanEntered())}>C</button>
      <button onClick={() => dispatch(resultEntered())}>=</button>

      {digits.map((digit) => (
        <button onClick={() => dispatch(digitEntered({ digit }))}>
          {digit}
        </button>
      ))}

      <button onClick={() => dispatch(decimalSeparatorEntered())}>.</button>

      <button
        onClick={() =>
          dispatch(operationEntered({ operation: Operation.Plus }))
        }
      >
        +
      </button>

      <button
        onClick={() =>
          dispatch(operationEntered({ operation: Operation.Minus }))
        }
      >
        -
      </button>

      <button
        onClick={() =>
          dispatch(operationEntered({ operation: Operation.Multiply }))
        }
      >
        *
      </button>

      <button
        onClick={() =>
          dispatch(operationEntered({ operation: Operation.Divide }))
        }
      >
        /
      </button>
    </div>
  );
};
