import { showNotification } from '@mantine/notifications'
import React, { FC, useContext, useState } from 'react'
import { updateButton } from '../shared/api'
import { Context } from '../shared/context'

interface Props {
  isConnected?: boolean
}

export const Buttons: FC<Props> = ({ isConnected }) => {
  const { apiKey, restApiUrl } = useContext(Context)
  const [showHighlight, setShowHighlight] = useState(true)

  const onClickButton = async (buttonIndex: number) => {
    if (!isConnected) return
    setShowHighlight(false)
    try {
      await updateButton(restApiUrl, apiKey, true)
      showNotification({
        color: 'green',
        message: `Button D${buttonIndex} press sent!`,
      })
    } catch (e) {
      showNotification({
        color: 'red',
        message: `Button D${buttonIndex} press didn't work!`,
      })
    }
  }

  return (
    <>
      <div
        onClick={() => onClickButton(15)}
        className={`button pos15`}
        style={{
          animationName: isConnected && showHighlight ? 'flash_border' : 'none',
        }}
      />
      <div
        onClick={() => onClickButton(14)}
        className={`button pos14`}
        style={{
          animationName: isConnected && showHighlight ? 'flash_border' : 'none',
        }}
      />
      <div
        onClick={() => onClickButton(12)}
        className={`button pos12`}
        style={{
          animationName: isConnected && showHighlight ? 'flash_border' : 'none',
        }}
      />
      <div
        onClick={() => onClickButton(11)}
        className={`button pos11`}
        style={{
          animationName: isConnected && showHighlight ? 'flash_border' : 'none',
        }}
      />
    </>
  )
}
