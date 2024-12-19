import { setLogoutMessage } from '@/redux/slices/authSlice';
import { redirect } from 'next/navigation';
import { useDispatch } from 'react-redux';

const useValidateRoute = (type, user_type_id) => {
    try {

        const dispatch = useDispatch();
        const auth_code = type == 'STATE' ? 1 : type == 'RTO' ? 10 : null;

        // if (!token) {
        //     dispatch(setLogoutMessage('Session Expired, Please login again.'));
        //     setTimeout(() => {
        //         redirect('/logout');
        //     }, 1);
        //     return;
        // }
        // else
         if (user_type_id !== auth_code) {
            dispatch(setLogoutMessage('Access denied, You are Unauthorized'));
            setTimeout(() => {
                redirect('/logout');
            }, 1);
        }
    }catch (e) {
        console.log(e);
    }
}

export default useValidateRoute
