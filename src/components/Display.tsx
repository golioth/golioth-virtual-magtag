import { Button, Modal, Stack, Textarea } from '@mantine/core'
import React, { FC, useContext, useState } from 'react'
import { updateText } from '../shared/api'
import { Context } from '../shared/context'

interface Props {
  text: string
  isConnected?: boolean
}

export const Display: FC<Props> = ({ text, isConnected }) => {
  const { restApiUrl, apiKey } = useContext(Context)
  const [showHighlight, setShowHighlight] = useState(true)

  const [newText, setNewText] = useState('')

  const [fontSize, setFontSize] = useState<number | undefined>(
    document.documentElement.clientWidth,
  )
  const [modalVisible, setModalVisible] = useState(false)

  const style = {
    fontSize: fontSize && fontSize > 50 ? `${fontSize / 6.4}px` : '3em',
    animationName: isConnected && showHighlight ? 'flash_border' : 'none',
  }

  return (
    <>
      <textarea
        disabled={!isConnected}
        value={text}
        style={style}
        className='text'
        onChange={() => {}}
        onClick={() => {
          setNewText(text)
          setModalVisible(true)
          setShowHighlight(false)
        }}
        ref={el => {
          setFontSize(el?.getBoundingClientRect().width)
        }}
      />
      <Modal
        centered
        opened={modalVisible}
        onClose={() => setModalVisible(false)}
        title={`Updating display text`}
        size={300}
      >
        <Stack>
          <Textarea
            minRows={5}
            value={newText}
            onChange={(e: { target: { value: string } }) =>
              setNewText(e.target.value)
            }
          />
          <Button
            onClick={() => {
              updateText(restApiUrl, apiKey, newText)
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
