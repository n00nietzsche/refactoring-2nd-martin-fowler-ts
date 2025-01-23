import { plays } from "./data";
import type { Invoice, Play, Performance, Plays } from "./type";

export function statement(
  invoice: Invoice,
  plays: Record<string, Play>
) {
  let result = `청구내역 (고객명: ${invoice.customer})\n`;

  for (let aPerformance of invoice.performances) {
    // 청구 내역을 출력한다.
    result += `${playFor(aPerformance).name}: ${usd(
      amountFor(
      aPerformance,
      playFor(aPerformance)
    ) / 100
    )} ${aPerformance.audience}석\n`;
  }

  result += `총액 ${usd(totalAmount(invoice) / 100)}\n`;
  result += `적립 포인트 ${totalVolumeCredits(invoice)}점\n`;

  return result;
}

function totalAmount(invoice: Invoice) {
  let totalAmount = 0;

  for (let aPerformance of invoice.performances) {
    totalAmount += amountFor(
      aPerformance,
      playFor(aPerformance)
    );
  }
  return totalAmount;
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

/**
 * 공연 정보를 이용해 장르 정보를 찾는다.
 * @param aPerformance 공연 정보
 * @param plays 장르 정보
 * @returns 장르 정보
 */
function playFor(
  aPerformance: Performance
) {
  return plays[
    aPerformance.playID as keyof Plays
  ];
}

/**
 * 총액을 계산한다.
 * amount for -> ~에 대한 총액
 * @param aPerformance 공연 정보 (관객 수 이용)
 * @param play 장르 정보 (장르 이용)
 * @returns 총액
 */
function amountFor(
  aPerformance: Performance,
  play: Play
) {
  let result = 0;

  switch (play.type) {
    case "tragedy":
      result = 40_000;

      if (aPerformance.audience > 30) {
        result +=
          1_000 * (aPerformance.audience - 30);
      }

      break;

    case "comedy":
      result = 30_000;

      if (aPerformance.audience > 20) {
        result +=
          10_000 +
          500 * (aPerformance.audience - 20);
      }

      result += 300 * aPerformance.audience;
      break;

    default:
      throw new Error(
        `알 수 없는 장르: ${play.type}`
      );
  }

  return result;
}
