export const formatHostName = (hostPayload) => {
  const host = hostPayload?.host || hostPayload;
  const fullName = [host?.firstName, host?.lastName].filter(Boolean).join(" ").trim();
  return host?.displayName || host?.name || fullName || host?.businessName || "";
};

export const getEventHost = (event, hostProfile = event?.hostProfile) => {
  const host = hostProfile?.host || hostProfile;
  const eventHost = event?.host;

  return {
    hostName: formatHostName(hostProfile) || formatHostName(eventHost) || event?.organizerName,
    hostAvatar: hostProfile?.profilePhotoUrl || hostProfile?.profileImageUrl ||
      host?.profilePhotoUrl || host?.profileImageUrl || host?.avatar ||
      eventHost?.profilePhotoUrl || eventHost?.profileImageUrl || eventHost?.avatar,
    hostLeadUserId: host?.leadUserId || hostProfile?.leadUserId ||
      event?.leadUserId || eventHost?.leadUserId || event?.hostId,
  };
};
