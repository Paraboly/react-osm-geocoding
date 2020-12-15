import React from 'react'

import { ReactOsmGeocoding, Result } from 'react-osm-geocoding'
import 'react-osm-geocoding/dist/index.css'

const App = () => {
  return <ReactOsmGeocoding viewbox="30.767746,37.160083,34.722824,38.811662" callback={(result:Result)=> console.log(result)}/>
}

export default App
