import { plays } from "./data";
import type { Performance, Plays } from "./type";

/**
 * 공연 정보를 이용해 장르 정보를 찾는다.
 * @param aPerformance 공연 정보
 * @param plays 장르 정보
 * @returns 장르 정보
 */
export function playFor(
  aPerformance: Performance
) {
  return plays[
    aPerformance.playID as keyof Plays
  ];
}
