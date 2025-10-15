import { useState } from 'react'
import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link} from "react-router-dom";
import imglogo from '../imgfile/esatpamlogo.png';
import Landing from "../HeroSection"
import bg from "../imgfile/bg-gramed.jpg"
import { useAuth } from '../../context/AuthContext';

import { Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  NavItem,
  Nav,
  NavLink,
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
    fixed="top"
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
            <Button href='/list-berita-public' style={{marginRight:'5px' ,borderRadius:'5px', color:"white"}} color='success' > 
              Informasi kehilangan
            </Button >        
            <Button target="_blank" href='https://www.crmsrspg.my.id/pengaduan.php' style={{marginRight:'5px' ,borderRadius:'5px', color:"white"}} color='success' >
              Pengaduan Layanan
            </Button>
          </NavItem>
        </Nav>
         <div>
          <div>
            <Button
             tag={Link}
            to = "/login"
              color="primary"
              href="/login"
              size='md'
              >Masuk
            </Button>
          </div>
        </div>
      </Collapse>
    </Navbar> 
    {/* <div>
    <Landing bgImage={bg}/>
    </div> */}
    </div>
    
  );
}

export default NavbarFix;