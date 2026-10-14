import { z } from "zod"
import { demoPolls } from "./demo"
import { optionsSchema, pollCreateSchema, pollSchema, pollStatusSchema } from "./model"
import type { Poll, PollCreate, PollOptionDraft, PollStatus } from "./model"

export const POLLS_STORAGE_KEY = "polls:v1"
const storedPollsSchema = z.array(pollSchema)

async function waitForStorage() {
    await new Promise<void>(resolve => setTimeout(resolve, 150))
}

function readPolls(): Poll[] {
    try {
        const stored = localStorage.getItem(POLLS_STORAGE_KEY)
        return storedPollsSchema.parse(stored === null ? demoPolls : JSON.parse(stored))
    } catch {
        throw new Error("Не удалось загрузить опросы. Проверьте доступ к хранилищу браузера и попробуйте снова.")
    }
}

function savePolls(polls: Poll[]) {
    try {
        localStorage.setItem(POLLS_STORAGE_KEY, JSON.stringify(storedPollsSchema.parse(polls)))
    } catch {
        throw new Error("Не удалось сохранить изменения. Проверьте свободное место и доступ к хранилищу браузера.")
    }
}

function requirePoll(polls: Poll[], pollId: string): Poll {
    const poll = polls.find(item => item.id === pollId)
    if (!poll) throw new Error("Опрос не найден. Возможно, он был удалён.")
    return poll
}

function replacePoll(polls: Poll[], poll: Poll) {
    const updated = polls.map(item => item.id === poll.id ? poll : item)
    savePolls(updated)
    return { polls: updated, poll }
}

export const pollRepository = {
    async list(): Promise<Poll[]> {
        await waitForStorage()
        return readPolls()
    },

    async create(input: PollCreate) {
        const data = pollCreateSchema.parse(input)
        await waitForStorage()
        const polls = readPolls()
        const poll: Poll = {
            id: crypto.randomUUID(),
            title: data.title,
            description: data.description,
            status: "active",
            totalVotes: 0,
            createdAt: new Date().toISOString(),
            options: data.options.map(text => ({ id: crypto.randomUUID(), text, votes: 0 })),
        }
        const updated = [poll, ...polls]
        savePolls(updated)
        return { polls: updated, poll }
    },

    async updateOptions(pollId: string, drafts: PollOptionDraft[]) {
        const texts = optionsSchema.parse(drafts.map(option => option.text))
        if (new Set(drafts.map(option => option.id)).size !== drafts.length) {
            throw new Error("Варианты ответа должны иметь разные идентификаторы")
        }
        await waitForStorage()
        const polls = readPolls()
        const poll = requirePoll(polls, pollId)
        const options = drafts.map((draft, index) => ({
            id: draft.id,
            text: texts[index],
            votes: poll.options.find(option => option.id === draft.id)?.votes ?? 0,
        }))
        return replacePoll(polls, { ...poll, options, totalVotes: options.reduce((total, option) => total + option.votes, 0) })
    },

    async setStatus(pollId: string, input: PollStatus) {
        const status = pollStatusSchema.parse(input)
        await waitForStorage()
        const polls = readPolls()
        const poll = requirePoll(polls, pollId)
        if (poll.status === "finished" && status !== "finished") {
            throw new Error("Завершённый опрос нельзя возобновить")
        }
        return replacePoll(polls, { ...poll, status })
    },

    async remove(pollId: string): Promise<Poll[]> {
        await waitForStorage()
        const polls = readPolls()
        requirePoll(polls, pollId)
        const updated = polls.filter(poll => poll.id !== pollId)
        savePolls(updated)
        return updated
    },

    async vote(pollId: string, optionId: string) {
        await waitForStorage()
        const polls = readPolls()
        const poll = requirePoll(polls, pollId)
        if (poll.status !== "active") throw new Error("Опрос больше не принимает ответы")
        if (!poll.options.some(option => option.id === optionId)) throw new Error("Выберите один из вариантов опроса")
        const options = poll.options.map(option => option.id === optionId ? { ...option, votes: option.votes + 1 } : option)
        return replacePoll(polls, { ...poll, options, totalVotes: poll.totalVotes + 1 })
    },
}
