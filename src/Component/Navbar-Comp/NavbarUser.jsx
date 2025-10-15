import { useState } from 'react'
import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import imglogo from '../imgfile/esatpamlogo.png';
import { useAuth } from '../../context/AuthContext';

import { Collapse,
  Navbar,NavbarToggler,NavbarBrand,NavItem,Nav,UncontrolledDropdown,
  DropdownToggle,DropdownMenu,DropdownItem,Button, } from 'reactstrap';
  function NavbarFix() {
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
          {/* <NavItem style={{marginLeft:'5px', marginBottom:'5px'}}>
            <Button href='/berita' style={{borderRadius:'5px', color:"white"}} color='success' > 
              Informasi kehilangan
            </Button>
          </NavItem> */}
          
          <NavItem style={{marginLeft:'5px', marginBottom:'5px'}}> 
            {/* <Button href='/list-aduan' 
            style={{borderRadius:'5px',
            color:"white"}}
            color='success' size='md'> 
              Lihat Pengaduan
            </Button> */}
          </NavItem>
          <NavItem style={{marginLeft:'5px', marginBottom:'5px'}}> 
            <Button href='/list-laporan' 
            style={{borderRadius:'5px',
            color:"white"}}
            color='success' size='md'> 
              Lihat Laporan
            </Button>
          </NavItem>

          <UncontrolledDropdown nav inNavbar
            style={{marginLeft:'5px',
            marginBottom:'5px',
            maxWidth : "140px",
            maxHeight : '80px',
            background:'#1a8754',
            borderRadius :'5px', 
            justifyItems : 'center',
            zIndex :'90'
          }}>
            <DropdownToggle  nav caret 
            style={{color: "#fafafa",
            textAlign : "center", fontSize:'16px', fontWeight:'400', justifyItems : 'center',
            }}>
              Kelola laporan
            </DropdownToggle>
            <DropdownMenu end>
              <DropdownItem href='/tambah-laporan'>Buat Laporan Kehilangan</DropdownItem>
              <DropdownItem href='/tambah-laporan-satpam'>Buat Laporan Satpam </DropdownItem>
              <DropdownItem href='/kelola-laporan' >Lihat informasi Barang Hilangan</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
            

        </Nav>
        <div>
          <div>
            <Button color="danger" size="md" onClick={logout} outline>
            Logout
            </Button>
          </div>
        </div>
      </Collapse>
    </Navbar> 
    </div>
    
  );
}

export default NavbarFix;