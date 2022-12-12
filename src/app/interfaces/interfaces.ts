export interface Participant {
    name: string;
    email: string;
  }
  
export interface Lottery {
    title: string;
    participants: Array<Participant>;
  }
  
export interface LotteryResult {
    santa: Participant;
    name: string;
  }

export interface ServerResponse {
  ok: boolean;
  msg: string;
} 