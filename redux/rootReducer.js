import { combineReducers } from 'redux'
import sources from './modules/sources'
import anekdots from './modules/anekdots'

export default combineReducers({
    sources,
    anekdots
});