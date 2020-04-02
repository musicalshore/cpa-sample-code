import { SELECT_MAP, SELECT_CITY } from 'constants/actionTypes'

export const selectMap = (selectedMap) => ({
  type: SELECT_MAP,
  selectedMap
})
export const selectCity = (selectedCity) => ({
  type: SELECT_CITY,
  selectedCity
})
