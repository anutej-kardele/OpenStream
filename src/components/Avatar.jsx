const AVATAR_COLORS = [
    '#B64F41',
    '#1d4bc9',
    '#b5430b',
    '#fb8a00',
    '#f6df9a',
    '#648DAD',
    '#F9E270',
    '#A2CD63',
    '#45AE5F',
    '#B8718B',
    '#517D7F',
    '#71628D',
]

function getInitials(name = '') {
    const parts = name
        .trim()
        .split(/\s+/)
        .filter(Boolean)

    if (parts.length === 0) {
        return '?'
    }

    if (parts.length === 1) {
        return parts[0][0].toUpperCase()
    }

    return (
        parts[0][0] +
        parts[parts.length - 1][0]
    ).toUpperCase()
}

function hashString(value = '') {
    let hash = 0

    for (let i = 0; i < value.length; i++) {
        hash = value.charCodeAt(i) + ((hash << 5) - hash)
    }

    return hash >>> 0
}

function hexToHsl(hex) {
    const r = parseInt(hex.slice(1, 3), 16) / 255
    const g = parseInt(hex.slice(3, 5), 16) / 255
    const b = parseInt(hex.slice(5, 7), 16) / 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)

    let h = 0
    let s = 0
    const l = (max + min) / 2

    if (max !== min) {
        const d = max - min

        s = l > 0.5
            ? d / (2 - max - min)
            : d / (max + min)

        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0)
                break

            case g:
                h = (b - r) / d + 2
                break

            case b:
                h = (r - g) / d + 4
                break
        }

        h *= 60
    }

    return {
        h,
        s: s * 100,
        l: l * 100
    }
}

function getAvatarColor(value = '') {
    const hash = hashString(value.toLowerCase())

    // Pick the base color family
    const index = hash % AVATAR_COLORS.length
    const baseColor = AVATAR_COLORS[index]

    const { h, s, l } = hexToHsl(baseColor)

    // Create a slightly different shade for each user
    const hueOffset = ((hash >>> 8) % 9) - 4
    const saturationOffset = ((hash >>> 16) % 11) - 5
    const lightnessOffset = ((hash >>> 24) % 13) - 6

    const finalHue = (h + hueOffset + 360) % 360

    const finalSaturation = Math.max(
        40,
        Math.min(85, s + saturationOffset)
    )

    const finalLightness = Math.max(
        38,
        Math.min(65, l + lightnessOffset)
    )

    return `hsl(${finalHue}, ${finalSaturation}%, ${finalLightness}%)`
}

function getTextColor(backgroundColor) {
    const match = backgroundColor.match(
        /hsl\(([\d.]+),\s*([\d.]+)%,\s*([\d.]+)%\)/
    )

    if (!match) {
        return '#ffffff'
    }

    const lightness = Number(match[3])

    return lightness > 58
        ? '#18181b'
        : '#ffffff'
}

const sizes = {
    sm: 'w-9 h-9 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg'
}

export default function Avatar({
    username,
    handle,
    size = 'md'
}) {
    const initials = getInitials(username)

    const backgroundColor = getAvatarColor(
        handle || username
    )

    const textColor = getTextColor(backgroundColor)

    return (
        <div
            className={`
                ${sizes[size]}
                rounded-full
                shrink-0
                flex
                items-center
                justify-center
                font-semibold
                select-none
            `}
            style={{
                backgroundColor,
                color: textColor
            }}
            title={username}
        >
            {initials}
        </div>
    )
}