import React from 'react';
import Banner from './Banner';
import Navigation from './Navigation';
import './Banner.css';
import './Navigation.css';

const MainLayout = ({ children }) => {
  return (
    <>
      <Banner />
      <Navigation />
      <main>{children}</main>
    </>
  );
};

export default MainLayout;
