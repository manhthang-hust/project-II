import './App.scss';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import routes from './route/routes'
import PrivateRoute from './route/PrivateRoute'
import { Fragment } from 'react';
import Footer from './Client/commonComponent/footer/Footer.jsx'

function App() {

	const showMenu = () => {
		let navigation = null
		navigation = routes.map((route, index) => {
			return (
				(route.path === '/'||route.path === '/login' || route.path === '/forgot' || route.path === '/signup' || route.path === '/reset-password/:id') ?
				<Route key={index} exact path={route.path} element = {route.element} />
				: <Route exact path={route.path} element={<PrivateRoute/>}>
						<Route exact path={route.path} element={route.element}/>
				  </Route>
			)
		})
		return <Routes>{navigation}</Routes>
	}
  return (
	  <Router>
		  <Fragment>
			<div className="App">
				{showMenu(routes)}
			</div>
			<Footer />
		  </Fragment>
	  </Router>
  );
}

export default App;
