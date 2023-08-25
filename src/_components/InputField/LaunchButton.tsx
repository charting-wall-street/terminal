import React, {FC, useState} from "react"

interface LaunchButtonProps {
    onSubmit: () => void
}

const LaunchButton: FC<LaunchButtonProps> = ({onSubmit}) => {
    const [launch, setLaunch] = useState<boolean>(false)
    return !launch ? (
        <button
            type="button"
            className="btn-launch"
            onClick={() => setLaunch(true)}
        >Launch</button>
    ) : (
        <div className="launch-confirm">
            <div className="launch-buttons">
                <button
                    type="button"
                    onClick={() => {
                        setLaunch(false)
                        onSubmit()
                    }}
                >Are you sure?
                </button>
                <button
                    type="button"
                    onClick={() => setLaunch(false)}
                >Cancel
                </button>
            </div>
        </div>
    )
}

export default LaunchButton
