import { selector } from "recoil";
import { itemState } from "../atoms/item";

export const itemDetails = selector({
    key: "itemDetailsState",
    get: ({ get }) => {
        const state = get(itemState);
        return state.item;
    }
})
export const itemTitle = selector({
    key: 'itemTitleState',
    get: ({ get }) => {
        const state = get(itemState);
        if (state.item) {
            //@ts-ignore
            return state.item.title;
        }
        return "";
    },
});
export const itemDescription = selector({
    key: 'itemDescriptionState',
    get: ({ get }) => {
        const state = get(itemState);
        if (state.item) {
            //@ts-ignore
            return state.item.description;
        }
        return "";
    },
});
export const itemPrice = selector({
    key: 'itemPriceState',
    get: ({ get }) => {
        const state = get(itemState);
        if (state.item) {
            //@ts-ignore
            return state.item.price;
        }
        return 0;
    },
});
export const itemItemImageLink = selector({
    key: 'itemItemImageLinkState',
    get: ({ get }) => {
        const state = get(itemState);
        if (state.item) {
            //@ts-ignore
            return state.item.itemImageLink;
        }
        return "";
    },
});
export const itemCategory = selector({
    key: 'itemCategoryState',
    get: ({ get }) => {
        const state = get(itemState);
        if (state.item) {
            //@ts-ignore
            return state.item.category;
        }
        return "";
    },
});
export const itemRating = selector({
    key: 'itemRatingState',
    get: ({ get }) => {
        const state = get(itemState);
        if (state.item) {
            //@ts-ignore
            return state.item.rating;
        }
        return 0;
    },
});
export const itemSizes = selector({
    key: 'itemSizesState',
    get: ({ get }) => {
        const state = get(itemState);
        if (state.item) {
            //@ts-ignore
            return state.item.sizes;
        }
        return "";
    },
});
export const itemColor = selector({
    key: 'itemColorState',
    get: ({ get }) => {
        const state = get(itemState);
        if (state.item) {
            //@ts-ignore
            return state.item.color;
        }
        return "";
    },
});
export const itemItemId = selector({
    key: 'itemItemIdState',
    get: ({ get }) => {
        const state = get(itemState);
        if (state.item) {
            //@ts-ignore
            return state.item._id;
        }
        return "";
    },
});