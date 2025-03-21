export {}; // Treat this file as a module.

declare global {
  var signin: (userId?: string) => string[];
}
