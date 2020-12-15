import React from 'react'

import { ReactOsmGeocoding, Result } from 'react-osm-geocoding'
import 'react-osm-geocoding/dist/index.css'

const App = () => {
  return <ReactOsmGeocoding callback={(result:Result)=> console.log(result)}/>
}

export default App
