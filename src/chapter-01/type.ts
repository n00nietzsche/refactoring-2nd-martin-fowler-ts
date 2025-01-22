export type Play = {
  name: string;
  type: string;
};

export type Plays = {
  hamlet: Play;
  "as-like": Play;
  othello: Play;
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
