export default function sumObjectElement(arrayOfObjects, key) {
  return this.reduce((a, b) => a + (b[key] || 0), 0);
}
