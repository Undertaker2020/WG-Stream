export function convertPrice(price: number) {
	return price.toLocaleString('ua-UA', {
		style: 'currency',
		currency: 'UAH'
	})
}