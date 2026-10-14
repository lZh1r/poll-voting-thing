import type { Poll } from "./model"

export const demoPolls: Poll[] = [
    {
        id: "test",
        title: "Hello?",
        description: "Что идет дальше?",
        status: "active",
        totalVotes: 24,
        createdAt: "2026-09-24T12:00:00.000Z",
        options: [
            { id: "world", text: "World", votes: 11 },
            { id: "goodbye", text: "Goodbye", votes: 8 },
            { id: "joke", text: "Hello", votes: 5 },
        ],
    },
]
