import { NavLink, Outlet } from 'react-router-dom';
import Login from './login';
import logo from '../assets/icons/logo.png';

const marker = new Image(40, 40);
marker.src = logo;

const menuItems = [
  {
    label: 'CHALLENGES',
    link: 'challenges',
  },
  {
    label: 'CREATE',
    link: 'create'
  }
];


function BasicExample() {
  const navClass = 'nav-link ps-0 pe-0 ms-3 me-3';
  const navClassActive = navClass +' border-bottom border-2 border-primary active';
  return (
    <>
      <nav className='navbar navbar-expand-lg bg-body-tertiary border-bottom mb-4'>
        <div className='container'>
          <NavLink className="navbar-brand d-flex align-items-center" to='/' key='/'>
            <img src={logo} alt='OSM Localizer' style={{width: "35px", height: "35px", borderRadius: "50%"}} className="me-1"/>
            <span className='fs-4'>OSM Localizer</span>
          </NavLink>
          <div className='collapse navbar-collapse' id="navbarNav">
            <ul className="navbar-nav">
              {menuItems.map((item) => (
                <li className="nav-item">
                  <NavLink 
                    className={({ isActive }) =>isActive ? navClassActive : navClass} 
                    to={"/" + item.link} 
                    key={item.link} 
                  >
                    <span className='pb-1'>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Login />
          </div>
        </div>
      </nav>
      <Outlet />
    </>
  );
}

export default BasicExample;