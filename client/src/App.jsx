import { Routes, Route } from "react-router-dom";
import Lobby from "./pages/Lobby";
import RoomPage from "./pages/Room";

const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<Lobby />} />
        <Route path='/room/:roomId' element={<RoomPage />} />
      </Routes>
    </>
  );
};

export default App;
