interface RetryParams {
  retries?: number
  retryDelay?: number
}

const delay = (time: number) => new Promise(resolve => setTimeout(resolve, time));

export function fetchRetry(url: string, retryParams: RetryParams = {}, options = {}) {
  const { retries = 3, retryDelay = 800 } = retryParams

  return new Promise(resolve => {
      function callFetch(attempts: number) {
        fetch(url, options)
          .then(resolve)
          .catch(async (error) => {
              if (attempts < retries) {
                  await delay(retryDelay)
                  callFetch(attempts + 1)
              } else {
                  throw new Error(`Не удалось загрузить данные | ${error.message}`)
              }
          })
      }

      callFetch(1)
  })
}
