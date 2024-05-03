export function addToWishlist(item) {
  return new Promise(async (resolve) => {
    const response = await fetch("/wishlist", {
      method: "POST",
      body: JSON.stringify(item),
      headers: { "content-type": "application/json" },
    });
    const data = await response.json();
    resolve({ data });
  });
}

export function fetchWishlistItemsByUserId() {
  return new Promise(async (resolve) => {
    const response = await fetch("/wishlist");
    const data = await response.json();
    resolve({ data });
  });
}

export function deleteItemFromWishlist(itemId) {
  return new Promise(async (resolve) => {
    const response = await fetch("/wishlist/" + itemId, {
      method: "DELETE",
      headers: { "content-type": "application/json" },
    });
    const data = await response.json();
    resolve({ data: { id: itemId } });
  });
}
