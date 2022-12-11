export interface Player {
    name: string;
    email: string;
  }
  
export interface Lottery {
    title: string;
    players: Array<Player>;
  }
  
export interface LotteryResult {
    santa: Player;
    name: string;
  }

export interface ServerResponse {
  ok: boolean;
  msg: string;
} 