import { expect, test, describe } from "vitest";
import { statement } from "./statement";
import { invoices, plays } from "./data";

describe("statement 함수", () => {
  test("청구서가 올바르게 출력되어야 한다", () => {
    const expectedOutput = `청구내역 (고객명: BigCo)
Hamlet: $650.00 55석
As You Like It: $580.00 35석
Othello: $500.00 40석
총액 $1,730.00
적립 포인트 47점
`;

    expect(statement(invoices[0], plays)).toBe(
      expectedOutput
    );
  });
});
