import { call, put } from 'redux-saga/effects'

import { APIType } from 'core/network/api'
import { NabuCustodialProductType } from 'core/types'

import * as A from './actions'
import { errorHandler } from 'blockchain-wallet-v4/src/utils'

export default ({ api }: { api: APIType }) => {
  const fetchActivity = function * () {
    try {
      const products: Array<NabuCustodialProductType> = [
        'SAVINGS',
        'SIMPLEBUY',
        'SWAP'
      ]
      for (const value of products) {
        try {
          let transactions: ReturnType<typeof api.getCustodialTxs>
          let orders: ReturnType<typeof api.getSBOrders> = []
          switch (value) {
            case 'SIMPLEBUY':
              transactions = yield call(api.getCustodialTxs, value)
              orders = yield call(api.getSBOrders, {})
              break
            default:
              transactions = yield call(api.getCustodialTxs, value)
          }

          yield put(
            A.fetchCustodialActivitySuccess(value, transactions, orders)
          )
        } catch (e) {
          const error = errorHandler(e)
          yield put(A.fetchCustodialActivityFailure(value, error))
        }
      }
    } catch (e) {
      const error = errorHandler(e)
      // not enough info to do anything
      // eslint-disable-next-line
      console.log(`Activity fetch failure: ${error}`)
    }
  }

  return {
    fetchActivity
  }
}