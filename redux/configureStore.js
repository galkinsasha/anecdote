import { createStore, applyMiddleware } from 'redux'
import promiseMiddleware from 'redux-promised'
import rootReducer from './rootReducer'

export default function configureStore (initialState = {}) {
    return createStore(
        rootReducer,
        initialState,
        applyMiddleware(promiseMiddleware)
    )
}
