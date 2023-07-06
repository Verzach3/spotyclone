import {Player} from "./components/Player.tsx";
import {SongsList} from "./components/SongsList.tsx";
import {PlaylistDrawer} from "./components/PlaylistDrawer.tsx";

function App() {

  return (
    <>
      <SongsList/>
      <PlaylistDrawer/>
      <Player/>

    </>
  )
}

export default App
