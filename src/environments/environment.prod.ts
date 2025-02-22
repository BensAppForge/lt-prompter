export const environment = {
  production: true,
  version: '0.7.2 - beta', // Current app version - update this when releasing new versions
  appName: 'LT Prompter',
  // Add other environment-specific configuration here
} as const;

// Type for environment configuration
export type Environment = typeof environment;
