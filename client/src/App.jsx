import { Routes, Route } from "react-router-dom";
import Lobby from "./pages/Lobby";

const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<Lobby />} />
      </Routes>
    </>
  );
};

export default App;
