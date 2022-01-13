export default (responseError) => {
  const v2_app_ImagesDog = async (parent, { _ }, { dataSources }, info) => {
    const { v2_app_dogsApi } = dataSources;
    info.cacheControl.setCacheHint({ maxAge: 50, scope: "PUBLIC" });

    try {
      const request = await v2_app_dogsApi.imagesDog();
      console.log("< DOGS API v2 > ", request);

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
    v2_app_ImagesDog,
  };
};
