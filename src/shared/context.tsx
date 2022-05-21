import React, { createContext, FC, useEffect, useState } from 'react'

const getStoredState = (key: string) => localStorage.getItem(key)

const initialContextState = {
  goliothApiUrl: getStoredState('golioth-api-url') ?? 'api.golioth.io/v1',
  projectId: getStoredState('golioth-project-id') ?? '',
  apiKey: getStoredState('golioth-api-key') ?? '',
  deviceId: getStoredState('golioth-device-id') ?? '',
  restApiUrl: '',
  setGoliothApiUrl: (t: string) => {},
  setApiKey: (t: string) => {},
  setDeviceId: (t: string) => {},
  setProjectId: (t: string) => {},
}

export const Context = createContext(initialContextState)

export const ContextProvider: FC = ({ children }) => {
  const [goliothApiUrl, setGoliothApiUrl] = useState(
    initialContextState.goliothApiUrl,
  )
  const [apiKey, setApiKey] = useState(initialContextState.apiKey)
  const [deviceId, setDeviceId] = useState(initialContextState.deviceId)
  const [projectId, setProjectId] = useState(initialContextState.projectId)
  const [restApiUrl, setRestApiUrl] = useState(initialContextState.restApiUrl)

  useEffect(() => {
    setRestApiUrl(
      `https://${goliothApiUrl}/projects/${projectId}/devices/${deviceId}/data/`,
    )

    // save on local storage
    localStorage.setItem('golioth-api-url', goliothApiUrl)
    localStorage.setItem('golioth-api-key', apiKey)
    localStorage.setItem('golioth-device-id', deviceId)
    localStorage.setItem('golioth-project-id', projectId)
  }, [goliothApiUrl, projectId, deviceId, projectId])

  return (
    <Context.Provider
      value={{
        goliothApiUrl,
        apiKey,
        deviceId,
        projectId,
        restApiUrl,
        setGoliothApiUrl,
        setApiKey,
        setDeviceId,
        setProjectId,
      }}
    >
      {children}
    </Context.Provider>
  )
}
