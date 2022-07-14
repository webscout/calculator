import {
  calculatorSlice,
  Operation,
  selectDisplayValue,
} from "./calculatorSlice";
import { configureStore } from "@reduxjs/toolkit";

const {
  digitEntered,
  decimalSeparatorEntered,
  resultEntered,
  operationEntered,
  cleanEntered,
} = calculatorSlice.actions;

const createCalculatorStore = () =>
  configureStore({
    reducer: {
      calculator: calculatorSlice.reducer,
    },
  });

let calculatorStore = createCalculatorStore();

const getCalculatorValue = () =>
  selectDisplayValue(calculatorStore.getState().calculator);

const dispatch = (action) => calculatorStore.dispatch(action);

describe("Calculator tests", () => {
  beforeEach(() => {
    calculatorStore = createCalculatorStore();
  });

  it("Initially value should be 0", () => {
    expect(getCalculatorValue()).toBe("0");
  });

  it("Digit stored after entered", () => {
    calculatorStore.dispatch(
      calculatorSlice.actions.digitEntered({ digit: "1" })
    );

    expect(getCalculatorValue()).toBe("1");
  });

  it("Digits added to each other", () => {
    dispatch(digitEntered({ digit: "1" }));
    dispatch(digitEntered({ digit: "2" }));
    dispatch(digitEntered({ digit: "3" }));

    expect(getCalculatorValue()).toBe("123");
  });

  it("Can not enter leading zeros", () => {
    dispatch(digitEntered({ digit: "0" }));
    dispatch(digitEntered({ digit: "0" }));
    dispatch(digitEntered({ digit: "3" }));

    expect(getCalculatorValue()).toBe("3");
  });

  it("Can enter decimal number", () => {
    dispatch(digitEntered({ digit: "1" }));
    dispatch(decimalSeparatorEntered());
    dispatch(digitEntered({ digit: "3" }));

    expect(getCalculatorValue()).toBe("1.3");
  });

  it("Can not enter two decimal separators", () => {
    dispatch(digitEntered({ digit: "1" }));
    dispatch(decimalSeparatorEntered());
    dispatch(decimalSeparatorEntered());
    dispatch(digitEntered({ digit: "3" }));

    expect(getCalculatorValue()).toBe("1.3");
  });

  it("Enter 'result' multiple times without operation lead to the same result", () => {
    dispatch(digitEntered({ digit: "1" }));
    dispatch(digitEntered({ digit: "2" }));
    dispatch(resultEntered());
    dispatch(resultEntered());

    expect(getCalculatorValue()).toBe("12");
  });

  it("2*3==12 (Enter 'result' after operation performs operation again)", () => {
    dispatch(digitEntered({ digit: "2" }));
    dispatch(operationEntered({ operation: Operation.Multiply }));
    dispatch(digitEntered({ digit: "3" }));
    dispatch(resultEntered());
    dispatch(resultEntered());

    expect(getCalculatorValue()).toBe("18");
  });

  it("1/0=Infinity", () => {
    dispatch(digitEntered({ digit: "1" }));
    dispatch(operationEntered({ operation: Operation.Divide }));
    dispatch(digitEntered({ digit: "0" }));
    dispatch(resultEntered());

    expect(getCalculatorValue()).toBe("Infinity");
  });

  it("0/0=NaN", () => {
    dispatch(digitEntered({ digit: "0" }));
    dispatch(operationEntered({ operation: Operation.Divide }));
    dispatch(digitEntered({ digit: "0" }));
    dispatch(resultEntered());

    expect(getCalculatorValue()).toBe("NaN");
  });

  describe("Basic math operations", () => {
    it("2+3=4", () => {
      dispatch(digitEntered({ digit: "2" }));
      dispatch(operationEntered({ operation: Operation.Plus }));
      dispatch(digitEntered({ digit: "3" }));
      dispatch(resultEntered());

      expect(getCalculatorValue()).toBe("5");
    });

    it("2-3=-1", () => {
      dispatch(digitEntered({ digit: "2" }));
      dispatch(operationEntered({ operation: Operation.Minus }));
      dispatch(digitEntered({ digit: "3" }));
      dispatch(resultEntered());

      expect(getCalculatorValue()).toBe("-1");
    });

    it("3/2=1.5", () => {
      dispatch(digitEntered({ digit: "3" }));
      dispatch(operationEntered({ operation: Operation.Divide }));
      dispatch(digitEntered({ digit: "2" }));
      dispatch(resultEntered());

      expect(getCalculatorValue()).toBe("1.5");
    });

    it("2*3=6", () => {
      dispatch(digitEntered({ digit: "2" }));
      dispatch(operationEntered({ operation: Operation.Multiply }));
      dispatch(digitEntered({ digit: "3" }));
      dispatch(resultEntered());

      expect(getCalculatorValue()).toBe("6");
    });
  });

  describe("Enter operation first (perform operation with initial zero)", () => {
    it("-2=-2", () => {
      dispatch(operationEntered({ operation: Operation.Minus }));
      dispatch(digitEntered({ digit: "2" }));
      dispatch(resultEntered());

      expect(getCalculatorValue()).toBe("-2");
    });

    it("*2=0", () => {
      dispatch(operationEntered({ operation: Operation.Multiply }));
      dispatch(digitEntered({ digit: "2" }));
      dispatch(resultEntered());

      expect(getCalculatorValue()).toBe("0");
    });
  });

  it("Clean screen after the operation doesn't affect next operations", () => {
    dispatch(digitEntered({ digit: "2" }));
    dispatch(operationEntered({ operation: Operation.Multiply }));
    dispatch(digitEntered({ digit: "3" }));
    dispatch(cleanEntered());

    expect(getCalculatorValue()).toBe("0");

    dispatch(digitEntered({ digit: "5" }));
    dispatch(operationEntered({ operation: Operation.Plus }));
    dispatch(digitEntered({ digit: "5" }));
    dispatch(resultEntered());

    expect(getCalculatorValue()).toBe("10");
  });

  it("2+/2=1 (Possible to override operation)", () => {
    dispatch(digitEntered({ digit: "2" }));
    dispatch(operationEntered({ operation: Operation.Plus }));
    dispatch(operationEntered({ operation: Operation.Divide }));
    dispatch(digitEntered({ digit: "2" }));
    dispatch(resultEntered());

    expect(getCalculatorValue()).toBe("1");
  });

  it("1+2+3=6 (Multiple operations)", () => {
    dispatch(digitEntered({ digit: "1" }));
    dispatch(operationEntered({ operation: Operation.Plus }));
    dispatch(digitEntered({ digit: "2" }));
    dispatch(operationEntered({ operation: Operation.Plus }));
    dispatch(digitEntered({ digit: "3" }));
    dispatch(resultEntered());

    expect(getCalculatorValue()).toBe("6");
  });

  it("1+2=+3=6 (operation after equal sign)", () => {
    dispatch(digitEntered({ digit: "1" }));
    dispatch(operationEntered({ operation: Operation.Plus }));
    dispatch(digitEntered({ digit: "2" }));
    dispatch(resultEntered());
    dispatch(operationEntered({ operation: Operation.Plus }));
    dispatch(digitEntered({ digit: "3" }));
    dispatch(resultEntered());

    expect(getCalculatorValue()).toBe("6");
  });

  it("1+2=3 (reset number if enter it after equal sign)", () => {
    dispatch(digitEntered({ digit: "1" }));
    dispatch(operationEntered({ operation: Operation.Plus }));
    dispatch(digitEntered({ digit: "2" }));
    dispatch(resultEntered());
    dispatch(digitEntered({ digit: "5" }));

    expect(getCalculatorValue()).toBe("5");
  });

  it("0.1+0.2=0.3 (Check for floating point operations)", () => {
    dispatch(digitEntered({ digit: "0" }));
    dispatch(decimalSeparatorEntered());
    dispatch(digitEntered({ digit: "1" }));
    dispatch(operationEntered({ operation: Operation.Plus }));
    dispatch(digitEntered({ digit: "0" }));
    dispatch(decimalSeparatorEntered());
    dispatch(digitEntered({ digit: "2" }));
    dispatch(resultEntered());

    expect(getCalculatorValue()).toBe("0.3");
  });
});
