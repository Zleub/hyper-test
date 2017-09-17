//           `--::-.`
//       ./shddddddddhs+.
//     :yddddddddddddddddy:
//   `sdddddddddddddddddddds`
//  /ddddy:oddddddddds:sddddd/   @By: Debray Arnaud <adebray> - adebray@student.42.fr
//  sdddddddddddddddddddddddds   @Last modified by: adebray
//  sdddddddddddddddddddddddds
//  :ddddddddddhyyddddddddddd:   @Created: 2017-09-15T13:43:28+02:00
//   odddddddd/`:-`sdddddddds    @Modified: 2017-09-17T02:41:45+02:00
//    +ddddddh`+dh +dddddddo
//     -sdddddh///sdddddds-
//       .+ydddddddddhs/.
//           .-::::-`

const methods = [
	{ name: ".pip", command: "pip list" },
	{ name: ".gem", command: "gem list" }
]

// Electron
// exports.onApp = (app) => {
// 	console.log('onApp')
// 	// console.log(app)
// }

// // Electron
exports.onWindow = (window) => {
	console.log('onWindow')

	window.rpc.on('message', (event, arg) => {
		console.log(process.env)  // prints "ping"
		let files = require('fs').readdirSync('/Users/adebray').filter(e => {
			return !methods.reduce( (p, _) => p & _.name != e, true)
		}).map( e => {
			let _ = methods.find( _ => _.name == e )
			return {
				name: e,
				// list: require('child_process').execSync( _.command, {env : process.env} ).toString(),
				// outdated: require('child_process').execSync( '/usr/local/bin/pip list --outdated' ).toString()
			}
		})
		window.rpc.emit('response', process.env)
		// event.sender.send('asynchronous-reply', 'pong')
	})
}

// Electron
exports.decorateEnv = (env) => {
	console.log('decorateEnv')
	// // console.log(require('fs').readdirSync(env.HOME))
	// console.log(this)


	return env
}

// // Electron
// exports.decorateMenu = (menu) => {
// 	console.log('decorateMenu')
// 	// console.log(menu)
// 	return menu
// }

// Renderer
exports.onRendererWindow = (window) => {
	console.log('onRendererWindow')
}

// Renderer
exports.decorateTerm = (Term, {
	React
}) => {
	// console.log(Term, env)
	console.log('decorateTerm', Term)

	return class extends React.Component {

		constructor(props, context) {
			super(props, context)
			console.log(props, context)

			this.state = {
				loading: true
			}
			this._f = this._f.bind(this)
			window.rpc.on('response', this._f)
			window.rpc.emit('message', 'test')
		}

		_f(e) {
			this.setState({
				loading: false,
				files: e
			})
			window.rpc.removeListener('response', this._f)
		}

		render() {
			return React.createElement('div', Object.assign({
				style: {
					height: '100%'
				}
			},this.props),
				(this.state.loading ) ? React.createElement('div', null, 'loading') : React.createElement('div', {
					className: '',
					style: {
						position: 'absolute',

						// border: '1px solid grey',
						// borderRadius: '4px',

						// overflow: 'hidden',
						wordBreak: 'break-all',
						padding: '12px 14px',
						width: '25%',
						height: '100%',
						right: '0px',
						zIndex: 42,
						pointerEvents: 'none',
						fontFamily: this.props.fontFamily,
						fontSize: this.props.fontSize,
					}
				}, JSON.stringify(this.state.files)/* [].concat.apply([], this.state.files.map(e => {
					let total = e.list.split(/\r\n|\r|\n/).length
					// let outdated = e.outdated.split(/\r\n|\r|\n/).length

					return [e.name, " ", total, React.createElement('br')] //, " : ", Math.round((100 * outdated) / total) + "%" ]
				}) ) */
				),
				React.createElement(Term, this.props)
			)
		}
	}
}
