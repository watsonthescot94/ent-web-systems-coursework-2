const listAll = async (signal) => {
    try {
      let response = await fetch('/api/shop/', {
        method: 'GET',
        signal: signal,
      })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
}

export {
    listAll
}