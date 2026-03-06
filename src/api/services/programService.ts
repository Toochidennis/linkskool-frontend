import { apiRequest } from "../client";
import type { Program } from "../models/program";
import type { CourseEnrollmentRequest } from "../models/enrollment";
import type { ProgramCourses } from "../models/program-courses";
import type { CourseDetail } from "../models/course-detail";

export const programService = {
    async getAllPrograms(signal?: AbortSignal) {
        const response = await apiRequest<Program[]>('programs', {
            method: "GET",
            signal: signal,
        });
        return response.data;
    },
    async getProgramCourses(programSlug: string, signal?: AbortSignal) {
        const response = await apiRequest<ProgramCourses>(`programs/${programSlug}/courses`, {
            method: "GET",
            signal,
        });
        return response.data;
    },
    async getProgramCourseCohortDetails(cohortSlug: string, signal?: AbortSignal) {
        const response = await apiRequest<CourseDetail>(`programs/cohorts/${cohortSlug}`, {
            method: "GET",
            signal,
        });
        return response.data;
    },
    async enrollInCourse(cohortId: number, payload: CourseEnrollmentRequest, signal?: AbortSignal) {
        const response = await apiRequest(`learning/cohorts/${cohortId}/enrollments`, {
            method: "POST",
            signal,
            body: payload,
        });
        return response.data;
    },
};
