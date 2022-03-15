import { useEffect, useState } from 'react'

type CopyButtonProps = {
    input: string
    delay?: number
    className?: string
}
enum ButtonTexts {
    active = 'copied',
    inactive = 'copy',
}
const CopyButton = ({ input, className='', delay=3000 }:CopyButtonProps) => {
    let timeout:NodeJS.Timeout
    const [buttonText, setButtonText] = useState(ButtonTexts.inactive)
    const onClick = () => {
        setButtonText(ButtonTexts.active)
        navigator.clipboard.writeText(input)
    }
    useEffect(() => {
        if (buttonText === ButtonTexts.active) {
            if (timeout) {
                clearTimeout(timeout)
            }
            timeout = setTimeout(() => setButtonText(ButtonTexts.inactive), delay)
        }
    }, [buttonText])
    return <button onClick={onClick} className={className}>{buttonText}</button>
}

export default CopyButton
