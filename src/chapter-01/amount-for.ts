import type { Performance, Play } from "./type";

/**
 * 총액을 계산한다.
 * amount for -> ~에 대한 총액
 * @param perf 공연 정보 (관객 수 이용)
 * @param play 장르 정보 (장르 이용)
 * @returns 총액
 */
export function amountFor(
  perf: Performance,
  play: Play
) {
  let thisAmount = 0;

  switch (play.type) {
    case "tragedy":
      thisAmount = 40_000;

      if (perf.audience > 30) {
        thisAmount +=
          1_000 * (perf.audience - 30);
      }

      break;

    case "comedy":
      thisAmount = 30_000;

      if (perf.audience > 20) {
        thisAmount +=
          10_000 + 500 * (perf.audience - 20);
      }

      thisAmount += 300 * perf.audience;
      break;

    default:
      throw new Error(
        `알 수 없는 장르: ${play.type}`
      );
  }

  return thisAmount;
}
