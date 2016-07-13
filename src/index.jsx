import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Router, Route, IndexRoute, hashHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import configureStore from './store/configure-store'
import App from './components/app'
import PhraseList from './components/phrase-list'
import Top from './components/top'

const store = configureStore()

const history = syncHistoryWithStore(hashHistory, store)

const Root = () => {
  return <Provider store={store}>
    <Router history={history}>
      <Route path='/' component={App}>
        <IndexRoute component={Top} />
        <Route path='phrases' component={PhraseList} />
      </Route>
    </Router>
  </Provider>
}

render(<Root />, document.getElementById('content'))
