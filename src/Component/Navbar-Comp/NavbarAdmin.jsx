import { useState } from 'react'
import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link} from "react-router-dom";
import imglogo from '../imgfile/esatpamlogo.png';
import { useAuth } from '../../context/AuthContext';

import { Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  NavItem,
  Nav,
  Button, } from 'reactstrap';
  
  function NavbarAdmin() {
  const { user, logout, isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div>
     <Navbar 
    color="light"
    light expand="lg"
   // fixed="top"
    >
      

      <NavbarBrand href="/" >
      <img
      alt='Logo'
      src={imglogo}
      style={{width: "50px", height: "50 px"}}
      />
      E-SATPAM
      </NavbarBrand>
      <NavbarToggler onClick={toggle} />
      <Collapse isOpen={isOpen} navbar>
        <Nav className="me-auto " navbar >
        

          <NavItem style={{marginLeft:'5px', marginBottom:'5px'}}>
            <Button href='/kelola-laporan' style={{borderRadius:'5px', color:"white"}} color='success' > 
              Informasi kehilangan
            </Button>
          </NavItem>
          <NavItem style={{marginLeft:'5px', marginBottom:'5px'}}> 
            <Button href='/tambah-laporan' 
            style={{borderRadius:'5px',
            color:"white"}}
            color='success' size='md'> 
              Tambah Berita Kehilangan
            </Button>
          </NavItem>

          {/* <NavItem style={{marginLeft:'5px', marginBottom:'5px'}}>
            <Button href="/list-aduan" color="success" size="md" >
             Daftar Pengaduan
            </Button>
          </NavItem> */}

          <NavItem style={{marginLeft:'5px', marginBottom:'5px'}}>
            <Button href='/tambah-laporan-satpam' style={{borderRadius:'5px'}} color='success' > 
            Buat Laporan
            </Button>
          </NavItem>
          <NavItem style={{marginLeft:'5px', marginBottom:'5px'}}>
            <Button href='/list-laporan' style={{borderRadius:'5px'}} color='success' > 
            Lihat Laporan
            </Button>
          </NavItem>

          {/* <UncontrolledDropdown nav inNavbar 
          style={{marginLeft:'5px', marginBottom:'5px', }}>
            <DropdownToggle nav caret>
              Kategori
            </DropdownToggle>
            <DropdownMenu end>
              {
              <DropdownItem>Kategori 1</DropdownItem>
              <DropdownItem>Kategori 2</DropdownItem>
              <DropdownItem>Kategori 3</DropdownItem>
              <DropdownItem>Kategori 4</DropdownItem>
              <DropdownItem>Kategori 5</DropdownItem>
              <DropdownItem divider />
              <DropdownItem>Semua Kategori</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown> */}


        </Nav>
        <div>
          <div>
             <Button color="danger" size="md" onClick={logout} outline >
             Logout
            </Button>
          </div>
        </div>
      </Collapse>
    </Navbar> 
    </div>
    
  );
}

export default NavbarAdmin;