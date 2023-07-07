import { Capacitor } from "@capacitor/core";

export const isIOS = Capacitor.getPlatform() === "ios";
export const isAndroid = Capacitor.getPlatform() === "android";
export const isNative = Capacitor.isNativePlatform();

export const IsMobileNative = ({ children }: { children: React.ReactNode }) => {
   return isNative ? <>{children}</> : null;
};
