import type { Product } from '$lib/schema/product.schema';
import type { ProductInvoiceResult } from '$lib/schema/product_invoice.schema';

export interface CreatorDashboard {
	subscriberCount: number;
	revenue: number;
	rewardsUsed: number;
	purchaseCount: number;
	purchaseAmount: number;
	followerCount: number;
	productCount: number;
	productPurchaseList: ProductInvoiceResult[] | [];
}

export interface CreatorDashboardPublic {
	subscriberCount: number;
	followerCount: number;
	purchaseCount: number;
	productCount: number;
	products: Product[];
}

// export interface ProductPurchase {
// 	id: number;
// 	name: string;
// 	follower: string;
// 	handle: string;
// 	cost: number;
// }
