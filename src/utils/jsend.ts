class Jsend {
    static success(data: any = null) {
        return {
            status: "success",
            data
        }
    };

    static fail(message: string | null = null, data: any = null) {
        return {
            status: "fail",
            message,
            data
        }
    };

    static error(message: any) {
        return {
            status: "error",
            message
        }
    }
}

export default Jsend;