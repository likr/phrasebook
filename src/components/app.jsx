import React from 'react'
import {Link} from 'react-router'
import styles from './app.css'

class App extends React.Component {
  render () {
    return <div>
      <div className={`pure-menu pure-menu-horizontal pure-menu-fixed ${styles.menu}`}>
        <div>
          <Link className='pure-menu-heading' to='/'>Phrase Book</Link>
          <ul className='pure-menu-list'>
            <li className='pure-menu-item pure-menu-selected'>
              <Link className='pure-menu-link' to='/phrases'>Phrases</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.content}>
        <div>{this.props.children}</div>
      </div>
    </div>
  }
}

export default App
