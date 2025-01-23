import { expect, test, describe } from 'vitest';
import { htmlStatement, statement } from './statement';
import { invoices } from './data';

describe('statement 함수', () => {
  test('청구서가 올바르게 출력되어야 한다', () => {
    const expectedOutput = `청구내역 (고객명: BigCo)
Hamlet: $650.00 55석
As You Like It: $580.00 35석
Othello: $500.00 40석
총액 $1,730.00
적립 포인트 47점
`;

    expect(statement(invoices[0])).toBe(expectedOutput);
  });
});

describe('htmlStatement 함수', () => {
  test('html 청구서가 올바르게 출력되어야 한다', () => {
    const expectedOutput = `<h1>청구내역 (고객명: BigCo)</h1>
<table>
<tr><th>연극</th><th>좌석 수</th><th>금액</th></tr>
<tr><td>Hamlet</td><td>55</td><td>$65,000.00</td></tr>
<tr><td>As You Like It</td><td>35</td><td>$58,000.00</td></tr>
<tr><td>Othello</td><td>40</td><td>$50,000.00</td></tr>
</table>
<p>총액: <em>$1,730.00</em></p>
<p>적립 포인트: <em>47</em></p>
`;

    expect(htmlStatement(invoices[0])).toBe(expectedOutput);
  });
});
