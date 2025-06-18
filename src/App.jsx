import AccountSettings from "./pages/AccountSettings"; // or "./forms/AccountSettings" if stored in forms
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Home from "./pages/Home";
import SignIn from "./pages/Sign-In";
import DropdownForm from "./components/Forms/forms.jsx"; // Import DropdownForm
import { LoaderPage } from "./components/Loader.jsx";
import SignUp from "./pages/Sign-up";
import { Pipeline } from "./pages/Pipeline.jsx";
import { Tables } from "./pages/Tables.jsx";
import PasswordBox from "./pages/EnterPassword.jsx";
import { Columns } from "./pages/Columns.jsx";
import { OdooModules } from "./pages/OdooModules.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import {
  SourceTables,
  DestTables,
  Password,
  SourceColumns,
  Title,
  Source_Rows,
  Odoo_Data,
} from "./components/Context.js";
import { Rows } from "./pages/Rows.jsx";

export default function App() {
  const [source_tables, setsource_tables] = useState(null);
  const [isSource, setisSource] = useState(null);
  const [source_columns, setsource_columns] = useState(null);
  const [source_rows, setsource_rows] = useState(null);
  const [dest_columns, setdest_columns] = useState(null);
  const [Global_Password, setGlobal_Password] = useState(null);
  const [odoo_data, setodoo_data] = useState(null);
  const [odoo_columns, setodoo_columns] = useState(null);
  const [odoo_records, setodoo_records] = useState(null);

  return (
    <Password.Provider value={{ Global_Password, setGlobal_Password }}>
      <SourceTables.Provider value={{ source_tables, setsource_tables }}>
        <DestTables.Provider value={{ dest_columns, setdest_columns }}>
          <SourceColumns.Provider value={{ source_columns, setsource_columns }}>
            <Title.Provider value={{ isSource, setisSource }}>
              <Source_Rows.Provider value={{ source_rows, setsource_rows }}>
                <Odoo_Data.Provider
                  value={{
                    odoo_data,
                    setodoo_data,
                    odoo_columns,
                    setodoo_columns,
                    odoo_records,
                    setodoo_records,
                  }}
                >
                  <BrowserRouter>
                    <Routes>
                      <Route path="/" element={<PasswordBox />} />
                      <Route path="/landingpage" element={<HomePage />} />
                      <Route path="/home" element={<Home />} />
                      <Route path="/SignUp" element={<SignUp />} />
                      <Route path="/SignIn" element={<SignIn />} />
                      <Route path="/dropdown" element={<DropdownForm />} />
                      <Route path="/pipeline" element={<Pipeline />} />
                      <Route path="/all-rows" element={<Rows />} />
                      <Route path="/loader" element={<LoaderPage />} />
                      <Route path="/account-settings" element={<AccountSettings />} />

                    </Routes>
                  </BrowserRouter>
                </Odoo_Data.Provider>
              </Source_Rows.Provider>
            </Title.Provider>
          </SourceColumns.Provider>
        </DestTables.Provider>
      </SourceTables.Provider>
    </Password.Provider>
  );
}
