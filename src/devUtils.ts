export function logger(logItem: any): void {
  console.error(JSON.stringify(logItem, null, 4));
}
