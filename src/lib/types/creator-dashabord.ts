import type { MissionAction } from '$lib/schema/mission.schema';
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

export interface CreatorMarketplaceData {
	subscriberCount: number;
	followerCount: number;
	purchaseCount: number;
	productCount: number;
	products: Product[];
	missionActionItems: MissionAction[];
}
