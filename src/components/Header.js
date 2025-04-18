import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Film,
  Calendar,
  BarChart,
  Users,
  List,
  LayoutDashboard,
  MonitorPlay,
  Theater,
} from 'lucide-react';

export default function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className='wrapper skin-blue'>
      <header className='main-header'>
        {/* Logo */}
        <Link to='/' className='logo'>
          <b>Admin</b>LTE
        </Link>

        {/* Navbar */}
        <nav className='navbar navbar-static-top' role='navigation'>
          {/* Sidebar toggle button */}
          <button
            onClick={toggleSidebar}
            className='sidebar-toggle'
            aria-label='Toggle navigation'
          >
            <span className='sr-only'>Toggle navigation</span>
          </button>

          <div className='navbar-custom-menu'>
            <ul className='nav navbar-nav'>
              {/* Messages Dropdown */}
              <li className='dropdown messages-menu'>
                <button
                  onClick={toggleDropdown}
                  className='dropdown-toggle'
                  aria-expanded={isDropdownOpen}
                >
                  <i className='fa fa-envelope-o'></i>
                  <span className='label label-success'>4</span>
                </button>
                {isDropdownOpen && (
                  <div className='dropdown-menu'>
                    <div className='header'>You have 4 messages</div>
                    <div className='menu'>
                      <div className='message-item'>
                        <div className='message-content'>
                          <h4>
                            Support Team
                            <small>
                              <i className='fa fa-clock-o'></i> 5 mins
                            </small>
                          </h4>
                          <p>Why not buy a new awesome theme?</p>
                        </div>
                      </div>
                    </div>
                    <div className='footer'>
                      <Link to='/messages'>See All Messages</Link>
                    </div>
                  </div>
                )}
              </li>

              {/* Notifications Dropdown */}
              <li className='dropdown notifications-menu'>
                <button
                  onClick={toggleDropdown}
                  className='dropdown-toggle'
                  aria-expanded={isDropdownOpen}
                >
                  <i className='fa fa-bell-o'></i>
                  <span className='label label-warning'>10</span>
                </button>
                {isDropdownOpen && (
                  <div className='dropdown-menu'>
                    <div className='header'>You have 10 notifications</div>
                    <div className='menu'>
                      <div className='notification-item'>
                        <p>New user registered</p>
                      </div>
                    </div>
                    <div className='footer'>
                      <Link to='/notifications'>View all</Link>
                    </div>
                  </div>
                )}
              </li>

              {/* Tasks Dropdown */}
              <li className='dropdown tasks-menu'>
                <button
                  onClick={toggleDropdown}
                  className='dropdown-toggle'
                  aria-expanded={isDropdownOpen}
                >
                  <i className='fa fa-flag-o'></i>
                  <span className='label label-danger'>9</span>
                </button>
                {isDropdownOpen && (
                  <div className='dropdown-menu'>
                    <div className='header'>You have 9 tasks</div>
                    <div className='menu'>
                      <div className='task-item'>
                        <div className='task-content'>
                          <h4>
                            Design some buttons
                            <small className='pull-right'>20%</small>
                          </h4>
                          <div className='progress xs'>
                            <div
                              className='progress-bar progress-bar-aqua'
                              style={{ width: '20%' }}
                              role='progressbar'
                              aria-valuenow='20'
                              aria-valuemin='0'
                              aria-valuemax='100'
                            >
                              <span className='sr-only'>20% Complete</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='footer'>
                      <Link to='/tasks'>View all tasks</Link>
                    </div>
                  </div>
                )}
              </li>

              {/* User Account */}
              <li className='dropdown user user-menu'>
                <button
                  onClick={toggleDropdown}
                  className='dropdown-toggle'
                  aria-expanded={isDropdownOpen}
                >
                  <img
                    src='%PUBLIC_URL%/dist/img/user2-160x160.jpg'
                    className='user-image'
                    alt='User Image'
                  />
                  <span className='hidden-xs'>Alexander Pierce</span>
                </button>
                {isDropdownOpen && (
                  <div className='dropdown-menu'>
                    <div className='user-header'>
                      <img
                        src='%PUBLIC_URL%/dist/img/user2-160x160.jpg'
                        className='img-circle'
                        alt='User Image'
                      />
                      <p>
                        Alexander Pierce - Web Developer
                        <small>Member since Nov. 2012</small>
                      </p>
                    </div>
                    <div className='menu'>
                      <Link to='/profile'>
                        <i className='fa fa-user'></i> Profile
                      </Link>
                      <Link to='/settings'>
                        <i className='fa fa-gear'></i> Settings
                      </Link>
                      <Link to='/logout'>
                        <i className='fa fa-sign-out'></i> Sign out
                      </Link>
                    </div>
                  </div>
                )}
              </li>

              {/* Login Button */}
              <li>
                <Link to='/login'>
                  <i
                    className='text-dark'
                    style={{ position: 'relative', color: 'black' }}
                  >
                    Login
                  </i>
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </header>
      <aside className='main-sidebar'>
        {/* <!-- sidebar: style can be found in sidebar.less --> */}
        <section className='sidebar'>
          {/* <!-- Sidebar user panel --> */}
          <div className='user-panel'>
            <div className='pull-left image'>
              {/* <img src="%PUBLIC_URL%/dist/img/IMG_6799.JPG" className="img-circle" alt="User Image" /> */}
            </div>
            <div className='pull-left info'>
              <p>Admin Movies</p>

              <a href='#'>
                <i className='fa fa-circle text-success'></i> Online
              </a>
            </div>
          </div>
          {/* <!-- search form --> */}
          <form action='#' method='get' className='sidebar-form'>
            <div className='input-group'>
              <input
                type='text'
                name='q'
                className='form-control'
                placeholder='Search...'
              />
              <span className='input-group-btn'>
                <button
                  type='submit'
                  name='search'
                  id='search-btn'
                  className='btn btn-flat'
                >
                  <i className='fa fa-search'></i>
                </button>
              </span>
            </div>
          </form>
          <ul className='space-y-1'>
            <li className='text-sm uppercase text-gray-500 font-semibold px-4 py-3'>
              MAIN NAVIGATION
            </li>
            <li className='border-l-4 border-blue-500 bg-blue-50'>
              <a
                href='/'
                className='flex items-center space-x-4 px-6 py-4 text-blue-600 hover:bg-blue-100 transition-colors duration-200'
              >
                {/* <i className="fa fa-dashboard text-blue-500 text-3xl"></i> */}
                <LayoutDashboard className='w-7 h-7 text-blue-500' />
                <span className='text-2xl font-medium'>Dashboard</span>
              </a>
            </li>
            <li>
              <Link
                to='/movies'
                className='flex items-center space-x-4 px-6 py-4 text-gray-700 hover:bg-gray-50 transition-colors duration-200'
              >
                <Film className='w-7 h-7 text-blue-500' />
                <span className='text-2xl font-medium'>Quản lý phim</span>
              </Link>
            </li>
            <li>
              <Link
                to='/movieScreenings'
                className='flex items-center space-x-4 px-6 py-4 text-gray-700 hover:bg-gray-50 transition-colors duration-200'
              >
                <MonitorPlay className='w-7 h-7 text-blue-500' />
                <span className='text-2xl font-medium'>Quản lý suất chiếu</span>
              </Link>
            </li>
            <li>
              <Link
                to='/rooms'
                className='flex items-center space-x-4 px-6 py-4 text-gray-700 hover:bg-gray-50 transition-colors duration-200'
              >
                <Theater className='w-7 h-7 text-blue-500' />
                <span className='text-2xl font-medium'>
                  Quản lý phòng chiếu
                </span>
              </Link>
            </li>
            <li>
              <Link
                to='/workShedule'
                className='flex items-center space-x-4 px-6 py-4 text-gray-700 hover:bg-gray-50 transition-colors duration-200'
              >
                {/* <i className="fa fa-calendar text-gray-500 text-xl"></i> */}
                <Calendar className='w-7 h-7 text-blue-500' />
                <span className='text-2xl font-medium'>Lịch làm việc</span>
              </Link>
            </li>
            <li>
              <Link
                to='/employee'
                className='flex items-center space-x-4 px-6 py-4 text-gray-700 hover:bg-gray-50 transition-colors duration-200'
              >
                {/* <i className="fa fa-users text-gray-500 text-xl"></i> */}
                <Users className='w-7 h-7 text-blue-500' />
                <span className='text-2xl font-medium'>
                  Danh sách nhân viên
                </span>
              </Link>
            </li>
            <li>
              <Link
                to='/workSheduleEmployee'
                className='flex items-center space-x-4 px-6 py-4 text-gray-700 hover:bg-gray-50 transition-colors duration-200'
              >
                {/* <i className="fa fa-clock-o text-gray-500 text-xl"></i> */}
                <List className='w-7 h-7 text-blue-500' />
                <span className='text-2xl font-medium'>Danh sách ca trực</span>
              </Link>
            </li>
            <li>
              <Link
                to='/workScheduleStats'
                className='flex items-center space-x-4 px-6 py-4 text-gray-700 hover:bg-gray-50 transition-colors duration-200'
              >
                {/* <i className="fa fa-bar-chart text-gray-500 text-xl"></i> */}
                <BarChart className='w-7 h-7 text-blue-500' />
                <span className='text-2xl font-medium'>
                  Thống kê lịch làm việc
                </span>
              </Link>
            </li>
          </ul>
        </section>
      </aside>
    </div>
  );
}
