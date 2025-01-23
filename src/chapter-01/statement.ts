import { amountFor } from "./amount-for";
import { playFor } from "./play-for";
import type { Invoice, Play, Performance } from "./type";

export function statement(
  invoice: Invoice,
  plays: Record<string, Play>
) {
  let totalAmount = 0;

  let result = `청구내역 (고객명: ${invoice.customer})\n`;

  for (let aPerformance of invoice.performances) {
    // 청구 내역을 출력한다.
    result += `${playFor(aPerformance).name}: ${usd(
      amountFor(
      aPerformance,
      playFor(aPerformance)
    ) / 100
    )} ${aPerformance.audience}석\n`;
    totalAmount += amountFor(
      aPerformance,
      playFor(aPerformance)
    );
  }

  result += `총액 ${usd(totalAmount / 100)}\n`;
  result += `적립 포인트 ${totalVolumeCredits(invoice)}점\n`;

  return result;
}

function totalVolumeCredits(invoice: Invoice) {
  let volumeCredits = 0;

  for (let aPerformance of invoice.performances) {
    volumeCredits += volumeCreditsFor(aPerformance);
  }
  return volumeCredits;
}

function usd(aNumber: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(aNumber);
}

function volumeCreditsFor(aPerformance: Performance) {
  let result = 0;

  result += Math.max(
    aPerformance.audience - 30,
    0
  );

  // 희극 관객 5명마다 추가 포인트를 제공한다.
  if ("comedy" === playFor(aPerformance).type) {
    result += Math.floor(
      aPerformance.audience / 5
    );
  }
  return result;
}

