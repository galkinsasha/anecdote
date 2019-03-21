import _ from 'lodash'
import { createAction , handleActions } from 'redux-actions'
import { resolve, request, reject } from 'redux-promised'
import { AsyncStorage } from "react-native"


// ------------------------------------
// Constants
// ------------------------------------
export const NAMESPACE = 'anekdots'
export const GET_RANDOM_ITEM = NAMESPACE+'/'+'GET_RANDOM_ITEM'
export const GET_RANDOM_ITEM_LOCAL = NAMESPACE+'/'+'GET_RANDOM_ITEM_LOCAL'
export const SET_ITEM_INDEX = NAMESPACE+'/'+'SET_ITEM_INDEX'
export const GET_ITEM_INDEX = NAMESPACE+'/'+'GET_ITEM_INDEX'

const randomUrl    = 'http://umorili.herokuapp.com/api/random?num=50'


// ------------------------------------
// Actions
// ------------------------------------
export const getRandomItemHTTP = () => {
    console.log('---- getRandomItemHTTP');
    return{
        type: GET_RANDOM_ITEM,
        meta: { promise: true },
        payload: fetch(randomUrl, {
            method: 'GET',
            mode:'cors'

        }).then(response=>response.json())
    }
}

export const getRandomItemLocal = () => {
    console.log('---- getRandomItemLocal');
    return {
        type: GET_RANDOM_ITEM_LOCAL,
        payload: _retrieveData()
            .then(res=>JSON.parse(res))
            .catch((err)=>{
                console.log(err)
            })
    }
}

export const getItemIndex = () => {
    console.log('---- getItemIndex');
    return {
        type: GET_ITEM_INDEX,
        payload: _getItemIndex()
            .then(res=>res)
            .catch((err)=>{
                console.log(err)
            })
    }
}

export const setItemIndex = (val) => {
    console.log('---- setItemIndex');
    _setInitialIndex(val)
    return {type: SET_ITEM_INDEX}
}

export const actions = {
    getRandomItemHTTP,
    getRandomItemLocal,
    setItemIndex,
    getItemIndex
}

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
    [resolve(GET_RANDOM_ITEM)]: (state, { payload }) => {
        _storeData(payload)
        return{...state, anekdots:payload, anekdotsError:null, initialIndex:0, anekdotsErrorCode:0, anekdotsFetching:false}
    },
    [reject(GET_RANDOM_ITEM)]: (state, { payload }) => ({...state, anekdots:null, initialIndex:0, anekdotsError:'Error fetching items', anekdotsErrorCode:1, anekdotsFetching:false}),
    [request(GET_RANDOM_ITEM)]: (state, { payload }) => ({...state, anekdots:null, initialIndex:0, anekdotsError:null, anekdotsErrorCode:0, anekdotsFetching:true}),

    [request(GET_RANDOM_ITEM_LOCAL)]: (state, { payload }) => ({...state, anekdots:null, anekdotsError:null, anekdotsErrorCode:0, anekdotsFetching:true}),
    [reject(GET_RANDOM_ITEM_LOCAL)]: (state, { payload }) => ({...state, anekdots:null, anekdotsError:'Error fetching items from local storage', anekdotsErrorCode:2, anekdotsFetching:false}),
    [resolve(GET_RANDOM_ITEM_LOCAL)]: (state, { payload }) => ({...state, anekdots:payload, anekdotsError:null, anekdotsErrorCode:0, anekdotsFetching:false}),

    [request(GET_ITEM_INDEX)]: (state, { payload }) => ({...state, initialIndex:undefined}),
    [reject(GET_ITEM_INDEX)]: (state, { payload }) => ({...state, initialIndex:undefined}),
    [resolve(GET_ITEM_INDEX)]: (state, { payload }) => ({...state, initialIndex:payload}),

    [SET_ITEM_INDEX]: state => state
},{})

// ------------------------------------
// Helpers
// ------------------------------------
_storeData = async (payload) => {
    try {
        await AsyncStorage.setItem(`@anekdots:${_getDate()}`, JSON.stringify(payload));
    } catch (error) {
        console.log('Error saving data to local storage: '+error)
    }
}

//The main point that we try to load all new stories once per day
// for this reason we do not need to keep all older stories, so lets clean up our local storage
_retrieveData = async () => {
    try {
        const res = await AsyncStorage.getItem(`@anekdots:${_getDate()}`);

        if(!res){
            // it means that we didn't find any story for current date
            // so lets cleanup our stories for previous day(s)
            // and then return empty array - it means that we will grab new stories from the Internet on the next step
            const allKeys = await AsyncStorage.getAllKeys()
            if (Array.isArray(allKeys)){
                const arr =_getProperKeys(allKeys, /^anekdots:/)
                AsyncStorage.multiRemove(arr)
            }
            return []
        }else{
            return res
        }
    } catch (error) {
        console.log('Error retrieving data from local storage: '+error)
    }
}

_getItemIndex = async () => {
    const index =  await AsyncStorage.getItem("@initialIndex");
    console.log('indexGet', index);
    return index ? parseInt(index) : 0
}

_setInitialIndex = async (val) =>{
    console.log('index', val);
    try {
        await AsyncStorage.setItem("@initialIndex", val.toString());
    } catch (error) {
        console.log('Error saving index to local storage: '+error)
    }

}

_getDate = () => {
    var d = new Date();
    return `${d.getDate()}${d.getMonth()}${d.getFullYear()}`
}

_getProperKeys = (originalArray, regex) => {
    let j = 0;
    while (j < originalArray.length) {
        if (regex.test(originalArray[j]))
            originalArray.splice(j, 1);
        else
            j++;
    }
    return originalArray;
}


