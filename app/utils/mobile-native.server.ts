import invariant from "tiny-invariant";

export const isNativeSSR = (request: Request) =>{
    const ua = request.headers.get("user-agent");
    invariant(ua);
    return {
        isMobileApp: (ua.includes("isIOS") || ua.includes("isAndroid")),
        isIOS: ua.includes("isIOS"),
        isAndroid: ua.includes("isAndroid")
    }
}