import { calculatorSlice } from "./calculatorSlice";

describe("Calculator tests", () => {
  it("Initially value should be 0", () => {
    const initialState = calculatorSlice.reducer(undefined, { type: "INIT" });

    expect(initialState.value).toBe(0);
  });
});
