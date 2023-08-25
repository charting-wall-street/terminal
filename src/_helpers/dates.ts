export const formatDate = (ts: number): string => {
    return (new Date(ts * 1000)).toISOString().substring(0, 16).replace("T", " ")
}
