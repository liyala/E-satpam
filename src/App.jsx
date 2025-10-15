import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./Component/ProtectedRoute";
import Login from "./Component/LoginPage";
import Regis from "./Component/Register";
import Dashboard from "./Component/Dashboard";
import Landing from "./Component/HeroSection.jsx";
import AddLaporan from "./Component/Laporan-Comp/AddLaporan.jsx";
import TambahLaporan from "./Component/Laporan-Comp/AddLaporanMultiple.jsx";
// import UserDashboard from "./Component/UserDashboard";
// import FromAduan from "./Component/FormPengaduan.jsx";
// import ListPengaduan from "./Component/Listpengaduan";
import ListLaporanSatpam from "./Component/Laporan-Comp/ListLaporanSatpam.jsx";
import KelolaLaporan from "./Component/CRUDLaporan.jsx";
import Detailpage from "./Component/Laporan-Comp/DetailPage.jsx";
import ListLaporanpublic from "./Component/Laporan-Comp/ListLaporanpublic.jsx";
import UpdatePage from "./Component/Laporan-Comp/UpdatePage.jsx";
import bg from "./Component/imgfile/bg-gramed.jpg";
import Footer from "./Component/Footer.jsx";
import Navvpublic from "./Component/Navbar-Comp/NavbarPublic.jsx";
//import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/landing" element={<> <Landing bgImage={bg}/> <Footer/> <Navvpublic/> </>}></Route>
            <Route path="/login" element={<Login/>}/>
            {/* router declarasi disini */}
            {/* <Route path="/list-aduan" element={<ListPengaduan/>} ></Route> */}
            {/* <Route path="/form-pengaduan" element={<FromAduan/>}> </Route> */}
            <Route path="/list-berita-public" element={<ListLaporanpublic/>} ></Route>
            <Route path="/article/:id" element={<Detailpage />}></Route>
            <Route path="/update/:id" element={<UpdatePage/>}> </Route>
            {/* <Route path="/article/:id" element={<DetailPagepublic />}></Route> */}
            <Route path="/tambah-laporan" element = {<AddLaporan/>}></Route>
            <Route path="/tambah-laporan-satpam" element = {<TambahLaporan/>} ></Route>
            <Route path="/list-laporan" element={<ListLaporanSatpam/>}></Route>
            <Route path="/kelola-laporan" element={<KelolaLaporan/>}></Route>
            <Route path="/Regis" element={<Regis />}></Route>
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;