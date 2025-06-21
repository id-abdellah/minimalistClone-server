export function genID(prefix: string = "", suffix: string = "") {
    const id = prefix + crypto.randomUUID().replace(/-/g, "") + suffix;
    return id;
}