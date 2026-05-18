import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { CoachRequest, CoachResponse } from "@/lib/coach-types";

export function useCoach() {
  return useMutation<CoachResponse, Error, CoachRequest>({
    mutationFn: (input) => api.post<CoachResponse>("/api/coach", input),
  });
}
