export class ApiResponseDto<T> {
    message: string;

    status: number;

    data?: T;
}
