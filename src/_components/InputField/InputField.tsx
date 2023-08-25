import React, {FC} from "react"

interface NumberInputProps {
    id?: string
    onChange: (v: number | null) => void
    value: number | null
    floating?: boolean
}

export const NumberInput: FC<NumberInputProps> = ({id, value, onChange, floating}) => (
    <input
        id={id}
        type="number"
        value={value === null ? "" : value}
        onChange={e => {
            let s = e.target.value
            let v = floating ? parseFloat(s) : parseInt(s)
            onChange(isNaN(v) ? null : v)
        }}
    />
)

interface SelectProps {
    id?: string
    onChange: (v: string | null) => void
    value: string | null
    options: string[]
}

export const SelectInput: FC<SelectProps> = ({id, value, onChange, options}) => (
    <select
        id={id}
        value={value === null ? "" : value}
        onChange={e => {
            let s = e.target.value
            onChange(s === "" ? null : s)
        }}
    >
        <option>- select -</option>
        {options.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
        ))}
    </select>
)

interface InputContainerProps {
    label: string
    htmlFor: string
}

export const InputContainer: FC<InputContainerProps> = ({label, htmlFor, children}) => (
    <div className="panel-input">
        <label htmlFor={htmlFor}>
            {label}
        </label>
        {children}
    </div>
)
