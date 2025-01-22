import { amountFor } from "./amount-for";
import { playFor } from "./play-for";
import type { Invoice, Play } from "./type";

export function statement(
  invoice: Invoice,
  plays: Record<string, Play>
) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `청구내역 (고객명: ${invoice.customer})\n`;

  const format = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format;

  for (let aPerformance of invoice.performances) {
    const play = playFor(aPerformance, plays);

    let thisAmount = amountFor(
      aPerformance,
      play
    );

    // 포인트를 적립한다.
    volumeCredits += Math.max(
      aPerformance.audience - 30,
      0
    );

    // 희극 관객 5명마다 추가 포인트를 제공한다.
    if ("comedy" === play.type) {
      volumeCredits += Math.floor(
        aPerformance.audience / 5
      );
    }

    // 청구 내역을 출력한다.
    result += `${play.name}: ${format(
      thisAmount / 100
    )} ${aPerformance.audience}석\n`;
    totalAmount += thisAmount;
  }

  result += `총액 ${format(totalAmount / 100)}\n`;
  result += `적립 포인트 ${volumeCredits}점\n`;

  return result;
}
