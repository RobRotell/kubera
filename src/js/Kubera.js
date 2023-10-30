import { html, reactive } from '@arrow-js/core'


export class Kubera {


	data = null
	states = null


	/**
	 * Class constructor
	 *
	 */
	constructor() {
		this.createData()
	}


	/**
	 * Set up reactive data
	 *
	 * @return {void}
	 */
	createData() {
		this.data = reactive({
			subtotal: null,
			tipPercentage: 18,
			tipAmount: undefined,
			totalAmount: undefined,
		})

		this.states = reactive({
			invalidSubtotal: false,
			invalidCustomTipPercentage: false,
		})

		this.data.$on( 'subtotal', this.recalculateAmounts.bind( this ) )
		this.data.$on( 'tipPercentage', this.recalculateAmounts.bind( this ) )
	}


	/**
	 * Recalculate tip amount and total amount
	 *
	 * @return {void}
	 */
	recalculateAmounts() {
		const { subtotal, tipPercentage } = this.data

		if ( !subtotal || !tipPercentage ) {
			this.clearAmounts()
		} else {

			// calculate tip amount
			let tipAmount = ( subtotal * ( tipPercentage / 100 ) ).toFixed( 2 )

			tipAmount = parseFloat( tipAmount )

			// apply tip amount to subtotal to get *total* total
			const totalAmount = ( subtotal + tipAmount ).toFixed( 2 )

			this.data.tipAmount = `$${tipAmount.toFixed( 2 )}`
			this.data.totalAmount = `$${totalAmount}`
		}
	}


	/**
	 * Clear tip total and total amount values
	 *
	 * @return {void}
	 */
	clearAmounts() {
		this.data.tipAmount = undefined
		this.data.totalAmount = undefined
	}


	/**
	 * Handles user input to change subtotal
	 *
	 * @param {CustomEvent} e - Input event
	 * @return {void}
	 */
	handleInputSubtotal({ target }) {
		const subtotal = parseFloat( target.value )

		if ( Number.isNaN( subtotal ) || 0 > subtotal ) {
			this.data.subtotal = null
			this.states.invalidSubtotal = true
		} else {
			this.data.subtotal = subtotal
			this.states.invalidSubtotal = false
		}
	}


	/**
	 * Handles user input to change tip percentage
	 *
	 * @param {CustomEvent} e - Input event
	 * @return {void}
	 */
	handleInputTipPercentage({ target }) {
		const percentage = parseInt( target.value )

		this.states.isUsingCustomTipPercentage = true

		if ( Number.isNaN( percentage ) || 100 < percentage || 0 > percentage ) {
			this.data.tipPercentage = null
			this.states.invalidCustomTipPercentage = true
		} else {
			this.data.tipPercentage = percentage
			this.states.invalidCustomTipPercentage = false
		}

		this.recalculateAmounts()
	}


	/**
	 * Handle user clicking fixed tip percentage button
	 *
	 * @param {number} amount - Tip amount
	 * @return {void}
	 */
	handleUserClickTipBtn( amount ) {
		this.states.isUsingCustomTipPercentage = false
		this.data.tipPercentage = amount
	}


	/**
	 * Create string for classes for subtotal input
	 *
	 * Because of how ArrowJS operates, this needs to be a separate function outside of the renderer
	 *
	 * @return {string} Button classes
	 */
	getInputSubtotalClasses() {
		const nodeClasses = [
			'subtotal'
		]

		if ( this.states.invalidSubtotal ) {
			nodeClasses.push( 'is-invalid' )
		}

		return nodeClasses.join( ' ' )
	}


	/**
	 * Renders tip amount input
	 *
	 * @return {function} Template
	 */
	renderInputTipAmount() {
		return html`
			<label 
				class="block-amount__label tip-amount__label"
				for="kubera_tip"
			>
				<span class="block-amount__label__text tip-amount__label__text">Tip</span>
				<input
					id="kubera_tip"
					class="block-amount__value tip-amount__value"
					type="text"
					readonly
					value="${this.data.tipAmount}"
					placeholder="TBD &hellip;"
				/>
			</label>
		`
	}


	/**
	 * Renders total amount input
	 *
	 * @param t{string}
	 * @return {obj}
	 */
	renderInputTotalAmount() {
		return html`
			<label 
				class="block-amount__label tip-amount__label"
				for="kubera_total"
			>
				<span class="block-amount__label__text tip-amount__label__text">Total</span>
				<input
					id="kubera_total"
					type="text"
					class="block-amount__value total-amount__value"
					readonly
					value="${this.data.totalAmount}"
					placeholder="TBD &hellip;"
				/>
			</label>
		`
	}


	/**
	 * Renders subtotal input
	 *
	 * @return {function} Template
	 */
	renderInputSubtotal() {
		return html`
			<div 
				class="${ () => this.getInputSubtotalClasses() }"
			>
				<label 
					class="subtotal__label"
					for="kubera_subtotal"
				>
					<span class="subtotal__label__text">Subtotal</span>
					<input
						id="kubera_subtotal"
						class="subtotal__input"
						@input="${this.handleInputSubtotal.bind( this )}"
						type="number"
						step="0.01"
						placeholder="Enter subtotal &hellip;"
					/>
				</label>
			</div>
		`
	}


	/**
	 * Create string for classes for button
	 *
	 * Because of how ArrowJS operates, this needs to be a separate function outside of the renderer
	 *
	 * @param {number} amount - Button's tip percentage
	 * @return {string} Button classes
	 */
	getBtnTipPercentageClasses( amount ) {
		const nodeClasses = [
			'tip-percentage__btn'
		]

		if ( amount === this.data.tipPercentage ) {
			nodeClasses.push( 'is-selected' )
		}

		return nodeClasses.join( ' ' )
	}


	/**
	 * Renders fixed tip percentage buttons
	 *
	 * @param {number} amount - Button percentage amount
	 * @return {function} Template
	 */
	renderBtnStaticTipPercentage( amount ) {
		return html`
			<button
				@click="${ () => this.handleUserClickTipBtn( amount ) }"
				class="${ () => this.getBtnTipPercentageClasses( amount )}"
				type="button"
			>
				<span
					class="tip-percentage__value"
				>${amount}%</span>
			</button>
		`
	}


	/**
	 * Create string for classes for custom tip percentage button
	 *
	 * Because of how ArrowJS operates, this needs to be a separate function outside of the renderer
	 *
	 * @return {string} Button classes
	 */
	getInputTipPercentageClasses() {
		const nodeClasses = [
			'tip-percentage__btn'
		]

		if ( this.states.invalidCustomTipPercentage ) {
			nodeClasses.push( 'is-invalid' )
		}

		if ( this.states.isUsingCustomTipPercentage ) {
			nodeClasses.push( 'is-selected' )
		}

		return nodeClasses.join( ' ' )
	}


	/**
	 * Renders custom tip percentage input
	 *
	 * @return {function} Template
	 */
	renderInputDynamicTipPercentage() {
		return html`
			<span
				class="${ () => this.getInputTipPercentageClasses() }"
			>
				<input
					@input="${this.handleInputTipPercentage.bind( this )}"
					type="number"
					class="tip-percentage__input"
					min="1"
					max="99"
					step="1"
					placeholder="Custom tip &hellip;"
				/>
			</span>
		`
	}


	/**
	 * Render app through ArrowJS html template literal
	 *
	 * @param {HTMLElement} node - HTML node
	 * @return {void}
	 */
	renderApp( node ) {
		html`
			<section class="tip-subtotal">
				${this.renderInputSubtotal.bind( this )}
			</section>

			<section class="tip-percentages">
				<p class="tip-percentages__headline">Tip Amount</p>
				<div class="tip-percentages__options">
					${[ 18, 20 ].map( amount => this.renderBtnStaticTipPercentage( amount ) )}
					${this.renderInputDynamicTipPercentage.bind( this )}
				</div>
			</section>

			<section class="block-amount tip-amount">
				${this.renderInputTipAmount.bind( this )}
			</section>

			<section class="block-amount total-amount">
				${this.renderInputTotalAmount.bind( this )}
			</section>
		`( node )
	}

}
