const getJson = async url => {
  try {
    const respone = await fetch(url, {
      headers: {
        'content-type': 'application/json'
      },
      method: 'GET',
      cache: 'reload'
    });
    return await respone.json();
  } catch (err) {
    console.error('In getJson', err);
  }

}