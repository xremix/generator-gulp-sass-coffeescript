do ->
  setTimeout (->
    newSiteName = 'Hello JavaScript!'
    document.querySelector('h1').innerText = newSiteName
    return
  ), 1000
  return