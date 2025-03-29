import { useState } from 'react';
import { Concert } from './Concert';
import { BandList } from './BandList';
import skaBand from './band-json/ska-band.json';
import kpopBand from './band-json/kpop-band.json';
import punkBand from './band-json/punk-band.json';

function App() {
  const [bandIndex, setBandIndex] = useState(0);
  const bands = [skaBand, kpopBand, punkBand];

  return (
    <div className="App">
      <BandList bands={bands} setBandIndex={setBandIndex} />
      <Concert band={bands[bandIndex]} />
    </div>
  );
}

export default App;
