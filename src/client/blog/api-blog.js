const listAll = async (signal) => {
    try {
      let response = await fetch('/api/blogs/', {
        method: 'GET',
        signal: signal,
      })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
}

const read = async (params, signal) => {
    try {
      let response = await fetch('/api/blogs/' + params.blog_id, {
        method: 'GET',
        signal: signal
      })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
}

const update = async (data, credentials) => {
  try {
    let response = await fetch('/api/blogs/' + data.blog._id, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      },
      body: JSON.stringify(data)
    })
    console.log("BODYYYYYYYYYY:");
    console.log(body);
    return await response.json()
  } catch(err) {
    console.log(err)
  }
}

export {
    listAll,
    read,
    update
}