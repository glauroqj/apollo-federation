export default (responseError) => {
  const ImagesDog = async (parent, { _ }, { dataSources }, info) => {
    const { dogsApi } = dataSources;
    info.cacheControl.setCacheHint({ maxAge: 50, scope: "PUBLIC" });

    try {
      const request = await dogsApi.imagesDog();

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
