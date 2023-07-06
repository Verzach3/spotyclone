import {Player} from "./components/Player.tsx";
import {SongsList} from "./components/SongsList.tsx";
import {PlaylistDrawer} from "./components/PlaylistDrawer.tsx";
import {SearchAffix} from "./components/SearchAffix.tsx";

function App() {

  return (
    <div style={{ overflow: "hidden"}}>
      <SearchAffix/>
      <SongsList/>
      <PlaylistDrawer/>
      <Player/>

    </div>
  )
}

export default App
