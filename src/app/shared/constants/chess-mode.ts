export const CHESS_MODES = {
  STANDARD: 'standard',
  BLITZ: 'blitz',
} as const;

export type ChessMode = (typeof CHESS_MODES)[keyof typeof CHESS_MODES];
