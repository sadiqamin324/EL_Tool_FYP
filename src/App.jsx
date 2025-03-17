import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Home from "./pages/Home";
import SignIn from "./pages/Sign-In";
import DropdownForm from "./components/Forms/forms.jsx"; // Import DropdownForm
import SignUp from "./pages/Sign-up";
import { Pipeline } from "./pages/Pipeline.jsx";
import { Tables } from "./pages/Tables.jsx";
import { Columns } from "./pages/Columns.jsx";
import {
  SourceTables,
  DestTables,
  Password,
  SourceColumns,
  Title,
  Source_Rows,
} from "./components/Context.js";
import { Rows } from "./pages/Rows.jsx";

export default function App() {
  const [source_tables, setsource_tables] = useState(null);
  const [isSource, setisSource] = useState(null);
  const [source_columns, setsource_columns] = useState(null);
  const [source_rows, setsource_rows] = useState(null);
  const [dest_columns, setdest_columns] = useState(null);
  const [Global_Password, setGlobal_Password] = useState(null);

  return (
    <SourceTables.Provider value={{ source_tables, setsource_tables }}>
      <DestTables.Provider value={{ dest_columns, setdest_columns }}>
        <Password.Provider value={{ Global_Password, setGlobal_Password }}>
          <SourceColumns.Provider value={{ source_columns, setsource_columns }}>
            <Title.Provider value={{ isSource, setisSource }}>
              <Source_Rows.Provider value={{ source_rows, setsource_rows }}>
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/SignUp" element={<SignUp />} />
                    <Route path="/SignIn" element={<SignIn />} />
                    <Route path="/dropdown" element={<DropdownForm />} />
                    <Route path="/pipeline" element={<Pipeline />} />
                    <Route path="/all-tables" element={<Tables />} />
                    <Route path="/all-columns" element={<Columns />} />
                    <Route path="/all-rows" element={<Rows />} />
                  </Routes>
                </BrowserRouter>
              </Source_Rows.Provider>
            </Title.Provider>
          </SourceColumns.Provider>
        </Password.Provider>
      </DestTables.Provider>
    </SourceTables.Provider>
  );
}
