import globalAxios from 'axios'
import router from '../../router'
import auth from './auth'
import globalFunction from '../../library/helpers/gobal-function'

const state = {
  id: null,
  listOfScope: []
}

const mutations = {
  SET_LIST_OF_SCOPE: (state, payload) => {
    state.listOfScope = payload
  },
  SET_WALLET: (state, payload) => {
    globalAxios
      .put('users/' + state.id + '/listOfScope/' + payload.id + '.json?auth=' + auth.state.idToken, payload.data)
      .then(res => {
        state.listOfScope.push(payload)
      })
      .catch(error => console.log(error))
    router.replace('/transaction/' + payload.id)
  },
  INIT_SCOPE_USER: (state, payload) => {
    state.listOfScope = globalFunction.fetchListOfScope(payload)
  },
  SET_ID_USER: (state, payload) => {
    state.id = payload
  },
  CLEAR_LIST: state => {
    state.listOfScope = null
  }
}

const actions = {
  Add_WALLET: ({ commit }, payload) => {
    commit('SET_WALLET', payload)
  },
  INIT_DATA_USER: ({ commit }, payload) => {
    globalAxios
      .get('users.json' + '?auth=' + auth.state.idToken)
      .then(res => {
        for (let key in res.data) {
          const user = res.data[key]
          if (payload === user.id) {
            commit('SET_ID_USER', key)
            commit('INIT_SCOPE_USER', user.listOfScope)
          }
        }
      })
      .catch(error => console.log(error))
  },
  ADD_BID_TRANSACTION: ({commit, state}, payload) => {
    globalAxios
      .put('users/' + state.id + '/listOfScope/' + payload.id + '/listOfPlayer/' + payload.selected.row.id + '.json?auth=' + auth.state.idToken, payload.selected.row)
      .then(res => {
        commit('SET_LIST_OF_SCOPE', state.listOfScope)
        console.log(state.listOfScope)
      })
      .catch(error => console.log(error))
  }
}

const getters = {
  GET_TRANSACTION: state => id => {
    return state.listOfScope.filter(e => e.id === id)
  },
  GET_LIST_OF_SCOPE: state => {
    return state.listOfScope
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
