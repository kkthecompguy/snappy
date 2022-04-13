export const host: string = "http://localhost:3001"
const baseurl: string = `${host}/api/v1/`;
const apiRoutes = {
  registerRoute: `${baseurl}auth/register`,
  loginRoute: `${baseurl}auth/login`,
  setAvatarRoute: `${baseurl}users/set/avatar/`,
  usersRoute: `${baseurl}users/list/`,
  addMessageRoute: `${baseurl}messages/create`,
  listMessageRoute: `${baseurl}messages/list`
}

export default apiRoutes;