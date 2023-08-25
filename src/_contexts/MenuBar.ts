import React from "react"

export interface MenuBarAction {
    label: string
    name: string
    onClick: () => void
}

export interface MenuBarState {
    name: string
    user: string
    actions: MenuBarAction[]
    selected: string[]
}

export interface MenuBarContextState {
    name: string
    setName: (name: string) => void
    user: string
    setUser: (user: string) => void
    actions: MenuBarAction[]
    setActions: (actions: MenuBarAction[]) => void
    selected: string[]
    setSelected: (selected: string[]) => void
}

export const MenuBarContext = React.createContext<MenuBarContextState>({
    name: "",
    setName: () => null,
    user: "",
    setUser: () => null,
    actions: [],
    setActions: () => null,
    selected: [],
    setSelected: () => null,
})
