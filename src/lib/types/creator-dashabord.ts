export interface CreatorDashboard {
	subscriberCount: number;
	revenue: number;
	rewardsUsed: number;
	purchaseCount: number;
	purchaseAmount: number;
	productPurchaseList: ProductPurchase[] | [];
}

export interface ProductPurchase {
	id: number;
	name: string;
	follower: string;
	handle: string;
	cost: number;
}
