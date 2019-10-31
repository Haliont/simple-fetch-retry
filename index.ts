interface RetryParams {
  retries?: number
  retryDelay?: number
}

const delay = (time: number) => new Promise(resolve => setTimeout(resolve, time));

export function fetchRetry(url: string, retryParams: RetryParams = {}, options = {}) {
  const { retries = 3, retryDelay = 800 } = retryParams
  if (retries < 1) throw new Error('Параметр retries должен быть больше 0');

  return new Promise(resolve => {
      function callFetch(attempts: number) {
        fetch(url, options)
          .then(resolve)
          .catch(async (error: Error) => {
              if (attempts === 0) {
                throw new Error(`Не удалось загрузить данные | ${error.message}`)
              }

              await delay(retryDelay)
              callFetch(attempts - 1)
          })
      }

      callFetch(retries - 1)
  })
}
