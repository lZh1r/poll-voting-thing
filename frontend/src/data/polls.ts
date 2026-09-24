import type { Poll } from "../types"

export const demoPolls: Poll[] = [
  {
    id: "test",
    title: "Hello?",
    description: "Что идет дальше?",
    status: "active",
    totalVotes: 24,
    createdAt: "Сегодня",
    options: [
      { id: "world", text: "World", votes: 11 },
      { id: "goodbye", text: "Goodbye", votes: 8 },
      { id: "joke", text: "Hello", votes: 5 },
    ],
  },
]
