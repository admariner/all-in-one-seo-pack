import {
	useLicenseStore,
	useRootStore,
	useTagsStore,
	usePostEditorStore
} from '@/vue/stores'

const isUnlicensed = () => {
	const licenseStore = useLicenseStore()
	return licenseStore?.isUnlicensed || false
}

const refreshWoocommerceStore = () => {
	let productSku   = '',
		productPrice = '',
		productBrand = '',
		brands       = [],
		productCatLabel = ''

	const tagsStore       = useTagsStore()
	const postEditorStore = usePostEditorStore()

	const sku = document.getElementById('_sku')
	if (sku) {
		productSku = sku.value
		tagsStore.updateWooCommerceSku(productSku)
	}

	const salePrice = document.getElementById('_sale_price')
	const price     = document.getElementById('_regular_price')

	if (salePrice) {
		productPrice = salePrice.value
	}

	if (!productPrice && price) {
		productPrice = price.value
	}

	const rootStore          = useRootStore()
	const parsedProductPrice = rootStore.aioseo.data?.wooCommerce?.currencySymbol || '$' + parseFloat(productPrice || 0).toFixed(2)
	tagsStore.updateWooCommercePrice(parsedProductPrice)

	brands = document.querySelectorAll('#post input[name="tax_input[product_brand][]"]:checked')
	if (!brands.length) {
		brands = document.querySelectorAll('#post input[name="tax_input[pwb-brand][]"]:checked') // Perfect Brands
	}

	if (brands.length) {
		if (productBrand !== brands[0].parentNode.innerText) {
			productBrand = brands[0].parentNode.innerText
			tagsStore.updateWooCommerceBrand(brands[0].parentNode.innerText)
		}

		// Set product brand if primary term is set.
		if (postEditorStore.currentPost?.primary_term?.['pwb-brand']) {
			const productBrandElement = document.getElementById(`in-pwb-brand-${postEditorStore.currentPost.primary_term['pwb-brand']}`)
			if (productBrandElement?.parentNode?.innerText) {
				tagsStore.updateWooCommerceBrand(productBrandElement.parentNode.innerText)
			}
		}
	} else {
		tagsStore.updateWooCommerceBrand('')
	}

	const productCats = document.querySelectorAll('#post input[name="tax_input[product_cat][]"]:checked')
	if (productCats.length) {
		productCatLabel = productCats[0].parentNode.innerText
	}

	// The primary term label takes precedence.
	if (postEditorStore.currentPost?.primary_term?.product_cat) {
		const productCategory = document.getElementById(`in-product_cat-${postEditorStore.currentPost.primary_term.product_cat}`)
		productCatLabel = productCategory?.parentNode?.innerText || ''
	}

	tagsStore.updateTaxonomyTitle(productCatLabel)
}

window.addEventListener('DOMContentLoaded', () => {
	if ('customize' !== window?.aioseo?.screen?.base && !isUnlicensed()) {
		refreshWoocommerceStore()
	}
})

export const watchWooCommerce = () => {
	if (isUnlicensed()) {
		return
	}

	window.addEventListener('change', (event) => {
		if ('INPUT' !== event.target.tagName) {
			return
		}

		refreshWoocommerceStore()
	})
}