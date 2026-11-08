import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getMyProfile, sendFeedback, uploadProfileImage } from "./api";

import type { Profile } from "./types";

export const userKeys = {
  me: ["user", "me"] as const,
};

export function useMyProfile() {
  return useQuery({ queryKey: userKeys.me, queryFn: getMyProfile });
}

/** 바뀐 내 정보를 캐시에 넣고, 닉네임을 쓰는 홈도 다시 불러온다. */
export function useSetMyProfile() {
  const queryClient = useQueryClient();
  return (profile: Profile) => {
    queryClient.setQueryData(userKeys.me, profile);
    return queryClient.invalidateQueries({ queryKey: ["home"] });
  };
}

export function useUploadProfileImage() {
  const setProfile = useSetMyProfile();
  return useMutation({ mutationFn: uploadProfileImage, onSuccess: setProfile });
}

export function useSendFeedback() {
  return useMutation({ mutationFn: sendFeedback });
}
