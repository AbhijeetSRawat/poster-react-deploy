class ApiResponse {
    constructor(statusCode, data, message) {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = true;  // Ensure this is true for successful responses
    }

    toJSON() {
        return {
            success: this.success,
            statusCode: this.statusCode,
            data: this.data,
            message: this.message,
        };
    }
}

export { ApiResponse };
