import type { DefaultMission } from '$lib/schema/mission.schema';
import type { Product } from '$lib/schema/product.schema';
import type { ProductInvoiceResult } from '$lib/schema/product_invoice.schema';
import type { User } from 'lucia';

export interface CreatorDashboard {
	subscriberCount: number;
	revenue: number;
	creditsUsed: number;
	purchaseCount: number;
	purchaseAmount: number;
	followerCount: number;
	productCount: number;
	productPurchaseList: ProductInvoiceResult[] | [];
}

export interface UserDashboardData {
	user: User;
	dashboard: CreatorDashboard;
}

export interface UserPageData {
	user: User;
}

export interface CreatorMarketplaceData {
	subscriberCount: number;
	followerCount: number;
	purchaseCount: number;
	productCount: number;
	products: Product[];
	missions: DefaultMission[];
}
