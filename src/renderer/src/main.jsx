import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'

import App from './App'
import './bass.css'
import store from './redux/store'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)
