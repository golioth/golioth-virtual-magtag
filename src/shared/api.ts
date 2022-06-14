import axios from 'axios'

export async function updateText(url: string, apiKey: string, data: string) {
  const response = await axios.post(
    `${url}/desired`,
    {
      text: data,
    },
    {
      headers: {
        'x-api-key': apiKey,
      },
    },
  )

  return response.data
}

export async function sendBuzz(url: string, apiKey: string, data: boolean) {
  const response = await axios.post(`${url}/desired/buzz`, data, {
    headers: {
      'x-api-key': apiKey,
    },
  })

  return response.data
}

export async function updateLeds(
  url: string,
  apiKey: string,
  data: Record<string, string>,
) {
  const response = await axios.post(`${url}/desired/leds`, data, {
    headers: {
      'x-api-key': apiKey,
    },
  })

  return response.data
}

export async function updateButton(
  url: string,
  apiKey: string,
  data: boolean,
) {
  const response = await axios.post(`${url}/desired/buzz`, data, {
    headers: {
      'x-api-key': apiKey,
    },
  })

  return response.data
}
