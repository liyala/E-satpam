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
        

          <NavItem style={{marginLeft:'5px', marginBottom:'5px'}}>
            <Button href='/berita' style={{borderRadius:'5px', color:"white"}} color='success' > 
              Informasi kehilangan
            </Button>
           
          </NavItem>
          
          <NavItem style={{marginLeft:'5px', marginBottom:'5px'}}> 
            <Button href='/tambah-berita' 
            style={{borderRadius:'5px',
            color:"white"}}
            color='success' size='md'> 
              Tambah Berita
            </Button>
          </NavItem>

          {/* <NavItem style={{marginLeft:'5px', marginBottom:'5px'}}>
            <Button href='/components' style={{borderRadius:'5px' , color:"white" }}
            color="danger" 
            > 
              Components  
            </Button>
            {/* <NavLink href="/components/">Components</NavLink> 
          </NavItem> */}

          {/* <NavItem style={{marginLeft:'5px', marginBottom:'5px'}}>
            <Button href='/laporan' style={{borderRadius:'5px' ,color:"white"}} color='danger' > 
            Laporan
            </Button>
            {/* <NavLink href="/laporan/">Laporan</NavLink> 
          </NavItem> */}

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
          {/* <div>
            <Button
             tag={Link}
            to = "/login"
              color="danger"
              href="/LoginPage"
              size='md'
              >login
            </Button>
          </div> */}
        </div>
      </Collapse>
    </Navbar> 
    </div>
    
  );
}

export default NavbarFix;