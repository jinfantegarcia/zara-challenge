import '@testing-library/jest-dom/vitest';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { API_TEST_URL } from './mocks/handlers';
import { server } from './mocks/server';

process.env.API_BASE_URL = API_TEST_URL;
process.env.API_KEY = 'test-api-key';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
