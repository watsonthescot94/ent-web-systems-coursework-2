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
  console.log("Executing read() in api-blog.js");
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

export {
    listAll,
    read
}