export const environment = {
  production: true,
  version: '1.6.3', // Current app version - update this when releasing new versions
  appName: 'LT Prompter',
  // Add other environment-specific configuration here
} as const;

// Type for environment configuration
export type Environment = typeof environment;
