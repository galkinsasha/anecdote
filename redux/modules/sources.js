import _ from 'lodash'
import { createAction , handleActions } from 'redux-actions'
import { resolve, request, reject } from 'redux-promised'

// ------------------------------------
// Constants
// ------------------------------------
export const NAMESPACE = 'sources'
export const GET_SOURCES = NAMESPACE+'/'+'GET_SOURCES'

const sourceUrl    = 'http://www.umori.li/api/sources'


// ------------------------------------
// Actions
// ------------------------------------
export const getSources = () => ({
    type: GET_SOURCES,
    meta: { promise: true },
    payload: fetch(sourceUrl, {
        method: 'GET'
    }).then(response => response.json())
})

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
    [resolve(GET_SOURCES)]: (state, { payload }) => ({...state, sources:payload, sourcesError:null, sourcesFetching:false}),
    [reject(GET_SOURCES)]: (state, { payload }) => ({...state, sources:[], sourcesError:'Error fetching sources', sourcesFetching:false}),
    [request(GET_SOURCES)]: (state, { payload }) => ({...state, sources:[], sourcesError:null, sourcesFetching:true})
},{})




