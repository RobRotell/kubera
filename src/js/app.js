import { html, reactive } from '@arrow-js/core'


const data = reactive({
	subtotal: null,
	tipPercentage: 18,
	tipAmount: 0,
	totalAmount: 0,
})

console.log( JSON.stringify( data ) )


data.$on( 'subtotal', ( ...args ) => {
	console.log( args )
})

data.$on( 'tipPercentage', ( ...args ) => {
	console.log( args )
})


const handleSubtotalInput = e => {
	const { value } = e.target

	let subtotal = parseFloat( value )

	if ( !Number.isNaN( subtotal ) ) {
		data.subtotal = subtotal
	}
}


const handleCustomTipInput = e => {
	console.log( e )
}


const renderInputSubtotal = () => {
	return html`
		<input
			@input="${handleSubtotalInput}"
			type="number"
			class="subtotal__input"
			step="0.01"
			placeholder="Enter subtotal &hellip;"
		/>
	`
}


const getTipPercentageBtnClasses = amount => {
	const nodeClasses = [
		'tip-percentage__btn'
	]

	if ( amount === data.tipPercentage ) {
		nodeClasses.push( 'is-selected' )
	}

	return nodeClasses.join( ' ' )
}


const renderTipPercentageInput = amount => {
	return html`
		<button
			@click="${ () => data.tipPercentage = amount }"
			class="${ () => getTipPercentageBtnClasses( amount ) }"
			type="button"
		>
			<span
				class="tip-percentage__value"
			>${amount}</span>
		</button>
	`
}


const renderCustomTipPercentageInput = () => {
	return html`
		<input
			@input="${handleCustomTipInput}"
			type="number"
			class="tip-percentage__input"
			min="1"
			max="99"
			step="1"
		/>
	`
}


// inputTipPercentageStatic


// inputTipPercentageDynamic


// inputTipAmount


// inputTotalAmount


html`
	<div class="subtotal">
		${renderInputSubtotal}
	</div>
	<div class="tip-percentages">
		<div class="tip-percentage">
			${[ 18, 20 ].map( amount => renderTipPercentageInput( amount ) )}
			${renderCustomTipPercentageInput}
		</div>
	</div>

	<div class="tip-amount">
		<input type="number" class="tip-amount__value" step="0.01" readonly />
	</div>

	<div class="total-amount">
		<input type="number" class="total-amount__value" step="0.01" readonly />
	</div>
`( document.getElementById( 'app' ) )
