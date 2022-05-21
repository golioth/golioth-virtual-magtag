import {
  ActionIcon,
  Button,
  ColorInput,
  ColorPicker,
  Input,
  Modal,
  Stack,
  Text,
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import React, { FC, useContext, useState } from 'react'
import { Refresh } from 'tabler-icons-react'
import { updateLeds } from '../shared/api'
import { Context } from '../shared/context'

export type LedState = [string, string, string, string]

interface Props {
  ledStates: LedState
  isConnected?: boolean
}

export const Leds: FC<Props> = ({ ledStates, isConnected }) => {
  const { apiKey, restApiUrl } = useContext(Context)
  const [showHighlight, setShowHighlight] = useState(true)

  // Modal State
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedLed, setSelectedLed] = useState<number | undefined>()
  const [selectedColor, setSelectedColor] = useState<string>('#000000')

  const checkLedOn = (ledIndex: number) => {
    if (!!ledStates?.[ledIndex]) return 'on'
    return 'off'
  }

  const style = (ledIndex: number) => {
    const color = ledStates?.[ledIndex]

    const background =
      !color || color === '#000000'
        ? 'transparent'
        : `radial-gradient(${ledStates?.[ledIndex]} 0%, transparent 60%`

    return {
      animationName: isConnected && showHighlight ? 'flash_border' : 'none',
      background,
    }
  }

  const onChangeLedColor = async (color?: string, ledIndex?: number) => {
    try {
      if (!color || ledIndex === undefined) return

      await updateLeds(restApiUrl, apiKey, { [ledIndex]: color })
      showNotification({
        color: 'green',
        message: `LED #${ledIndex} change sent!`,
      })
    } catch (e) {
      showNotification({
        color: 'red',
        message: `LED #${ledIndex} change didn't work!`,
      })
    }
  }

  const onOpenModal = (ledIndex: number) => {
    setSelectedLed(ledIndex)
    setModalVisible(true)
    setSelectedColor(ledStates?.[ledIndex] ?? '#000000')
  }

  const onClickLed = (ledIndex: number) => {
    if (!isConnected) return
    onOpenModal(ledIndex)
    setShowHighlight(false)
  }

  return (
    <>
      <div
        onClick={() => onClickLed(3)}
        className={`led pos3 ${checkLedOn(3)}`}
        style={style(3)}
      />
      <div
        onClick={() => onClickLed(2)}
        className={`led pos2 ${checkLedOn(2)}`}
        style={style(2)}
      />
      <div
        onClick={() => onClickLed(1)}
        className={`led pos1 ${checkLedOn(1)}`}
        style={style(1)}
      />
      <div
        onClick={() => onClickLed(0)}
        className={`led pos0 ${checkLedOn(0)}`}
        style={style(0)}
      />
      <Modal
        centered
        opened={modalVisible}
        onClose={() => setModalVisible(false)}
        title={`Updating LED color - #${selectedLed}`}
        size={300}
      >
        <Stack>
          <ColorPicker
            fullWidth
            value={selectedColor ?? '#000000'}
            onChange={color => setSelectedColor(color)}
          />

          <ColorInput
            placeholder='Pick color'
            value={selectedColor ?? '#000000'}
            onChange={color => setSelectedColor(color)}
            rightSection={
              <ActionIcon
                onClick={() =>
                  setSelectedColor(
                    `#${Math.floor(Math.random() * 16777215).toString(16)}`,
                  )
                }
              >
                <Refresh size={16} />
              </ActionIcon>
            }
          />
          <Button
            onClick={() => {
              onChangeLedColor(selectedColor, selectedLed)
              setModalVisible(false)
            }}
          >
            Save
          </Button>
        </Stack>
      </Modal>
    </>
  )
}
