export type ItemStatus = "AVAILABLE" | "IN_USE" | "REPAIR";
export type Role = "USER" | "ADMIN";
export type RentalAction = "RENT" | "RETURN";

export type Item = {
	id: string;
	name: string;
	brand: string;
	purchaseDate: string | null;
	status: ItemStatus;
	assignedTo: string | null;
	returnDate: string | null;
	notes: string | null;
};

export type User = {
	id: string;
	email: string;
	name: string;
	role: Role;
	image: string | null;
};

export type RentalHistoryEntry = {
	id: string;
	action: RentalAction;
	itemId: string;
	userId: string;
	note: string | null;
	createdAt: string;
};

export const currentUser: User = {
	id: "user_admin_1",
	email: "admin@booksy.com",
	name: "Alex Admin",
	role: "ADMIN",
	image: null,
};

export const items: Item[] = [
	{
		id: "item_1",
		name: "Apple iPhone 13 Pro Max",
		brand: "Apple",
		purchaseDate: "2021-11-23",
		status: "AVAILABLE",
		assignedTo: null,
		returnDate: null,
		notes: null,
	},
	{
		id: "item_2",
		name: "Apple MacBook Pro 13",
		brand: "Apple",
		purchaseDate: "2021-12-20",
		status: "IN_USE",
		assignedTo: "j.doe@booksy.com",
		returnDate: "2026-05-15",
		notes: null,
	},
	{
		id: "item_3",
		name: "Dell XPS 15 9510",
		brand: "Dell",
		purchaseDate: "2022-03-15",
		status: "AVAILABLE",
		assignedTo: null,
		returnDate: null,
		notes: "Battery swelling — needs service before issuing",
	},
	{
		id: "item_4",
		name: "iPad Pro 12.9",
		brand: "Apple",
		purchaseDate: "2023-05-22",
		status: "AVAILABLE",
		assignedTo: null,
		returnDate: null,
		notes: null,
	},
	{
		id: "item_5",
		name: "Lenovo ThinkPad X1",
		brand: "Lenovo",
		purchaseDate: "2023-01-01",
		status: "REPAIR",
		assignedTo: null,
		returnDate: null,
		notes: null,
	},
	{
		id: "item_6",
		name: "Logitech MX Master 3",
		brand: "Logitech",
		purchaseDate: "2024-10-10",
		status: "AVAILABLE",
		assignedTo: null,
		returnDate: null,
		notes: null,
	},
	{
		id: "item_7",
		name: "MacBook Air M2",
		brand: "Apple",
		purchaseDate: "2023-08-01",
		status: "AVAILABLE",
		assignedTo: null,
		returnDate: null,
		notes: "Returned with liquid damage — keyboard sticky",
	},
	{
		id: "item_8",
		name: "Razer Basilisk V2",
		brand: "Razer",
		purchaseDate: "2021-06-05",
		status: "REPAIR",
		assignedTo: null,
		returnDate: null,
		notes: null,
	},
	{
		id: "item_9",
		name: "SAMSUNG Galaxy S21",
		brand: "Samsung",
		purchaseDate: "2021-11-23",
		status: "AVAILABLE",
		assignedTo: null,
		returnDate: null,
		notes: null,
	},
	{
		id: "item_10",
		name: "Sony WH-1000XM4",
		brand: "Sony",
		purchaseDate: "2022-01-12",
		status: "IN_USE",
		assignedTo: "a.smith@booksy.com",
		returnDate: "2026-05-10",
		notes: null,
	},
	{
		id: "item_11",
		name: "Unknown Device",
		brand: "Unknown",
		purchaseDate: null,
		status: "REPAIR",
		assignedTo: null,
		returnDate: null,
		notes: "Unidentified — pending audit",
	},
];

export const rentalHistory: RentalHistoryEntry[] = [
	{
		id: "rh_1",
		action: "RENT",
		itemId: "item_2",
		userId: "user_jdoe",
		note: "Picked up for Q2 development work",
		createdAt: "2026-04-15T09:12:00.000Z",
	},
	{
		id: "rh_2",
		action: "RENT",
		itemId: "item_10",
		userId: "user_asmith",
		note: "Daily calls headset",
		createdAt: "2026-04-10T14:30:00.000Z",
	},
	{
		id: "rh_3",
		action: "RETURN",
		itemId: "item_7",
		userId: "user_jdoe",
		note: "Liquid damage flagged on return",
		createdAt: "2026-03-28T17:05:00.000Z",
	},
	{
		id: "rh_4",
		action: "RENT",
		itemId: "item_7",
		userId: "user_jdoe",
		note: null,
		createdAt: "2026-02-12T10:00:00.000Z",
	},
	{
		id: "rh_5",
		action: "RETURN",
		itemId: "item_4",
		userId: "user_asmith",
		note: null,
		createdAt: "2026-01-20T16:45:00.000Z",
	},
];
