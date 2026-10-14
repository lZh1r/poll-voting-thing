const dateFormatter = new Intl.DateTimeFormat("ru-RU", { dateStyle: "medium" })

export function formatDate(value: string): string {
    return dateFormatter.format(new Date(value))
}
