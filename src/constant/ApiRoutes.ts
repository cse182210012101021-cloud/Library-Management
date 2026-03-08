import Api from "@/utils/Api";

export const getStudentApi = (email: string) => {
  return Api.GET(`/api/student/${email}`);
};

export const signUpApi = () => {
  return Api.POST("/api/sign-up");
};

export const signInApi = () => {
  return Api.POST("/api/sign-in");
};

export const signOutApi = () => {
  return Api.POST("api/sign-out");
};

export const addBookApi = () => {
  return Api.POST("/api/book");
};

export const deleteBookApi = (id: string) => {
  return Api.DELETE(`/api/book/${id}`);
};

export const updateBookApi = (id: string) => {
  return Api.PATCH(`/api/book/${id}`);
};

export const createApplicationApi = () => {
  return Api.POST("/api/student/application");
};

export const deleteApplicationApi = (id: string) => {
  return Api.DELETE(`/api/student/application/${id}`);
};

export const updateApplicationApi = (id: string) => {
  return Api.PATCH(`/api/student/application/${id}`);
};

export const returnBookApi = (id: string) => {
  return Api.POST(`/api/student/application/${id}/return`);
};

export const updateApplicationStatusApi = (id: string) => {
  return Api.PATCH(`/api/application/${id}`);
};

export const fineRulesApi = () => {
  return Api.GET("/api/fine-rules");
};

export const membersApi = () => {
  return Api.GET("/api/members");
};

export const memberDetailsApi = (id: string) => {
  return Api.GET(`/api/members/${id}`);
};

export const updateFineRulesApi = () => {
  return Api.POST("/api/fine-rules");
};

export const updateMeApi = () => {
  return Api.PATCH("/api/me");
};
