import { Progress } from '@mantine/core'
import React, { FC } from 'react'

interface Props {
  light: number
}

export const Light: FC<Props> = ({ light }) => {
  const getColor = (intensity: number) => {
    if (intensity > 1000) return 'red'
    if (intensity > 300) return 'orange'
    if (intensity > 100) return 'yellow'
    if (intensity > 80) return 'lime'
    if (intensity > 50) return 'green'
    return 'blue'
  }

  return (
    <Progress
      className='light'
      color={getColor(light)}
      value={light / 5}
      radius='xs'
      size='md'
    />
  )
}
