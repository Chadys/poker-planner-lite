export const voteChoices = [
  '0',
  '0.5',
  '1',
  '2',
  '3',
  '5',
  '8',
  '13+',
  '?',
] as const;
export type VoteChoice = (typeof voteChoices)[number];

export type RoomModel = {
  name: string;
  currentRound: number;
  votePerRoundPerPlayer: {
    [round: number]: { [player: string]: VoteChoice | null };
  };
};

export const roomDefault = {
  currentRound: 0,
  votePerRoundPerPlayer: { 0: {} },
  name: '',
} as RoomModel;
