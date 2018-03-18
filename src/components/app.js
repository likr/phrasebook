import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import PhraseList from './phrase-list'
import About from './about'
import Help from './help'
import styles from './app.css'

const App = () => {
  return <Router>
    <div>
      <div className={`pure-menu pure-menu-horizontal pure-menu-fixed ${styles.menu}`}>
        <div>
          <Link className='pure-menu-heading' to='/'>Phrase Book</Link>
          <ul className='pure-menu-list'>
            <li className='pure-menu-item pure-menu-selected'>
              <Link className='pure-menu-link' to='/about'>About</Link>
            </li>
            <li className='pure-menu-item pure-menu-selected'>
              <Link className='pure-menu-link' to='/help'>Help</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.content}>
        <Route exact path='/' component={PhraseList} />
        <Route path='/about' component={About} />
        <Route path='/help' component={Help} />
      </div>
    </div>
  </Router>
}

export default App
