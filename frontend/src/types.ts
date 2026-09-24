export type PollStatus = "active" | "paused" | "finished"

export interface PollOption {
  id: string
  text: string
  votes: number
}

export interface Poll {
  id: string
  title: string
  description: string
  status: PollStatus
  totalVotes: number
  options: PollOption[]
  createdAt: string
}
