import {
  Button,
  Card,
  ColorScheme,
  ColorSchemeProvider,
  Input,
  InputWrapper,
  MantineProvider,
  Title,
} from '@mantine/core'
import { useHotkeys, useLocalStorage } from '@mantine/hooks'
import axios from 'axios'
import { SetStateAction, useEffect, useState } from 'react'
import useWebSocket from 'react-use-websocket'
import './App.scss'
import magtag_back from './assets/magtag_back.png'
import magtag_front from './assets/magtag_front.png'

const GOLIOTH_API_KEY = 'LrGwo8cBREPS8fjqT40ARfPtykTwI8G3'
const GOLIOTH_PROD_URL = 'api.golioth.io/v1'
const GOLIOTH_WS_STATE_URL = (projectId: string, deviceId: string) =>
  `wss://${GOLIOTH_PROD_URL}/ws/projects/${projectId}/devices/${deviceId}/data?x-api-key=${GOLIOTH_API_KEY}`

const GOLIOTH_REST_STATE_URL = (
  projectId: string,
  deviceId: string,
  path?: string,
) =>
  `https://${GOLIOTH_PROD_URL}/projects/${projectId}/devices/${deviceId}/data/${path}`

function App() {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'mantine-color-scheme',
    defaultValue: 'light',
    getInitialValueInEffect: true,
  })

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'))

  useHotkeys([['mod+J', () => toggleColorScheme()]])
  const [displayBack, setDisplayBack] = useState(false)
  const [shouldConnect, setShouldConnect] = useState(false)

  // URL state
  const [apiKey, setApiKey] = useState('LrGwo8cBREPS8fjqT40ARfPtykTwI8G3')
  const [deviceId, setDeviceId] = useState('6283eedd71e8739f42672114')
  const [projectId, setProjectId] = useState('project-1')
  const [url, setUrl] = useState(GOLIOTH_WS_STATE_URL(projectId, deviceId))
  const [history, setHistory] = useState<any[]>([])

  // Error state
  const [error, setError] = useState('')

  // LEDs
  const [ledStates, setLedStates] = useState([0, 0, 0, 0])
  const [desiredState, setDesiredState] = useState<number | undefined>(
    undefined,
  )

  const { readyState, lastJsonMessage, getWebSocket } = useWebSocket(
    url,
    {
      onMessage: m => {
        setHistory(h => [m?.data, ...h])
        const error = JSON.parse(m?.data || '')?.error?.message
        if (!!error) return setError(error)
        return setError('')
      },
    },
    shouldConnect,
  )

  const handleConnectClick = () => {
    if (readyState === 1) {
      getWebSocket()?.close()
      setShouldConnect(false)
      return
    }

    setShouldConnect(true)
    setUrl(GOLIOTH_WS_STATE_URL(projectId, deviceId))
  }

  const updateLedStates = (cloudState: string) => {
    const states = cloudState
      .padStart(4, '0')
      .split('')
      .map(n => parseInt(n))
    setLedStates(states)
  }

  const checkLedOn = (ledIndex: number) => {
    if (ledStates[ledIndex] === 1) return 'on'
    return 'off'
  }

  const canConnect = !!projectId && !!apiKey && !!deviceId

  const handleSubmit = async () => {
    try {
      await axios.post(
        GOLIOTH_REST_STATE_URL(projectId, deviceId, 'leds'),
        desiredState,
        {
          headers: {
            'x-api-key': apiKey,
          },
        },
      )
    } catch (error: any) {
      console.error(error?.response?.data?.message)
      setError(error?.response?.data?.message)
    }
  }

  useEffect(() => {
    const leds = lastJsonMessage?.result?.data?.desired?.leds


    
    const light = lastJsonMessage?.result?.data?.state?.light

    if (light < 100) {
      toggleColorScheme('dark')
    } else {
      toggleColorScheme('light')
    }

    updateLedStates((leds >>> 0).toString(2))
    if (!desiredState) {
      setDesiredState(leds)
    }
  }, [lastJsonMessage])

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{ colorScheme }}
        withGlobalStyles
        withNormalizeCSS
      >
        <div className='app'>
          <Card>
            <div className='inputs'>
              <InputWrapper label='Golioth Project ID' required>
                <Input
                  type='text'
                  disabled={readyState === 1}
                  value={projectId}
                  onChange={(e: {
                    target: { value: SetStateAction<string> }
                  }) => setProjectId(e.target.value)}
                />
              </InputWrapper>
              <InputWrapper label='Project API Key' required>
                <Input
                  type='text'
                  disabled={readyState === 1}
                  value={apiKey}
                  onChange={(e: {
                    target: { value: SetStateAction<string> }
                  }) => setApiKey(e.target.value)}
                />
              </InputWrapper>
              <InputWrapper label='Device ID' required>
                <Input
                  type='text'
                  disabled={readyState === 1}
                  value={deviceId}
                  onChange={(e: {
                    target: { value: SetStateAction<string> }
                  }) => setDeviceId(e.target.value)}
                />
              </InputWrapper>
            </div>

            <div className='buttons'>
              <Button onClick={handleConnectClick} disabled={!canConnect}>
                {readyState === 1 ? 'Disconnect' : 'Connect'}
              </Button>
            </div>

            <div className='messages'>
              <div className='lightDB-state'>
                <Title order={2}>LightDB State:</Title>
                <pre>
                  {JSON.stringify(lastJsonMessage?.result?.data || {}, null, 2)}
                </pre>
              </div>
            </div>
            <Input
              width={200}
              type='number'
              value={desiredState}
              onChange={(e: { target: { value: string } }) =>
                setDesiredState(parseInt(e.target.value))
              }
            />
            <div>
              <Button onClick={handleSubmit}>Submit</Button>
              <Button
                variant='default'
                onClick={() => setDisplayBack(!displayBack)}
              >
                {!displayBack ? 'Show back' : 'Show front'}
              </Button>
            </div>

            <div className='img-container'>
              {!displayBack ? (
                <>
                  <div className={`led pos1 ${checkLedOn(0)}`} />
                  <div className={`led pos2 ${checkLedOn(1)}`} />
                  <div className={`led pos3 ${checkLedOn(2)}`} />
                  <div className={`led pos4 ${checkLedOn(3)}`} />
                  <img src={magtag_front} />
                </>
              ) : (
                <img src={magtag_back} />
              )}
            </div>
            <pre>{history.map(h => h).join('\n')}</pre>
          </Card>
        </div>
      </MantineProvider>
    </ColorSchemeProvider>
  )
}

export default App
