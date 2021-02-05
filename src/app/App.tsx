import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import AboutPage from '../pages/about-page/AboutPage';
import HomePage from '../pages/home-page/HomePage';
import SchoolPage from '../pages/school-page/SchoolPage';
import SchoolsListPage from '../pages/schools-list-page/SchoolsListPage';
import './App.css';

function App() {
  return (
    <>
    <Router>
      <header>
        <nav>
          <span className="left">
            <Link to="/">
              <svg className="icon links" style={{width:'32px',height:'32px'}} viewBox="0 0 24 24">
                <title>Home page link icon</title>
                <path fill="currentColor" d="M7.2,11.2C8.97,11.2 10.4,12.63 10.4,14.4C10.4,16.17 8.97,17.6 7.2,17.6C5.43,17.6 4,16.17 4,14.4C4,12.63 5.43,11.2 7.2,11.2M14.8,16A2,2 0 0,1 16.8,18A2,2 0 0,1 14.8,20A2,2 0 0,1 12.8,18A2,2 0 0,1 14.8,16M15.2,4A4.8,4.8 0 0,1 20,8.8C20,11.45 17.85,13.6 15.2,13.6A4.8,4.8 0 0,1 10.4,8.8C10.4,6.15 12.55,4 15.2,4Z" />
              </svg>
            </Link>
            <Link className="left" to="/schools">
              <svg className="icon links" style={{width:'32px',height:'32px'}} viewBox="0 0 24 24">
                <title>Schools list page link icon</title>
                <path fill="currentColor" d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z" />
              </svg>
            </Link>
            <h1 className="unselectable" unselectable="on">School Viewer</h1>
          </span>
          <Link className="right" to="/about">
            <svg className="icon links right" style={{width:'32px',height:'32px'}} viewBox="0 0 24 24">
              <title>About page link icon</title>
              <path fill="currentColor" d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
            </svg>
          </Link>
        </nav>
      </header>
      <Switch>
        <Route path="/schools">
          <SchoolsListPage />
        </Route>
        <Route path="/school/:schoolId">
          <SchoolPage />
        </Route>
        <Route path="/about">
          <AboutPage />
        </Route>
        <Route path="/">
          <HomePage />
        </Route>
      </Switch>
    </Router>
    <footer>©Sam Hunt 2021</footer>
    </>
  );

}

export default App;
