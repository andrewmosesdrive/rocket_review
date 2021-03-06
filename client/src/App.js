import Navbar from './components/Navbar';
import './App.css';
import './App.scss'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import axios from 'axios';
import useAuth from './hooks/auth';
// import Home from './pages/Home';
import Login from './pages/Login';
import CreateReviewObjects from './pages/CreateReviewObjects';
import Review from './pages/Review';


function App() {
    // Pull auth token from storage, in case you refresh the page
    const { getToken, logout } = useAuth();
    axios.defaults.headers.common.Authorization = `Bearer ${getToken()}`;

    // A nice trick that if we EVER get back a 401, will pop the token off
    axios.interceptors.response.use(response => {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response;
    }, error => {
        try {
            const { message } = error.toJSON();
            // If we had time, we could write our own custom method to the auth middleware
            // However, we are just gonna use their message.
            if (message === 'Request failed with status code 401') {
                logout();
            }
        }
        catch (err) { console.error(err); }
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        return Promise.reject(error);
    });

    return (
        <Router>
            <Navbar />
            <Switch>
                <Route exact path='/'>
                    <Login />
                </Route>
                <Route exact path='/login'>
                    <Login />
                </Route>
                <PrivateRoute exact path='/create-review'>
                    <CreateReviewObjects />
                </PrivateRoute>
                <PrivateRoute exact path='/review'>
                    <Review />
                </PrivateRoute>
            </Switch>
        </Router>
    );
}

// Yanked straight from the react-router docs for redirects
function PrivateRoute({ children, ...rest }) {
    const { isLoggedIn } = useAuth();
    return (
        <Route
            {...rest}
            render={({ location }) =>
                isLoggedIn() ? (
                    children
                ) :
                    (
                        <Redirect
                            to={{
                                pathname: '/login',
                                state: { from: location }
                            }}
                        />
                    )
            }
        />
    );
}


export default App;
