import { createSlice } from "@reduxjs/toolkit"

const initialState = ''

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    createdAnecdoteMessage(state, action) {
      const anecdote = action.payload
      const fullMessage = anecdote.length===0 ? '' : 'You created ' + anecdote
      return fullMessage
    },
    votedForAnecdoteMessage(state, action) {
        const anecdote = action.payload
        const fullMessage = anecdote.length===0 ? '' : 'You voted for ' + anecdote
        return fullMessage
    }
  }
})

export const { createdAnecdoteMessage, votedForAnecdoteMessage } = notificationSlice.actions
export default notificationSlice.reducer