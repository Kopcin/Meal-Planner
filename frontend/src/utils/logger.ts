export function logInBrowser(...args: any) {
    if (typeof window !== "undefined") {
        console.log(...args);
    }
}

export function logInNode(...args: any) {
    if (typeof process !== "undefined") {
        console.log(...args);
    }
}
