import {
  ActionIcon,
  Card,
  Center,
  Container,
  Divider,
  Group,
  Image,
  Title,
  useMantineColorScheme,
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import React, { FC, useEffect, useState } from 'react'
import useWebSocket from 'react-use-websocket'
import { MoonStars, Sun } from 'tabler-icons-react'
import magtag_front from '../assets/images/magtag_front.png'
import golioth_logo from '../assets/images/golioth-logo.png'
import { Buttons } from './Buttons'
import { Display } from './Display'
import { Leds, LedState } from './Leds'
import { Light } from './Light'
import { WebSocketSetup } from './WebSocketSetup'

export const VirtualMagTag: FC = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()
  const dark = colorScheme === 'dark'
  const [shouldConnect, setShouldConnect] = useState(false)
  const [wsUrl, setWsUrl] = useState('')

  const [ledStates, setLedStates] = useState<LedState>(['', '', '', ''])
  const [text, setText] = useState('waiting\nfor\nconnection...')
  const [light, setLight] = useState(0)

  const onMessage = (m: WebSocketEventMap['message']) => {
    const error = JSON.parse(m?.data || '')?.error?.message

    return (
      error &&
      showNotification({
        color: 'red',
        message: error || 'Unknown Error',
      })
    )
  }

  const onError = (e: WebSocketEventMap['error']) => {
    showNotification({
      color: 'red',
      message: 'Websocket connection to server failed',
    })
  }

  const ws = useWebSocket(wsUrl, { onMessage, onError }, shouldConnect)

  useEffect(() => {
    const text = ws.lastJsonMessage?.result?.data?.state?.text
    const leds = ws.lastJsonMessage?.result?.data?.state?.leds
    const light = ws.lastJsonMessage?.result?.data?.state?.light

    if (light > 50) {
      toggleColorScheme('light')
    } else {
      toggleColorScheme('dark')
    }

    setText(text)
    setLedStates(leds)
    setLight(light)
  }, [ws.lastJsonMessage])

  return (
    <div className='app'>
      <Card>
        <Group position='apart'>
          <Group>
            <Image src={golioth_logo} height={40} />
            <Title>Virtual MagTag</Title>
          </Group>
          <ActionIcon
            variant='outline'
            color={dark ? 'yellow' : 'blue'}
            onClick={() => toggleColorScheme()}
            title='Toggle color scheme'
          >
            {dark ? <Sun size={18} /> : <MoonStars size={18} />}
          </ActionIcon>
        </Group>
        <Divider mt={16} mb={16} />
        <WebSocketSetup
          ws={ws}
          setWsUrl={setWsUrl}
          setShouldConnect={setShouldConnect}
        />
        <Container mt={16}>
          <Center>
            <div className='magtag'>
              <Leds ledStates={ledStates} isConnected={ws.readyState === 1} />
              <Light light={light} />
              <Display text={text} isConnected={ws.readyState === 1} />
              <Buttons isConnected={ws.readyState === 1} />
              <Image src={magtag_front} />
            </div>
          </Center>
        </Container>
      </Card>
    </div>
  )
}
