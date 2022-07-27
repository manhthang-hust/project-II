import { getUserPending, getUserSuccess, getUserFail, fetchAsyncUser } from './userSlice'
import { useDispatch } from 'react-redux'

export const getUserProfile = () => async (dispatch) => {
    try {
        dispatch(getUserPending());
        const result = await dispatch(fetchAsyncUser());
        console.log(result.payload.data)
        if(result.payload.data) return dispatch(getUserSuccess(result.payload.data))
        dispatch(getUserFail("User is not found"));
    } catch (e) {
        dispatch(getUserFail(e));
    }
}