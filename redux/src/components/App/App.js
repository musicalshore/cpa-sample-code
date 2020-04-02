
import React from 'react'
import Helmet from 'react-helmet'
import Breadcrumbs from 'components/Breadcrumbs'
import Banner from 'components/Banner'
import Report from 'containers/Report'
import './style.scss'

const App = () => (
  <div styleName="flex-container">
    <Helmet title="America's Best Drivers Report" titleTemplate="Allstate %s">
      <meta charSet="UTF-8" />
      <meta name="keywords" content="best drivers, America's best drivers, best drivers in America, best U.S. drivers, 2016 America's best drivers report" />
      <meta name="description" content="Is your city home to the best drivers in America? Explore Allstate's annual best drivers report and interactive map." />
      <meta name="viewport" content="width=device-width, initial-scale=1.0,user-scalable=no"/>
      <meta property="fb:app_id" content="51244333578" />
      <meta property="og:title" content="America's Best Driver Report" />
      <meta property="og:type" content="article" />
      <meta property="og:image" content="http://allstate-abd.uat.thethinktank.com/img/share.png" />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="600" />
      <meta property="og:image:height" content="315" />
      <script src="https://use.fontawesome.com/934103e5b8.js" />
    </Helmet>
    <div styleName="content">
          <Breadcrumbs />
          <Banner />
          <Report />
    </div>
  </div>
)

export default App
