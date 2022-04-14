export const host: string = process.env.REACT_APP_HOST || "http://localhost:3001"
const baseurl: string = `/api/v1/`;
const apiRoutes = {
  registerRoute: `${baseurl}auth/register`,
  loginRoute: `${baseurl}auth/login`,
  setAvatarRoute: `${baseurl}users/set/avatar/`,
  usersRoute: `${baseurl}users/list/`,
  addMessageRoute: `${baseurl}messages/create`,
  listMessageRoute: `${baseurl}messages/list`
}

export default apiRoutes;