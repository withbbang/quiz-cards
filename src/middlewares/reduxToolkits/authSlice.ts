import { createSlice } from '@reduxjs/toolkit';

export interface AuthState {
  uid?: string;
}

export const initialState: AuthState = {
  uid: ''
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    useSetUid(state: AuthState, action) {
      state.uid = action.payload.uid;
    }
  },
  // API 리듀서들 비동기 상태값들 한번에 관리하기 위한 extraReducers 모음
  extraReducers: {
    // ...add others
  }
});

export const { useSetUid } = authSlice.actions;

export default authSlice.reducer;
