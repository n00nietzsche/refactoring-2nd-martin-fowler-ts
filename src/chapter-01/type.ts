export type Play = {
  name: string;
  type: string;
};

export type Invoice = {
  customer: string;
  performances: {
    playID: string;
    audience: number;
  }[];
};

export type Performance = {
  playID: string;
  audience: number;
};
