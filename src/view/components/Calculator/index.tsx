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
import { classes } from "view/helpers/classes";
import styles from "./styles.module.css";

const digits = [...Array(10).keys()].map(String);

export const Calculator = () => {
  const displayValue = useAppSelector((state) =>
    selectDisplayValue(state.calculator)
  );

  const dispatch = useAppDispatch();

  return (
    <div className={styles.calculator}>
      <div className={styles.displayValue}>{displayValue}</div>

      <button
        className={classes(styles.button, styles.clearButton)}
        onClick={() => dispatch(cleanEntered())}
      >
        C
      </button>
      <button
        className={classes(styles.button, styles.resultButton)}
        onClick={() => dispatch(resultEntered())}
      >
        =
      </button>

      {digits.map((digit) => (
        <button
          key={digit}
          className={classes(
            styles.button,
            styles.digitButton,
            styles["digitButton" + digit]
          )}
          onClick={() => dispatch(digitEntered({ digit }))}
        >
          {digit}
        </button>
      ))}

      <button
        className={classes(styles.button, styles.separatorButton)}
        onClick={() => dispatch(decimalSeparatorEntered())}
      >
        .
      </button>

      <button
        className={classes(styles.button, styles.plusButton)}
        onClick={() =>
          dispatch(operationEntered({ operation: Operation.Plus }))
        }
      >
        +
      </button>

      <button
        className={classes(styles.button, styles.minusButton)}
        onClick={() =>
          dispatch(operationEntered({ operation: Operation.Minus }))
        }
      >
        -
      </button>

      <button
        className={classes(styles.button, styles.multiplyButton)}
        onClick={() =>
          dispatch(operationEntered({ operation: Operation.Multiply }))
        }
      >
        *
      </button>

      <button
        className={classes(styles.button, styles.divideButton)}
        onClick={() =>
          dispatch(operationEntered({ operation: Operation.Divide }))
        }
      >
        /
      </button>
    </div>
  );
};
