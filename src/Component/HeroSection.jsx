import React from 'react'
import { Link } from "react-router-dom";
import { Button } from 'reactstrap';
import Navv from "./Navbar-Comp/NavbarPublic"
import Footer from "./Footer";



const HeroSection = ({bgImage }) => {
  
  return (
    
 <div>
   <section
      className="hero-section d-flex align-items-center text-center text-white"
      style={{
        minHeight: "90vh",
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
      }}
    >
      {/* <div>
<Navv/>
      </div> */}
      {/* Overlay blur */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backdropFilter: "blur(6px)", // efek blur seluruh hero
          backgroundColor: "rgba(0,0,0,0.5)", // semi-transparan biar teks jelas
        }}
      ></div>

      {/* Konten Hero */}
      <div className="container position-relative">
        <h1 className="display-3 fw-bold">E-Satpam</h1>
        <h1 className="display-3 fw-bold">Rumah Sakit Petro Graha Medika</h1>

        <p className="lead mb-4">
          Sahabat Menuju Sehat
        </p>
        <Button color='success'
        href="https://www.rspetrokimiagresik.com/" target ="#"
        size='lg'
        
        >
          Website Resmi RS Petro Kimia Gresik
        </Button>

        {/* <a href="#about" className="btn btn-primary btn-lg">
          Get Started
        </a> */}
      </div>
    </section>
    {/* <section>
      <div>
        <Footer />
      </div>
    </section> */}
 

  </div>
  );
  
}

export default HeroSection