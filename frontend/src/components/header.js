import { Link, Outlet } from 'react-router-dom';

const menuItems = [
    {
      label: 'challenges',
      link: 'challenges',
    },
    {
      label: 'create',
      link: 'create'
    }
  ];


function BasicExample() {
  return (
    <>
      <nav className='navbar navbar-expand-lg bg-body-tertiary border-bottom mb-4'>
        <div className='container'>
              <Link className="navbar-brand" to='/' key='/'>
                      OSM Localizer
              </Link>
          <div className='navbar-toggle' aria-controls="basic-navbar-nav" />
          <div className='navbar-collapse' id="basic-navbar-nav">
            <div className="nav me-auto">
              {menuItems.map((item) => (
                  <Link className="nav-link" to={"/"+item.link} key={item.link}>
                      {item.label}
                  </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>
      <Outlet />
    </>
  );
}

export default BasicExample;