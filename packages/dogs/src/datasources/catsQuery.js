export default (responseError) => {
  const ImagesSearch = async (parent, { _ }, { dataSources }, info) => {
    const { catsApi } = dataSources;
    // info.cacheControl.setCacheHint({ maxAge: 0, scope: 'PUBLIC' })
    try {
      const request = await catsApi.imagesSearch();
      console.log("< CATS API > ", request, request[0]);

      return {
        data: {
          ...request[0],
        },
      };
    } catch (error) {
      responseError(error);
    }
  };

  return {
    ImagesSearch,
  };
};
