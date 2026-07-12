export const environment = {
  production: false,
  version: '1.7.1', // Current app version - update this when releasing new versions
  appName: 'LT Prompter',
  // Add other environment-specific configuration here
} as const;

// Type for environment configuration
export type Environment = typeof environment;
