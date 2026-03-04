import { apiRequest } from "../client";
import type { Cohort } from "../models/cohort";
import type { Program } from "../models/program";
import type { CohortEnrollmentRequest } from "../models/enrollment";
import { toCamel } from "../util/transform";

export type AgeRange = { min: number; max: number };
export type ProgramFilters = {
    profileId?: number;
    birthDate?: string;
    ageRanges?: AgeRange[];
    signal?: AbortSignal;
};

export const programService = {
    async getPrograms(filters: ProgramFilters = {}) {
        const params = new URLSearchParams();
        if (filters.profileId !== undefined) {
            params.set("profile_id", String(filters.profileId));
        }
        // if (filters.birthDate) {
        //     params.set("birth_date", filters.birthDate);
        // }
        // if (filters.ageRanges && filters.ageRanges.length > 0) {
        //     params.set("age_ranges", JSON.stringify(filters.ageRanges));
        // }

        const path = params.toString() ? `learning/programs?${params.toString()}` : "learning/programs";
        const response = await apiRequest<Program[]>(path, {
            method: "GET",
            signal: filters.signal,
        });
        return toCamel(response.data) as Program[];
    },
    async getCohort(cohortId: number, signal?: AbortSignal) {
        const response = await apiRequest<Cohort>(`learning/cohorts/${cohortId}`, {
            method: "GET",
            signal,
        });
        return toCamel(response.data) as Cohort;
    },
    async enrollInCohort(cohortId: number, payload: CohortEnrollmentRequest, signal?: AbortSignal) {
        const response = await apiRequest(`learning/cohorts/${cohortId}/enrollments`, {
            method: "POST",
            signal,
            body: payload,
        });
        return response.data;
    },
};
