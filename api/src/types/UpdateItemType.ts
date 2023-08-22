export interface UpdateItemType extends Document{
    title: string;
    description: string | 'Description not found';
    price: number;
    itemImageLink: string;
    category: string | 'Category not found';
    rating: number;
    sizes: string;
    color: string;
}