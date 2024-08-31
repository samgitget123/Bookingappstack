import React from 'react'

const Header = () => {
  return (
    <>
      <div className="row">
        <div className="col-lg-12 col-md-12 col-sm-12">
          <nav className="navbar bg-dark border-bottom border-body" data-bs-theme="dark">
            <div className="container d-flex  ms-auto">
             <div>
                <a className="navbar-brand" href="/">Book Your <span className='text-warning'>Ground</span></a>
             </div>
           
            </div>
          </nav>
        </div >
      </div >
    </>
  )
}

export default Header