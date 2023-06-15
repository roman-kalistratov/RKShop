const favoriteUtils = {
  check: ({ listFavorites, productId }) => listFavorites && listFavorites.products.find(e => e.id === productId) !== undefined
 
};

export default favoriteUtils;