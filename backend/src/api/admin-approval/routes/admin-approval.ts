export default {
  routes: [
    {
      method: "GET",
      path: "/admin-approval/pending-users",
      handler: "admin-approval.getPendingUsers",
      config: { policies: [] },
    },
    {
      method: "GET",
      path: "/admin-approval/all-users",
      handler: "admin-approval.getAllUsers",
      config: { policies: [] },
    },
    {
      method: "PUT",
      path: "/admin-approval/approve/:userId",
      handler: "admin-approval.approveUser",
      config: { policies: [] },
    },
    {
      method: "PUT",
      path: "/admin-approval/reject/:userId",
      handler: "admin-approval.rejectUser",
      config: { policies: [] },
    },
    {
      method: "DELETE",
      path: "/admin-approval/delete/:userId",
      handler: "admin-approval.deleteUser",
      config: { policies: [] },
    },
    {
      method: "GET",
      path: "/admin-approval/user-detail/:userId",
      handler: "admin-approval.getUserDetail",
      config: { policies: [] },
    },
    {
      method: "PUT",
      path: "/admin-approval/block/:userId",
      handler: "admin-approval.blockUser",
      config: { policies: [] },
    },
    {
      method: "PUT",
      path: "/admin-approval/unblock/:userId",
      handler: "admin-approval.unblockUser",
      config: { policies: [] },
    },
    {
      method: "PUT",
      path: "/admin-approval/block-provider/:userId",
      handler: "admin-approval.blockProviderSubscription",
      config: { policies: [] },
    },
    {
      method: "POST",
      path: "/admin-approval/check-status",
      handler: "admin-approval.checkStatus",
      config: { auth: false },
    },
    {
      method: "GET",
      path: "/admin-approval/provider-profiles",
      handler: "admin-approval.getProviderProfiles",
      config: { policies: [], auth: false },
    },
  ],
};
