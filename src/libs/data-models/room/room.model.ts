export const voteChoices = [
  '0',
  '0.5',
  '1',
  '2',
  '3',
  '5',
  '8',
  '13+',
] as const;
export type VoteChoice = (typeof voteChoices)[number];

export type RoomModel = {
  name: string;
  currentRound: number;
  votePerPlayer: { [key: string]: VoteChoice };
};
