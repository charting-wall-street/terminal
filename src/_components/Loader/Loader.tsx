import React, {FC} from "react"
import "./Loader.scss"

interface LoaderProps {
    width?: number
    height?: number
    label?: string
}

const Loader: FC<LoaderProps> = ({width, height, label}) => {
    return (
        <div
            className="loader"
            style={{width: width ? `${width}px` : undefined, height: height ? `${height}px` : undefined}}
        >
            <div className="loader-body">
                <div className="loader-spinner"/>
                {label ? (
                    <div className="loader-label">
                        {label}
                    </div>
                ) : null}
            </div>
        </div>
    )
}

export default Loader
