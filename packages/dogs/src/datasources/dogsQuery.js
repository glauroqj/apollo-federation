export default (responseError) => {
  const ImagesDog = async (parent, { _ }, { dataSources }, info) => {
    const { dogsApi } = dataSources;
    // info.cacheControl.setCacheHint({ maxAge: 0, scope: 'PUBLIC' })
    try {
      const request = await dogsApi.imagesDog();
      console.log("< DOGS API > ", request);

      return {
        data: {
          ...request,
        },
      };
    } catch (error) {
      responseError(error);
    }
  };

  return {
    ImagesDog,
  };
};
