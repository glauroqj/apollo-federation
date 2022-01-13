export default (responseError) => {
  const v1_app_ImagesDog = async (parent, { _ }, { dataSources }, info) => {
    const { v1_app_dogsApi } = dataSources;
    info.cacheControl.setCacheHint({ maxAge: 50, scope: "PUBLIC" });

    try {
      const request = await v1_app_dogsApi.imagesDog();
      console.log("< DOGS API v1 > ", request);

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
    v1_app_ImagesDog,
  };
};
