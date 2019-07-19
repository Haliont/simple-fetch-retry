interface RetryParams {
    retries: number
    retryDelay: number
}

export function fetchRetry(url: string, retryParams: RetryParams, options = {}) {
    // default retryParams
    let retries = 3
    let retryDelay = 800

    // custom retryParams
    if (retryParams && retryParams.retries) retries = retryParams.retries
    if (retryParams && retryParams.retryDelay) retryDelay = retryParams.retryDelay
    let counter = 0

    return new Promise(resolve => {
        function callFetch() {
            fetch(url, options)
                .then(response => resolve(response))
                .catch(async (error) => {
                    if (counter < retries) {
                        retry()
                    } else {
                        throw new Error(`Не удалось загрузить данные | ${error.message}`)
                    }
                })
        }

        callFetch()

        function retry() {
            setTimeout(() => {
                counter++
                callFetch()
            }, retryDelay)
        }
    })

    function delay(time: number) {
        return new Promise(resolve => setTimeout(resolve, time));
    }
}
