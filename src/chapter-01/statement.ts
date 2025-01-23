import { plays } from './data';
import type { Invoice, Play, Performance, Plays } from './type';

type EnrichedPerformance = Performance & {
  play: Play;
  amount: number;
  volumeCredits: number;
};

type StatementData = {
  customer: string;
  performances: EnrichedPerformance[];
  totalAmount: number;
  totalVolumeCredits: number;
};

export function statement(invoice: Invoice) {
  const statementData = createStatementData(invoice);

  return renderPlainText(statementData);
}

export function htmlStatement(invoice: Invoice) {
  return renderHtml(createStatementData(invoice));
}

function renderHtml(data: StatementData) {
  let result = `<h1>청구내역 (고객명: ${data.customer})</h1>\n`;

  result += '<table>\n';
  result += '<tr><th>연극</th><th>좌석 수</th><th>금액</th></tr>\n';

  for (let perf of data.performances) {
    result += `<tr><td>${perf.play.name}</td><td>${perf.audience}</td><td>${usd(
      perf.amount
    )}</td></tr>\n`;
  }

  result += '</table>\n';
  result += `<p>총액: <em>${usd(data.totalAmount / 100)}</em></p>\n`;
  result += `<p>적립 포인트: <em>${data.totalVolumeCredits}</em></p>\n`;

  return result;
}

function createStatementData(invoice: Invoice) {
  const statementData: StatementData = {
    customer: invoice.customer,
    performances: invoice.performances.map(enrichPerformance),
    totalAmount: 0,
    totalVolumeCredits: 0,
  };

  statementData.totalAmount = totalAmount(statementData);
  statementData.totalVolumeCredits = totalVolumeCredits(statementData);

  return statementData;
}

class PerformanceCalculator {
  performance: Performance;

  constructor(private aPerformance: Performance) {
    this.performance = aPerformance;
  }
}

function enrichPerformance(aPerformance: Performance) {
  const calculator = new PerformanceCalculator(aPerformance);
  const result = Object.assign({}, aPerformance);

  return {
    ...result,
    play: playFor(result),
    amount: amountFor(result, playFor(result)),
    volumeCredits: volumeCreditsFor(result),
  };
}

function renderPlainText(data: StatementData) {
  let result = `청구내역 (고객명: ${data.customer})\n`;

  for (let perf of data.performances) {
    // 청구 내역을 출력한다.
    result += `${perf.play.name}: ${usd(perf.amount / 100)} ${
      perf.audience
    }석\n`;
  }

  result += `총액 ${usd(data.totalAmount / 100)}\n`;
  result += `적립 포인트 ${data.totalVolumeCredits}점\n`;

  return result;
}

function totalAmount(data: StatementData) {
  return data.performances.reduce(
    (total, aPerformance) => total + aPerformance.amount,
    0
  );
}

function totalVolumeCredits(data: StatementData) {
  return data.performances.reduce(
    (total, aPerformance) => total + aPerformance.volumeCredits,
    0
  );
}

function usd(aNumber: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(aNumber);
}

function volumeCreditsFor(aPerformance: Performance) {
  let result = 0;

  result += Math.max(aPerformance.audience - 30, 0);

  // 희극 관객 5명마다 추가 포인트를 제공한다.
  if ('comedy' === playFor(aPerformance).type) {
    result += Math.floor(aPerformance.audience / 5);
  }
  return result;
}

/**
 * 공연 정보를 이용해 장르 정보를 찾는다.
 * @param aPerformance 공연 정보
 * @param plays 장르 정보
 * @returns 장르 정보
 */
function playFor(aPerformance: Performance) {
  return plays[aPerformance.playID as keyof Plays];
}

/**
 * 총액을 계산한다.
 * amount for -> ~에 대한 총액
 * @param aPerformance 공연 정보 (관객 수 이용)
 * @param play 장르 정보 (장르 이용)
 * @returns 총액
 */
function amountFor(aPerformance: Performance, play: Play) {
  let result = 0;

  switch (play.type) {
    case 'tragedy':
      result = 40_000;

      if (aPerformance.audience > 30) {
        result += 1_000 * (aPerformance.audience - 30);
      }

      break;

    case 'comedy':
      result = 30_000;

      if (aPerformance.audience > 20) {
        result += 10_000 + 500 * (aPerformance.audience - 20);
      }

      result += 300 * aPerformance.audience;
      break;

    default:
      throw new Error(`알 수 없는 장르: ${play.type}`);
  }

  return result;
}
