import {FC, useEffect} from "react"

export const useLocalStringState = (setState: (v: string) => void, state: string, key: string) => {
    useEffect(() => {
        const v = localStorage.getItem(key)
        if (v === null || v.length === 0) return
        setState(v)
    }, [])
    useEffect(() => {
        localStorage.setItem(key, state)
    }, [state])
}

export const useLocalBoolState = (setState: (v: boolean) => void, state: boolean, key: string) => {
    useEffect(() => {
        const v = localStorage.getItem(key)
        if (v === null || v.length === 0) return
        setState(v === "true")
    }, [])
    useEffect(() => {
        localStorage.setItem(key, state ? "true" : "false")
    }, [state])
}

export const useLocalNumberState = (setState: (v: number) => void, state: number, key: string) => {
    useEffect(() => {
        const v = localStorage.getItem(key)
        if (v === null || v.length === 0) return
        setState(parseInt(v))
    }, [])
    useEffect(() => {
        localStorage.setItem(key, `${state}`)
    }, [state])
}

export const useLocalArrayState = (setState: (v: string[]) => void, state: string[], key: string) => {
    useEffect(() => {
        const v = localStorage.getItem(key)
        if (v === null || v.length === 0) return
        setState(v.split(";-;"))
    }, [])
    useEffect(() => {
        localStorage.setItem(key, state.join(";-;"))
    }, [state])
}

export const useLocalJsonState = (setState: (v: any) => void, state: any, key: string) => {
    useEffect(() => {
        const v = localStorage.getItem(key)
        if (v === null || v.length === 0) return
        setState(JSON.parse(v))
    }, [])
    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(state))
    }, [state])
}
