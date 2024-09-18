import type { DefaultMission } from '$lib/schema/mission.schema';
import type { Product } from '$lib/schema/product.schema';
import type { ProductInvoiceResult } from '$lib/schema/product_invoice.schema';
import type { User } from 'lucia';

export interface CreatorDashboard {
	subscribers: { handle: string }[];
	followers: { handle: string }[];
	revenue: number;
	creditsDistributed: number;
	purchaseCount: number;
	purchaseAmount: number;
	productCount: number;
	productPurchaseList: ProductInvoiceResult[] | [];
	products: Product[];
	missions: DefaultMission[];
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
