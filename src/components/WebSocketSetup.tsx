import {
  Button,
  Col,
  Grid,
  Input,
  InputWrapper,
  PasswordInput,
} from '@mantine/core'
import React, { FC, useContext } from 'react'
import { WebSocketHook } from 'react-use-websocket/dist/lib/types'
import { Context } from '../shared/context'

interface Props {
  ws: WebSocketHook<MessageEvent<any>>
  setWsUrl: React.Dispatch<React.SetStateAction<string>>
  setShouldConnect: React.Dispatch<React.SetStateAction<boolean>>
}

export const WebSocketSetup: FC<Props> = ({
  ws,
  setWsUrl,
  setShouldConnect,
}) => {
  const { readyState, getWebSocket } = ws

  const {
    apiKey,
    deviceId,
    goliothApiUrl,
    projectId,
    setApiKey,
    setDeviceId,
    setGoliothApiUrl,
    setProjectId,
  } = useContext(Context)

  const getFullWsUrl = () =>
    `wss://${goliothApiUrl}/ws/projects/${projectId}/devices/${deviceId}/data?x-api-key=${apiKey}`

  const handleConnectClick = () => {
    if (readyState === 1) {
      getWebSocket()?.close()
      setShouldConnect(false)
      return
    }

    setWsUrl(getFullWsUrl())
    setShouldConnect(true)
  }

  const canConnect = !!goliothApiUrl && !!projectId && !!apiKey && !!deviceId

  return (
    <>
      <Grid grow>
        <Col span={3}>
          <InputWrapper label='Golioth API URL' required>
            <Input
              style={{ minWidth: 200 }}
              disabled={readyState === 1}
              value={goliothApiUrl}
              onChange={(e: { target: { value: string } }) =>
                setGoliothApiUrl(e.target.value)
              }
            />
          </InputWrapper>
        </Col>
        <Col span={3}>
          <InputWrapper label='Golioth Project ID' required>
            <Input
              style={{ minWidth: 200 }}
              disabled={readyState === 1}
              value={projectId}
              onChange={(e: { target: { value: string } }) =>
                setProjectId(e.target.value)
              }
            />
          </InputWrapper>
        </Col>
        <Col span={3}>
          <InputWrapper label='Project API Key' required>
            <PasswordInput
              style={{ minWidth: 200 }}
              disabled={readyState === 1}
              value={apiKey}
              onChange={(e: { target: { value: string } }) =>
                setApiKey(e.target.value)
              }
            />
          </InputWrapper>
        </Col>
        <Col span={3}>
          <InputWrapper label='Device ID' required>
            <Input
              style={{ minWidth: 200 }}
              disabled={readyState === 1}
              value={deviceId}
              onChange={(e: { target: { value: string } }) =>
                setDeviceId(e.target.value)
              }
            />
          </InputWrapper>
        </Col>
      </Grid>
      <Button
        mt={16}
        fullWidth
        onClick={handleConnectClick}
        disabled={!canConnect}
      >
        {readyState === 1 ? 'Disconnect' : 'Listen to LightDB'}
      </Button>
    </>
  )
}
