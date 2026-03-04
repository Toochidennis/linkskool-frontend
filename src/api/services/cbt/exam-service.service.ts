import { apiRequest } from "#/api/client"

export const examService = {
    async downloadExamZip(examId: number) {
        const response = await apiRequest<Blob>(`cbt/exams/${examId}/download`, {
            method: "GET",
            responseType: "blob",
        });
        return response.data;
    },
    async getCoursesWithExams(examTypeId: number) {
        const response = await apiRequest(`/cbt/exams/${examTypeId}/courses`, {
            method: "GET"
        });
        return response.data;
    },
    async getExamQuestions(examId: number) {
        const response = await apiRequest(`/cbt/exams/${examId}/questions`, {
            method: "GET"
        });
        return response.data;
    }
}