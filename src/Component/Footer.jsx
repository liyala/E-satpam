import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4 mt-1">
      <div className="container text-center">
        <p className="mb-2">
          &copy; {new Date().getFullYear()} Team Magang PT Petro Graha Medika. All rights reserved.
        </p>
        <div>
          <a href="#privacy" className="text-white me-3 text-decoration-none">
            Privacy Policy
          </a>
          <a href="#terms" className="text-white me-3 text-decoration-none">
            Terms of Service
          </a>
          <a href="#contact" className="text-white text-decoration-none">
            Contact Us
          </a>
        </div>
        <div className="mt-3">
          <a href="#blank" className="text-white me-3">
            <i className="bi bi-facebook"></i>
          </a>
          <a href="#blank" className="text-white me-3">
            <i className="bi bi-twitter"></i>
          </a>
          <a href="#blank" className="text-white">
            <i className="bi bi-instagram"></i>
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer