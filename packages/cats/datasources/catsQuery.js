export default (responseError) => {
  const ImagesSearch = async (parent, { id }, { dataSources }, info) => {
    const { catsApi } = dataSources;
    // info.cacheControl.setCacheHint({ maxAge: 0, scope: 'PUBLIC' })
    try {
      return await catsApi.imagesSearch();
    } catch (error) {
      responseError(error);
    }
  };

  return {
    ImagesSearch,
  };
};
