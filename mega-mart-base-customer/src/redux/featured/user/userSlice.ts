import { RootState } from '@/redux/store';
import { IUser } from '@/types/user';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type IUsersState = {
  users: IUser[];
};

const initialState: IUsersState = {
  users: [],
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<IUser[]>) => {
      state.users = action.payload;
    },
  },
});

export const { setUsers } = usersSlice.actions;

export const selectAllUsers = (state: RootState) => state.user.users;

export default usersSlice.reducer;
