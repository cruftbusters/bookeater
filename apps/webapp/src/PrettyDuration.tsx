export function PrettyDuration({ seconds }: { seconds: number }) {
  const displaySeconds = seconds / 60 < 5
  const secondsString =
    displaySeconds && seconds % 60 > 0 ? `${seconds % 60}s` : ''
  const minutes = (seconds / 60) % 60
  const minutesString =
    minutes > 0
      ? `${displaySeconds ? Math.floor(minutes) : Math.round(minutes)}m`
      : ''
  const hours = Math.floor(seconds / 60 / 60)
  const hoursString = hours > 0 ? `${hours}h` : ''
  return `${hoursString}${minutesString}${secondsString}`
}
