/**
 * Feature Flags Configuration
 * 
 * Centralized toggles for development features.
 */
export const FEATURE_FLAGS = {
  /**
   * Toggles the use of mock data for the relationship management feature.
   * If `true`, the UI will render predefined mock parentescos and requests
   * instead of fetching them from the backend.
   * 
   * @default false
   */
  USE_RELATIONSHIP_MOCKS: false,

  /**
   * Toggles the use of mock data for the colonies list.
   * If `true`, the UI will render a predefined list of colonies 
   * instead of fetching from the API.
   * 
   * @default false
   */
  USE_COLONY_MOCKS: false,

  /**
   * Toggles the use of mock data for the members of a specific colony.
   * If `true`, viewing a colony's members will display mock users 
   * instead of fetching from the API.
   * 
   * @default false
   */
  USE_COLONY_MEMBER_MOCKS: false,
};
