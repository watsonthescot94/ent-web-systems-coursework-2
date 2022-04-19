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

const addToCart = async (data, credentials) => {
    try {
      let response = await fetch('/api/addtocart/' + data.current_user.id, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        },
        body: JSON.stringify(data)
      })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
}

export {
    listAll,
    addToCart
}